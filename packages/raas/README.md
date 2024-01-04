# fvm-raas-provider

[![npm version](https://img.shields.io/npm/v/@dataverse/fvm-raas-provider.svg)](https://www.npmjs.com/package/@dataverse/fvm-raas-provider)
![npm](https://img.shields.io/npm/dw/@dataverse/fvm-raas-provider)
[![License](https://img.shields.io/npm/l/@dataverse/fvm-raas-provider.svg)](https://github.com/dataverse-os/fvm-raas-provider/blob/main/LICENSE.md)


## Overview

This repository provides [FEVM RaaS](https://docs.filecoin.io/smart-contracts/programmatic-storage/raas) utils which can upload small files to Lighthouse(or any other aggregator) and synthesize large files for storage on the Filecoin network.

## Features

```typescript
interface IRaaSProvider {
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
```

## Install

```
pnpm install @dataverse/fvm-raas-provider
```

## Usage
### init
```typescript
import { ethers } from "ethers";
import { ExternalProvider } from "@ethersproject/providers/src.ts/web3-provider";
import { RaasProvider, LightHouseProvider } from "@dataverse/fvm-raas-provider";

const provider = new ethers.providers.Web3Provider(
  window.ethereum as unknown as ExternalProvider,
);
const signer = await provider.getSigner();
// init RaaS provider with LightHouse(or any other aggregator)
const raasProvider = new RaasProvider(new LightHouseProvider(signer));
```

### use api
```typescript
const apiKey = await raasProvider.getApiKey();
const uploadedFiles = await raasProvider.getUploadedFiles();
```

