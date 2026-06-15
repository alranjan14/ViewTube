import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SearchState = Record<string, string[]>;

const initialState: SearchState = {};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    cacheResults: (state, action: PayloadAction<Record<string, string[]>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { cacheResults } = searchSlice.actions;
export default searchSlice.reducer;
