import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AppError = {
  title: string;
  description?: string;
} | null;

export type AppWarning = {
  title: string;
  description?: string;
} | null;

interface AppState {
  error: AppError;
  warning: AppWarning;
  loading: boolean;
}

const initialState: AppState = {
  loading: false,
  error: null,
  warning: null,
};

const authSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<AppError>) => {
      state.error = action.payload;
    },
    setWarning: (state, action: PayloadAction<AppWarning>) => {
      state.warning = action.payload;
    },
    onLoading: (state) => {
      state.loading = true;
    },
    offLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { setError, setWarning, onLoading, offLoading } =
  authSlice.actions;
export default authSlice.reducer;
