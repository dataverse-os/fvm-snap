import { MetaMaskInpageProvider } from "@metamask/providers";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Wallet } from "ethers";

import {
  getLighthouseApiKey,
  getUploads,
  submitCidToContract,
  submitTaskToRaas,
} from "./lighthouse-utils";
import { RaasTask } from "./types";
import { defaultSnapOrigin } from "../config";
import { GetSnapsResponse, Snap } from "../types";

/**
 * Get the installed snaps in MetaMask.
 *
 * @param provider - The MetaMask inpage provider.
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (
  provider?: MetaMaskInpageProvider,
): Promise<GetSnapsResponse> =>
  (await (provider ?? window.ethereum).request({
    method: "wallet_getSnaps",
  })) as unknown as GetSnapsResponse;
/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<"version" | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: "wallet_requestSnaps",
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      snap =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (e) {
    console.log("Failed to obtain installed snap", e);
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

export const sendHello = async () => {
  await window.ethereum.request({
    method: "wallet_invokeSnap",
    params: { snapId: defaultSnapOrigin, request: { method: "hello" } },
  });
};

export const uploadFile = async () => {
  console.log("uploadFile ================= ");
  // await window.ethereum.request({
  //   method: 'wallet_invokeSnap',
  //   params: { snapId: defaultSnapOrigin, request: { method: 'upload_file' } },
  // });
};

export const loadAllUploads = async (signer: Wallet) => {
  console.log("loadAllUploads ================= ");
  const apiKey = await getLighthouseApiKey(signer);
  const uploads = await getUploads(apiKey);
  console.log("Uploads: ", uploads);
  return uploads;
};

export const submitToContract = async (signer: Wallet, cid: string) => {
  console.log("submitToContract ================= ");
  const res = await submitCidToContract(signer, cid);
  console.log("res: ", res);
};

export const submitToRaasBackend = async (
  signer: Wallet,
  raasTask: RaasTask,
) => {
  console.log("submitToRaasBackend ================= ");
  const res = await submitTaskToRaas(signer, raasTask);
  console.log("res: ", res);
};

export const getProofByCid = async (signer: Wallet, raasTask: RaasTask) => {
  console.log("submitToRaasBackend ================= ");
  const res = await submitTaskToRaas(signer, raasTask);
  console.log("res: ", res);
};

export const isLocalSnap = (snapId: string) => snapId.startsWith("local:");
