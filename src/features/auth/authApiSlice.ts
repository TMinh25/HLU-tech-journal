import { createApi } from "@reduxjs/toolkit/dist/query/react";
import {
  AuthInfoResponse,
  ResetPasswordRequest,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from "../../interface/requestAndResponse";
// import config from "../../config";
import User from "../../interface/user.model";
import TokenService from "../../services/token.service";
import { baseQueryWithReauthenticate } from "../utils";

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauthenticate,
  endpoints(builder) {
    return {
      signIn: builder.mutation<SignInResponse, SignInRequest>({
        query: (signInRequest) => ({
          url: "/auth/signin",
          method: "POST",
          body: signInRequest,
        }),
        transformResponse: (response: any, _meta, _arg) => {
          if (response && response.authenticated) {
            TokenService.updateLocalAccessToken(response.accessToken);
            TokenService.updateLocalRefreshToken(response.refreshToken);
          }
          return response;
        },
      }),
      signUp: builder.mutation<User, SignUpRequest>({
        query: (user) => ({
          url: "/auth/signup",
          method: "POST",
          body: user,
        }),
        transformResponse: (response: SignUpResponse, _meta, _arg) =>
          response.data,
      }),
      signOut: builder.mutation<{ success: boolean }, void>({
        query: () => {
          const refreshToken = TokenService.getLocalRefreshToken();
          return {
            url: "/auth/signout",
            method: "DELETE",
            body: { refreshToken },
          };
        },
      }),
      modifyAccountSetting: builder.mutation<{ success: boolean }, Object>({
        query: (body) => ({
          url: "/auth/setting",
          method: "POST",
          body: body,
        }),
      }),
      requestResetPassword: builder.mutation<
        { success: boolean; message: string },
        { email: string }
      >({
        query: (requestForm) => ({
          url: "/auth/password-reset",
          method: "POST",
          body: requestForm,
        }),
      }),
      isValidResetPassword: builder.query<
        { success: boolean; message: string },
        { userId: string; token: string }
      >({
        query: ({ userId, token }) => ({
          url: `/auth/password-reset/${userId}/${token}`,
          method: "GET",
        }),
      }),
      resetPassword: builder.mutation<
        { success: boolean; message: string },
        ResetPasswordRequest
      >({
        query: ({ userId, token, password }) => ({
          url: `/auth/password-reset/${userId}/${token}`,
          method: "POST",
          body: { password },
        }),
      }),
      fetchAuthInfo: builder.mutation<User, void>({
        query: () => {
          const accessToken = TokenService.getLocalAccessToken();
          return {
            url: "/auth/info",
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
        transformResponse: (response: AuthInfoResponse, _meta, _arg) => {
          console.log(response.data);
          return response.data;
        },
      }),
    };
  },
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
  useFetchAuthInfoMutation,
  useRequestResetPasswordMutation,
  useIsValidResetPasswordQuery,
  useResetPasswordMutation,
} = authApiSlice;
