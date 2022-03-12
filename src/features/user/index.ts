import { createApi } from "@reduxjs/toolkit/dist/query/react";
import User from "../../interface/user.model";
import { baseQueryWithReauthenticate } from "../utils";

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauthenticate,
  endpoints(builder) {
    return {
      getAllUsers: builder.query<User[], void>({
        query: () => ({
          url: `/user`,
          method: "GET",
        }),
        transformResponse: (response: {
          success: boolean;
          data: any;
          length: number;
        }) => response.data,
        extraOptions: { refetchOnReconnect: true, refetchOnFocus: true },
      }),
      getUser: builder.query<User, string | undefined>({
        query: (userId) => ({
          url: `/user/${userId}`,
          method: "GET",
        }),
        transformResponse: (response: { success: boolean; data: User }) =>
          response.data,
      }),
      findUser: builder.query<
        User[],
        {
          aliases: string;
          email: string;
          displayName: string;
          workPlace: string;
        }
      >({
        query: (body) => ({ url: "/user/find", method: "POST", body }),
        transformResponse: (response: { success: boolean; data: User[] }) =>
          response.data,
      }),
      deleteUser: builder.mutation<{ success: boolean }, string>({
        query: (userId) => ({ url: `/user/${userId}`, method: "DELETE" }),
      }),
      toggleDisableUser: builder.mutation<
        { success: boolean; disabled: boolean },
        string
      >({
        query: (userId) => ({
          url: `/user/disable/${userId}`,
          method: "PATCH",
        }),
      }),
    };
  },
});

export const {
  useGetAllUsersQuery,
  useGetUserQuery,
  useFindUserQuery,
  useDeleteUserMutation,
  useToggleDisableUserMutation,
} = userApiSlice;
