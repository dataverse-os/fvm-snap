import { RaasProvider } from "@dataverse/fvm-raas-provider";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { FileObject, Snap } from "@/types";

export interface SnapStates {
  snapsDetected: boolean;
  isFlask: boolean;
  installedSnap?: Snap;
  raasProvider: RaasProvider;
  fileList?: FileObject[];
}

const initialState: SnapStates = {
  snapsDetected: false,
  isFlask: false,
  raasProvider: new RaasProvider(),
};

export const snapSlice = createSlice({
  name: "snap",
  initialState,
  reducers: {
    setInstalledSnap: (state, action: PayloadAction<Snap>) => {
      state.installedSnap = action.payload;
    },
    setSnapsDetected: (state, action: PayloadAction<boolean>) => {
      state.snapsDetected = action.payload;
    },
    setIsFlask: (state, action: PayloadAction<boolean>) => {
      state.isFlask = action.payload;
    },
    setFileList: (state, action: PayloadAction<FileObject[]>) => {
      state.fileList = action.payload;
    },
  },
});

export default snapSlice.reducer;
