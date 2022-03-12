import { useColorMode } from "@chakra-ui/react";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StreamChat } from "stream-chat";
// import { streamChatClient } from "../../App";
import config from "../../config";
import User from "../../interface/user.model";
import { StreamChatContext } from "../../main";
import TokenService from "../../services/token.service";
import { Role } from "../../types";
import { useSignUpMutation } from "./authApiSlice";
// import fetch from "node-fetch";

const server = config.server.url as string;

const client = StreamChat.getInstance(config.streamChat.key);

type AuthState = {
  authenticated: boolean;
  currentUser?: User;
  role: Role;
  isAuthenticating: boolean;
};

const initialState: AuthState = {
  authenticated: false,
  currentUser: undefined,
  role: -1,
  isAuthenticating: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticating = !!action.payload;
    },
    setCredentials: (state, { payload }: PayloadAction<User>) => {
      state.authenticated = Boolean(payload);
      state.currentUser = payload;
      state.role = payload.role;
    },
    signOut: (state) => {
      TokenService.updateLocalAccessToken(null);
      TokenService.updateLocalRefreshToken(null);
      state.authenticated = false;
      state.currentUser = undefined;
      state.role = -1;
    },
    modifyCredentials: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
  },
});

export const {
  setCredentials,
  signOut,
  modifyCredentials,
  setIsAuthenticating,
} = authSlice.actions;
export default authSlice.reducer;
