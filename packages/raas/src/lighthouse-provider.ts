import lighthouse from "@lighthouse-web3/sdk";
import { lighthouseConfig } from "@lighthouse-web3/sdk/dist/lighthouse.config";
import axios from "axios";
import { Wallet, ethers } from "ethers";

import {
  IRaaSProvider,
  RaasTask,
  StorageSize,
  SubmitOutput,
  UploadInput,
  UploadOutput,
} from "./types";
import { dealStatusABI, lighthouseSmartContractAddress } from "./util";

export class LightHouseProvider implements IRaaSProvider {
  signer: Wallet;
  apiKey?: string;

  constructor(signer: Wallet) {
    this.signer = signer;
  }

  /**
   * get lighthouse api key by signing a message
   * @returns lighthouse api key
   */
  async getApiKey() {
    const publicKey = await this.signer.getAddress(); // >> Example: '0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1'
    const verificationMessage = (
      await axios.get(
        `https://api.lighthouse.storage/api/auth/get_message?publicKey=${publicKey}`,
      )
    ).data;
    const signedMessage = await this.signer.signMessage(verificationMessage);
    const response = await lighthouse.getApiKey(publicKey, signedMessage);
    const apiKey = response.data.apiKey;
    this.apiKey = apiKey;
    return apiKey;
  }
  /**
   * upload file to lighthouse
   */
  async uploadFile(input: UploadInput) {
    if (!this.apiKey) throw new Error("Get Api Key first");
    try {
      const token = `Bearer ${this.apiKey}`;
      const endpoint = `${lighthouseConfig.lighthouseNode}/api/v0/add?wrap-with-directory=false`;

      // Upload file
      const formData = new FormData();
      formData.append("file", input.blob, input.fileName);
      const boundary = Symbol();

      const response = await axios.post<{
        Hash: string;
        Name: string;
        Size: string;
      }>(endpoint, formData, {
        // withCredentials: false,
        maxContentLength: Infinity, // this is needed to prevent axios from erroring out with large directories
        maxBodyLength: Infinity,
        headers: {
          "Content-type": `multipart/form-data; boundary= ${boundary.toString()}`,
          Encryption: `${false}`,
          Authorization: token,
          "X-Deal-Parameter": "null",
        },
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }
  /**
   * download file from lighthouse
   * @param cid lighthouse file cid
   * @returns file blob
   */
  async downloadFile(cid: string) {
    const lighthouseDealDownloadEndpoint =
      "https://gateway.lighthouse.storage/ipfs/";
    const response = await axios({
      method: "GET",
      url: `${lighthouseDealDownloadEndpoint}${cid}`,
      responseType: "arraybuffer",
    });
    return response.data;
  }
  /**
   * get uploaded files from lighthouse
   */
  async getUploadedFiles() {
    if (!this.apiKey) throw new Error("Get Api Key first");
    const res = await lighthouse.getUploads(this.apiKey);
    if (res.data.fileList.length > 0) {
      return res.data.fileList;
    }
    return [];
  }
  /**
   * submit file cid to contract for synthesizing large files from small files
   */
  async submitCidToContract(cid: string) {
    const dealStatusInst = new ethers.Contract(
      lighthouseSmartContractAddress,
      dealStatusABI,
      this.signer,
    );
    const output: Partial<SubmitOutput> = {};
    await dealStatusInst
      .submit(ethers.utils.toUtf8Bytes(cid))
      .then(async (tx: any) => {
        const r = await tx.wait();
        const txHash = r.transactionHash;
        r.events.forEach((e: any) => {
          if (e.event === "SubmitAggregatorRequest") {
            output.id = e.args.id;
            output.cid = e.args.cid;
            output.txHash = txHash;
          }
        });
      });
    return output as SubmitOutput;
  }
  /**
   * submit task to raas service
   */
  async submitTaskToRaas(raasTask: RaasTask) {
    const formData = new FormData();

    formData.append("cid", raasTask.cid);
    formData.append("endDate", raasTask.endDate.toString());
    formData.append("replicationTarget", raasTask.replicationTarget.toString());
    formData.append("epochs", raasTask.epochs.toString());

    const response = await axios.post(
      `https://calibration.lighthouse.storage/api/register_job`,
      formData,
    );
    return response.data;
  }
  async getProof(cid: string) {
    const podsi = await axios.get(
      `https://api.lighthouse.storage/api/lighthouse/get_proof?cid=${cid}&network=testnet`,
    );
    return podsi.data;
  }
  async getDealStatus(cid: string) {
    const config = {
      method: "get",
      url: `https://calibration.lighthouse.storage/api/deal_status?cid=${cid}`,
    };

    return await axios(config).then(function (response) {
      return response.data;
    });
  }
  async getAllDeals(cid: string) {
    const dealStatusInst = new ethers.Contract(
      lighthouseSmartContractAddress,
      dealStatusABI,
      this.signer,
    );
    return await dealStatusInst.callStatic.getAllDeals(
      ethers.utils.hexlify(ethers.utils.toUtf8Bytes(cid)),
    );
  }
  async getActiveDeals(cid: string) {
    const dealStatusInst = new ethers.Contract(
      lighthouseSmartContractAddress,
      dealStatusABI,
      this.signer,
    );
    return await dealStatusInst.callStatic.getActiveDeals(
      ethers.utils.hexlify(ethers.utils.toUtf8Bytes(cid)),
    );
  }
  async getExpiringDeals(cid: string, epochs: number) {
    const dealStatusInst = new ethers.Contract(
      lighthouseSmartContractAddress,
      dealStatusABI,
      this.signer,
    );
    return await dealStatusInst.callStatic.getExpiringDeals(
      ethers.utils.hexlify(ethers.utils.toUtf8Bytes(cid)),
      epochs,
    );
  }
  async getStorageSize() {
    const publicKey = await this.signer.getAddress();
    const response = await axios.get<StorageSize>(
      `https://api.lighthouse.storage/api/user/user_data_usage?publicKey=${publicKey}`,
    );
    return response.data;
  }
  /**
   * get lighthouse auth token by signer
   */
  async getAuthToken() {
    const apiKey = await this.getApiKey();
    const response = await lighthouse.dataDepotAuth(apiKey);
    return response.data.access_token;
  }
  /**
   * get latest uploaded file status from lighthouse
   */
  async getLatestUploadedFileStatus() {
    const authToken = await this.getAuthToken();
    // query uploaded file detail
    const viewCar = await lighthouse.viewCarFiles(1, authToken);
    this.sortCarFiles(viewCar.data);
    return viewCar.data.pop() as UploadOutput;
  }

  private sortCarFiles(carInfos: any) {
    const sortByCreatedAt = (a: any, b: any) => {
      if (a.createdAt < b.createdAt) {
        return -1;
      }

      if (a.createdAt > b.createdAt) {
        return 1;
      }
      return 0;
    };

    carInfos.sort(sortByCreatedAt);
  }
}
