import { createApi } from "@reduxjs/toolkit/dist/query/react";
import IFile from "../../interface/file";
import { baseQueryWithReauthenticate } from "../utils";

export const fileUploadApiSlice = createApi({
  reducerPath: "fileUploadApi",
  baseQuery: baseQueryWithReauthenticate,
  endpoints(builder) {
    return {
      uploadFile: builder.mutation<IFile, FormData>({
        query: (formRequest) => ({
          url: `/file/upload`,
          method: "POST",
          body: formRequest,
        }),
        transformResponse: (
          response: { success: boolean; data: IFile },
          _meta: {} | undefined,
          _arg: any
        ) => response.data,
      }),
      getFile: builder.query<IFile, string | undefined>({
        query: (fileId) => ({
          url: `/file/${fileId}`,
          method: "GET",
        }),
        transformResponse: (
          response: { success: boolean; data: IFile },
          _meta: {} | undefined,
          _arg: any
        ) => response.data,
      }),
    };
  },
});

export const { useUploadFileMutation, useGetFileQuery } = fileUploadApiSlice;
