import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GlobalStates {}

const initialState: GlobalStates = {};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {},
});

export default globalSlice.reducer;
