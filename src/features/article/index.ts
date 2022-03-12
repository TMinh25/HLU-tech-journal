import { createApi } from "@reduxjs/toolkit/dist/query/react";
import Article, { Discussion } from "../../interface/article.model";
import IFile from "../../interface/file";
import {
  RequestReviewerRequest,
  ReviewSubmitRequest,
} from "../../interface/requestAndResponse";
import { baseQueryWithReauthenticate } from "../utils";

const transformResponse = (
  response: { success: boolean; data: any },
  _meta: {} | undefined,
  _arg: any
) => {
  console.log(response.data);
  return response.data;
};
export const articleApiSlice = createApi({
  reducerPath: "articleApi",
  baseQuery: baseQueryWithReauthenticate,
  endpoints(builder) {
    return {
      getAllArticles: builder.query<Article[], void>({
        query: () => ({
          url: `/article`,
          method: "GET",
        }),
        transformResponse,
        extraOptions: {
          refetchOnMountOrArgChange: 30,
        },
      }),
      getArticles: builder.query<Article[], string[]>({
        query: (articles) => ({
          url: `/article`,
          method: "POST",
          body: articles,
        }),
        transformResponse,
      }),
      getArticle: builder.query<Article, string | undefined>({
        query: (article) => ({
          url: `/article/${article}`,
          method: "GET",
        }),
        transformResponse,
        extraOptions: {
          refetchOnMountOrArgChange: 30,
        },
      }),
      getArticleForReviewer: builder.query<Article[], void>({
        query: () => ({ url: `/article/get/reviewer`, method: "GET" }),
        transformResponse,
        extraOptions: {
          refetchOnMountOrArgChange: true,
          refetchOnFocus: true,
          refetchOnReconnect: true,
        },
      }),
      getArticleForAuthor: builder.query<Article[], string | undefined>({
        query: (_userId) => ({
          url: `/article/get/author/${_userId}`,
          method: "GET",
        }),
        transformResponse,
      }),
      requestReviewer: builder.mutation<
        { success: boolean; message: string },
        RequestReviewerRequest
      >({
        query: (request) => ({
          url: `/article/${request._id}/submission/review/request`,
          method: "POST",
          body: request,
        }),
      }),
      editorResponse: builder.mutation<
        Article,
        {
          _id: string;
          accept: number;
          reason?: string;
          notes?: string;
        }
      >({
        query: (request) => ({
          url: `/article/${request._id}/submission/response?accept=${request.accept}`,
          method: "POST",
          body: request,
        }),
      }),
      unassignedReviewer: builder.mutation<
        { success: boolean; message: string },
        { _id?: string; _roundId?: string }
      >({
        query: ({ _id, _roundId }) => ({
          url: `/article/${_id}/submission/${_roundId}/review/unassign`,
          method: "POST",
        }),
      }),
      reviewerResponseSubmission: builder.mutation<
        { success: boolean; message: string },
        {
          _id?: string;
          _roundId?: string;
          status: string;
          reason?: string;
          notes?: string;
        }
      >({
        query: ({ _id, status, _roundId }) => ({
          url: `/article/${_id}/submission/${_roundId}/review/response?status=${status}`,
          method: "POST",
        }),
      }),
      reviewSubmit: builder.mutation<
        { success: boolean; message: string },
        ReviewSubmitRequest
      >({
        query: ({ _id, _roundId, ...restBody }) => ({
          url: `/article/${_id}/submission/${_roundId}/review/result`,
          method: "POST",
          body: restBody,
        }),
      }),
      confirmSubmittedResult: builder.mutation<
        { success: boolean; message: string },
        { _id?: string; _roundId?: string; confirm: 1 | 0 }
      >({
        query: ({ _id, _roundId, confirm }) => ({
          url: `/article/${_id}/submission/${_roundId}/review/confirm?confirm=${confirm}`,
          method: "POST",
        }),
      }),
      sendToPublishing: builder.mutation<
        { success: boolean; message: string },
        { _id?: string; draftFile?: IFile[] }
      >({
        query: ({ _id, ...body }) => ({
          url: `/article/${_id}/submission/publishing`,
          method: "POST",
          body,
        }),
      }),
      completeSubmission: builder.mutation<
        { success: boolean; message: string },
        { _id: string | undefined; publishedFile: IFile }
      >({
        query: ({ _id, ...body }) => ({
          url: `/article/${_id}/submission/completed`,
          method: "POST",
          body,
        }),
      }),
      toggleVisible: builder.mutation<
        { success: boolean; message: string },
        string | undefined
      >({
        // /:_id/submission/visible
        query: (_id) => ({
          url: `/article/${_id}/submission/visible`,
          method: "PATCH",
        }),
      }),
    };
  },
});

export const {
  useGetAllArticlesQuery,
  useGetArticleQuery,
  useGetArticlesQuery,
  useGetArticleForReviewerQuery,
  useGetArticleForAuthorQuery,
  useEditorResponseMutation,
  useRequestReviewerMutation,
  useReviewSubmitMutation,
  useReviewerResponseSubmissionMutation,
  useConfirmSubmittedResultMutation,
  useUnassignedReviewerMutation,
  useSendToPublishingMutation,
  useCompleteSubmissionMutation,
  useToggleVisibleMutation,
} = articleApiSlice;
