// eslint-disable-next-line import/no-extraneous-dependencies
import { BigNumber, BytesLike } from 'ethers';

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
