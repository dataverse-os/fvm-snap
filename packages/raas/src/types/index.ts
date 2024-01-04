import { BigNumber, BytesLike, Wallet } from "ethers";

export interface IRaaSProvider {
  signer: Wallet;
  getApiKey: () => Promise<string>;
  uploadFile: (input: UploadInput) => Promise<any>;
  downloadFile: (cid: string) => Promise<Blob>;
  getUploadedFiles: () => Promise<any[]>;
  submitCidToContract: (cid: string) => Promise<SubmitOutput>;
  submitTaskToRaas: (raasTask: RaasTask) => Promise<any>;
  getProof: (cid: string) => Promise<any>;
  getDealStatus: (cid: string) => Promise<any>;
  getAllDeals: (cid: string) => Promise<any>;
  getActiveDeals: (cid: string) => Promise<any>;
  getExpiringDeals: (cid: string, epochs: number) => Promise<any>;
  getStorageSize: () => Promise<StorageSize>;
}

export type SubmitOutput = {
  id: BigNumber;
  cid: BytesLike;
  txHash: BytesLike;
};

export type RaasTask = {
  cid: string;
  endDate: number;
  replicationTarget: number;
  epochs: number;
};

export type UploadOutput = {
  pieceCid: string;
  fileName: string;
  payloadCid: string;
  mimeType: string;
  userName: string;
  createdAt: number;
  carSize: number;
  lastUpdate: number;
  fileStatus: string;
  fileSize: number;
  id: string;
  pieceSize: number;
};

export type UploadInput = {
  fileName: string;
  blob: Blob;
};

export type DealInfos = {
  txID: {
    type: string;
    hex: string;
  };
  dealID: number[];
  inclusion_proof: {
    proofIndex: {
      index: string;
      path: string[];
    };
    proofSubtree: {
      index: string;
      path: string[];
    };
  };
  verifier_data: {
    commPc: string;
    sizePc: number;
  };
  miner: string[];
};

export type GeneratedType = {
  dealInfos: DealInfos;
  jobType: string;
  replicationTarget: number;
  epochs: string;
  currentActiveDeals: any[];
};

export type StorageSize = {
  /**
   * Data limit in bytes
   */
  dataLimit: number;
  /**
   * Data used in bytes
   */
  dataUsed: number;
};
