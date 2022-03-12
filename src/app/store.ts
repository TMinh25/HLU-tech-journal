import { combineReducers, configureStore } from "@reduxjs/toolkit";
import appStateReducer from "../features/appState";
import { articleApiSlice } from "../features/article";
import { authApiSlice } from "../features/auth/authApiSlice";
import authReducer from "../features/auth/authSlice";
import { fileUploadApiSlice } from "../features/fileUpload";
import { journalApiSlice } from "../features/journal";
import { journalGroupApiSlice } from "../features/journalGroup";
import { plagiarismApiSlice } from "../features/plagiarismCheck";
import { userApiSlice } from "../features/user";

const rootReducer = combineReducers({
  auth: authReducer,
  appState: appStateReducer,
  [authApiSlice.reducerPath]: authApiSlice.reducer,
  [userApiSlice.reducerPath]: userApiSlice.reducer,
  [journalGroupApiSlice.reducerPath]: journalGroupApiSlice.reducer,
  [journalApiSlice.reducerPath]: journalApiSlice.reducer,
  [fileUploadApiSlice.reducerPath]: fileUploadApiSlice.reducer,
  [articleApiSlice.reducerPath]: articleApiSlice.reducer,
  [plagiarismApiSlice.reducerPath]: plagiarismApiSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  /**  Middleware collection */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      plagiarismApiSlice.middleware,
      authApiSlice.middleware,
      userApiSlice.middleware,
      journalApiSlice.middleware,
      journalGroupApiSlice.middleware,
      fileUploadApiSlice.middleware,
      articleApiSlice.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
/** using typescript inference to figure out what slice reducer of the store */
export type RootState = ReturnType<typeof store.getState>;
