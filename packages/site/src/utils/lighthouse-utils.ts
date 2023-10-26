// import * as fs from 'fs';
// import { ReadStream } from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import lighthouse from '@lighthouse-web3/sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ethers, Wallet } from 'ethers';
// eslint-disable-next-line import/no-extraneous-dependencies
import { lighthouseConfig } from '@lighthouse-web3/sdk/dist/lighthouse.config';
import { dealStatusABI, lighthouseSmartContractAddress } from './constants';
import { RaasTask, SubmitOutput, UploadInput, UploadOutput } from './types';

// eslint-disable-next-line consistent-return
export const download = async (cid: string) => {
  const lighthouseDealDownloadEndpoint =
    'https://gateway.lighthouse.storage/ipfs/';
  const response = await axios({
    method: 'GET',
    url: `${lighthouseDealDownloadEndpoint}${cid}`,
    // responseType: 'blob',
  });
  try {
    return response;
  } catch (err) {
    console.error(`Error saving file: ${err}`);
  }
};

export const getLighthouseApiKey = async (signer: Wallet) => {
  const publicKey = await signer.getAddress(); // >> Example: '0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1'
  const verificationMessage = (
    await axios.get(
      `https://api.lighthouse.storage/api/auth/get_message?publicKey=${publicKey}`,
    )
  ).data;
  const signedMessage = await signer.signMessage(verificationMessage);
  const response = await lighthouse.getApiKey(publicKey, signedMessage);
  // console.log(response)
  return response.data.apiKey;
};

export const getAuthToken = async (signer: Wallet) => {
  const apiKey = await getLighthouseApiKey(signer);
  console.log('getAuthToken::apikey ', apiKey);
  const response = await lighthouse.dataDepotAuth(apiKey);
  console.log('getAuthToken::authToken: ', response.data.access_token);
  return response.data.access_token;
};

// export const saveResponseToFile = (response: any, filePath: string) => {
//   const writer = fs.createWriteStream(filePath);
//
//   // Pipe the response data to the file
//   response.data.pipe(writer);
//
//   return new Promise((resolve, reject) => {
//     writer.on('finish', () => resolve(filePath));
//     writer.on('error', (err) => {
//       console.error(err);
//       reject(err);
//     });
//   });
// };

export const getUploads = async (apiKey: string) => {
  const res = await lighthouse.getUploads(apiKey);
  console.log('getUploads: ', res);
  if (res.data.fileList.length > 0) {
    res.data.fileList.forEach((item) => {
      console.log(item);
    });
    return res.data.fileList;
  }
  return [];
};

export const submitCidToContract = async (signer: Wallet, cid: string) => {
  const dealStatusInst = new ethers.Contract(
    lighthouseSmartContractAddress,
    dealStatusABI,
    signer,
  );
  const output: Partial<SubmitOutput> = {};
  await dealStatusInst
    .submit(ethers.utils.toUtf8Bytes(cid))
    .then(async (tx: any) => {
      const r = await tx.wait();
      const txHash = r.transactionHash;
      r.events.forEach((e: any) => {
        if (e.event === 'SubmitAggregatorRequest') {
          console.log(
            `SubmitAggregatorRequest:
            id     : ${e.args.id}
            cid    : ${e.args.cid}
            txHash : ${txHash}
        `,
          );
          output.id = e.args.id;
          output.cid = e.args.cid;
          output.txHash = txHash;
        }
      });
    });
  return output as SubmitOutput;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const submitTaskToRaas = async (signer: Wallet, raasTask: RaasTask) => {
  const formData = new FormData();

  formData.append('cid', raasTask.cid);
  formData.append('endDate', raasTask.endDate.toString());
  formData.append('replicationTarget', raasTask.replicationTarget.toString());
  formData.append('epochs', raasTask.epochs.toString());

  const response = await axios.post(
    `https://calibration.lighthouse.storage/api/register_job`,
    formData,
  );
  return response.data;
};

export const uploadToLightHouse = async (signer: Wallet, file: UploadInput) => {
  const apiKey = await getLighthouseApiKey(signer);
  try {
    const token = `Bearer ${apiKey}`;
    const endpoint = `${lighthouseConfig.lighthouseNode}/api/v0/add?wrap-with-directory=false`;

    // Upload file
    const formData = new FormData();
    formData.append('file', file.blob, file.fileName);
    // eslint-disable-next-line symbol-description
    const boundary = Symbol();

    const response = await axios.post(endpoint, formData, {
      // withCredentials: false,
      maxContentLength: Infinity, // this is needed to prevent axios from erroring out with large directories
      maxBodyLength: Infinity,
      headers: {
        'Content-type': `multipart/form-data; boundary= ${boundary.toString()}`,
        Encryption: `${false}`,
        Authorization: token,
        'X-Deal-Parameter': 'null',
      },
    });

    return { data: response.data };
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

// todo: 上传的文件，查询不到文件cId
// export const uploadToDataDepot = async (
//   signer: Wallet,
//   file: ReadStream,
// ): Promise<UploadOutput> => {
//   const authToken = await getAuthToken(signer);
//   console.log('authToken: ', authToken);
//
//   // upload file to lighthouse dataDepot
//   const endpoint = `${lighthouseConfig.lighthouseDataDepot}/api/upload/upload_files`;
//   // eslint-disable-next-line no-eval
//   const FormData = eval(`require`)('form-data');
//
//   const formData = new FormData();
//   formData.append('file', file);
//   return await axios.post(endpoint, formData, {
//     maxContentLength: Infinity,
//     maxBodyLength: Infinity,
//     headers: {
//       ...formData.getHeaders(),
//       Authorization: `Bearer ${authToken}`,
//     },
//   });
// };

export const getLatestUploadedFileStatus = async (
  signer: Wallet,
): Promise<UploadOutput> => {
  const authToken = await getAuthToken(signer);
  console.log('authToken: ', authToken);
  // query uploaded file detail
  const viewCar = await lighthouse.viewCarFiles(1, authToken);
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  sortCarFiles(viewCar.data);
  return viewCar.data.pop() as UploadOutput;
};

const sortCarFiles = (carInfos: any) => {
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
  console.log('sorted');
  console.log(carInfos);
};

export const getProof = async (cid: string) => {
  console.log('cid: ', cid);
  const podsi = await axios.get(
    `https://api.lighthouse.storage/api/lighthouse/get_proof?cid=${cid}&network=testnet`,
  );
  return podsi.data;
};

export const getDealStatusByCid = async (cid: string) => {
  const config = {
    method: 'get',
    url: `https://calibration.lighthouse.storage/api/deal_status?cid=${cid}`,
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return await axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const getAllDeals = async (signer: Wallet, cid: string) => {
  const dealStatusInst = new ethers.Contract(
    lighthouseSmartContractAddress,
    dealStatusABI,
    signer,
  );
  return await dealStatusInst.callStatic.getAllDeals(
    ethers.utils.hexlify(ethers.utils.toUtf8Bytes(cid)),
  );
};

export const getActiveDeals = async (signer: Wallet, cid: string) => {
  const dealStatusInst = new ethers.Contract(
    lighthouseSmartContractAddress,
    dealStatusABI,
    signer,
  );
  return await dealStatusInst.callStatic.getActiveDeals(
    ethers.utils.hexlify(ethers.utils.toUtf8Bytes(cid)),
  );
};

export const getExpiringDeals = async (
  signer: Wallet,
  cid: string,
  epochs: number,
) => {
  const dealStatusInst = new ethers.Contract(
    lighthouseSmartContractAddress,
    dealStatusABI,
    signer,
  );
  return await dealStatusInst.callStatic.getExpiringDeals(
    ethers.utils.hexlify(ethers.utils.toUtf8Bytes(cid)),
    epochs,
  );
};
