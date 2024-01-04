import { useCallback, useMemo } from "react";

import {
  LightHouseProvider,
  RaasTask,
  UploadInput,
} from "@dataverse/fvm-raas-provider";
import { ExternalProvider } from "@ethersproject/providers/src.ts/web3-provider";
import { ethers, Wallet } from "ethers";

import { defaultSnapOrigin } from "@/config";
import { useDispatch, useSelector } from "@/state/hook";
import { snapSlice } from "@/state/snap/slice";
import { connectSnap, getSnap, isLocalSnap } from "@/utils/snap";

export const useSnap = () => {
  const snapState = useSelector(state => state.snap);
  const raasProvider = snapState.raasProvider;
  const dispatch = useDispatch();

  const isMetaMaskReady = useMemo(
    () =>
      isLocalSnap(defaultSnapOrigin)
        ? snapState.isFlask
        : snapState.snapsDetected,
    [defaultSnapOrigin, snapState.isFlask, snapState.snapsDetected],
  );

  const handleConnectSnap = useCallback(async () => {
    if (!snapState.installedSnap) {
      let installedSnap = await getSnap();

      if (!installedSnap) {
        await connectSnap();
        installedSnap = await getSnap();
      }

      installedSnap &&
        dispatch(snapSlice.actions.setInstalledSnap(installedSnap));
    }

    const provider = new ethers.providers.Web3Provider(
      window.ethereum as unknown as ExternalProvider,
    );
    window.ethereum.enable();
    // add and switch chain to Filecoin - Calibration testnet
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x4cb2f",
          chainName: "Filecoin - Calibration testnet",
          nativeCurrency: {
            name: "Filecoin",
            symbol: "tFIL",
            decimals: 18,
          },
          rpcUrls: ["https://filecoin-calibration.chainup.net/rpc/v1"],
          blockExplorerUrls: ["https://calibration.filscan.io"],
        },
      ],
    });
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x4cb2f" }],
    });
    const signer = provider.getSigner();
    const lighthouseProvider = new LightHouseProvider(
      signer as unknown as Wallet,
    );
    await lighthouseProvider.getApiKey();
    raasProvider.setProvider(lighthouseProvider);
  }, [raasProvider, snapState]);

  const handleUploadFile = useCallback(
    async (file: UploadInput) => {
      return await raasProvider.uploadFile(file);
    },
    [raasProvider],
  );

  const handleDownloadFile = useCallback(
    async (cid: string) => {
      return await raasProvider.downloadFile(cid);
    },
    [raasProvider],
  );

  const handleLoadUploads = useCallback(async () => {
    const uploads = await raasProvider.getUploadedFiles();
    dispatch(snapSlice.actions.setFileList(uploads));
    return uploads;
  }, [raasProvider]);

  const handleSubmitCidToContract = useCallback(
    async (cid: string) => {
      await raasProvider.submitCidToContract(cid);
    },
    [raasProvider],
  );

  const handleSubmitCidToRaasBackend = useCallback(
    async (cid: string) => {
      const requestReceivedTime = new Date();
      const endDate = requestReceivedTime.setMonth(
        requestReceivedTime.getMonth() + 1,
      );
      const replicationTarget = 2;
      const epochs = 4; // how many epochs before deal end should deal be renewed
      const task: RaasTask = {
        cid,
        replicationTarget,
        endDate,
        epochs,
      };

      await raasProvider.submitTaskToRaas(task);
    },
    [raasProvider],
  );

  const handleQueryProofByCid = useCallback(
    async (cid: string) => {
      const podsi = await raasProvider.getProof(cid);
      console.log("podsi: ", podsi);
      return podsi;
    },
    [raasProvider],
  );

  const handleQueryDealStatusByCid = useCallback(
    async (cid: string) => {
      const podsi = await raasProvider.getDealStatus(cid);
      console.log("podsi: ", podsi);
      return podsi;
    },
    [raasProvider],
  );

  const handleGetAllDealsFromContract = useCallback(
    async (cid: string) => {
      const res = await raasProvider.getAllDeals(cid);
      console.log("res: ", res);
      return res;
    },
    [raasProvider],
  );

  const handleGetActiveDealsFromContract = useCallback(
    async (cid: string) => {
      const res = await raasProvider.getAllDeals(cid);
      console.log("res: ", res);
      return res;
    },
    [raasProvider],
  );

  const handleGetExpiringDealsFromContract = useCallback(
    async (cid: string) => {
      const res = await raasProvider.getExpiringDeals(cid, 4);
      console.log("res: ", res);
      return res;
    },
    [raasProvider],
  );

  return {
    snapState,
    isMetaMaskReady,
    handleConnectSnap,
    handleUploadFile,
    handleDownloadFile,
    handleLoadUploads,
    handleSubmitCidToContract,
    handleSubmitCidToRaasBackend,
    handleQueryProofByCid,
    handleQueryDealStatusByCid,
    handleGetAllDealsFromContract,
    handleGetActiveDealsFromContract,
    handleGetExpiringDealsFromContract,
  };
};
