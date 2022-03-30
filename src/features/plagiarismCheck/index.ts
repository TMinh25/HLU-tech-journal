import { createApi } from "@reduxjs/toolkit/dist/query/react";
import IFile from "../../interface/file";
import PlagiarismModel from "../../interface/plagiarism";
import { baseQueryWithReauthenticate } from "../utils";

export const plagiarismApiSlice = createApi({
  reducerPath: "plagiarismApi",
  baseQuery: baseQueryWithReauthenticate,
  endpoints(builder) {
    return {
      plagiarismCheck: builder.mutation<PlagiarismModel[], { text: string }>({
        query: (text) => ({
          url: `/plagiarism`,
          method: "POST",
          body: text,
        }),
        transformResponse: (
          response: { success: boolean; data: PlagiarismModel[] },
          _meta: {} | undefined,
          _arg: any
        ) => response.data,
      }),
    };
  },
});

export const { usePlagiarismCheckMutation } = plagiarismApiSlice;
