import { IRaaSProvider, RaasTask, UploadInput } from "./types";

export class RaasProvider implements IRaaSProvider {
  private provider?: IRaaSProvider;

  constructor(provider?: IRaaSProvider) {
    this.provider = provider;
  }

  setProvider(provider: IRaaSProvider) {
    this.provider = provider;
  }

  get isProviderSet() {
    return !!this.provider;
  }
  get signer() {
    if (!this.provider) throw new Error("Provider not set");
    return this.provider.signer;
  }
  getApiKey() {
    if (!this.provider) throw new Error("Provider not set");
    return this.provider.getApiKey();
  }
  uploadFile(input: UploadInput) {
    if (!this.provider) throw new Error("Provider not set");
    return this.provider.uploadFile(input);
  }
  downloadFile(cid: string) {
    if (!this.provider) throw new Error("Provider not set");
    return this.provider.downloadFile(cid);
  }
  getUploadedFiles() {
    if (!this.provider) throw new Error("Provider not set");
    return this.provider.getUploadedFiles();
  }
  submitCidToContract(cid: string) {
    if (!this.provider) throw new Error("Provider not set");
    return this.provider.submitCidToContract(cid);
  }
  submitTaskToRaas(raasTask: RaasTask) {
    if (!this.provider) throw new Error("Provider not set");
    return this.provider.submitTaskToRaas(raasTask);
  }
  getProof(cid: string) {
    if (!this.provider) throw new Error("Provider not set");
    return this.provider.getProof(cid);
  }
  getDealStatus(cid: string) {
    if (!this.provider) throw new Error("Provider not set");
    return this.provider.getDealStatus(cid);
  }
  getAllDeals(cid: string) {
    if (!this.provider) throw new Error("Provider not set");
    return this.provider.getAllDeals(cid);
  }
  getActiveDeals(id: string) {
    if (!this.provider) throw new Error("Provider not set");
    return this.provider.getActiveDeals(id);
  }
  getExpiringDeals(cid: string, epochs: number) {
    if (!this.provider) throw new Error("Provider not set");
    return this.provider.getExpiringDeals(cid, epochs);
  }
  getStorageSize() {
    if (!this.provider) throw new Error("Provider not set");
    return this.provider.getStorageSize();
  }
}
