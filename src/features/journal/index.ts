import { createApi } from "@reduxjs/toolkit/dist/query/react";
import Article from "../../interface/article.model";
import Journal from "../../interface/journal.model";
import {
  NewJournalRequest,
  NewSubmissionRequest,
} from "../../interface/requestAndResponse";
import { baseQueryWithReauthenticate } from "../utils";

const transformResponse = (
  response: { success: boolean; data: any },
  _meta: {} | undefined,
  _arg: any
) => {
  // console.log(response.data);
  return response.data;
};

export const journalApiSlice = createApi({
  reducerPath: "journalApi",
  baseQuery: baseQueryWithReauthenticate,
  endpoints(builder) {
    return {
      getAllJournals: builder.query<Journal[], void>({
        query: () => ({
          url: `/journal`,
          method: "GET",
        }),
        transformResponse,
      }),
      getRecentPublishedJournals: builder.query<Journal, void>({
        query: () => ({
          url: `/journal/recent-published`,
          method: "GET",
        }),
        transformResponse,
      }),
      getPublishedJournals: builder.query<Journal[], void>({
        query: () => ({
          url: `/journal/published`,
          method: "GET",
        }),
        transformResponse,
      }),
      getPublishingJournals: builder.query<Journal[], void>({
        query: () => ({
          url: `/journal/publishing`,
          method: "GET",
        }),
        transformResponse,
      }),
      createJournal: builder.mutation<Journal, NewJournalRequest>({
        query: (newJournal) => {
          console.log(newJournal);
          return {
            url: "/journal/" + newJournal.journalGroup + "/new",
            method: "POST",
            body: newJournal,
          };
        },
        transformResponse,
      }),
      getJournalById: builder.query<Journal, string | undefined>({
        query: (journalId) => ({
          url: "/journal/" + journalId,
          method: "GET",
        }),
        transformResponse,
      }),
      findJournal: builder.query<Journal[], {}>({
        query: (body) => ({ url: "/journal/find", method: "POST", body }),
        transformResponse,
      }),
      deleteJournal: builder.mutation<{ success: boolean }, string>({
        query: (journalId) => ({
          url: `/journal/delete/${journalId}`,
          method: "DELETE",
        }),
      }),
      addArticleToJournal: builder.mutation<
        { success: boolean },
        { articleId?: string; journalId?: string }
      >({
        query: ({ articleId, journalId }) => ({
          url: `/journal/add-article/${journalId}/${articleId}`,
          method: "POST",
        }),
      }),
      removeArticleToJournal: builder.mutation<
        { success: boolean },
        { articleId?: string; journalId?: string }
      >({
        query: ({ articleId, journalId }) => ({
          url: `/journal/remove-article/${journalId}/${articleId}`,
          method: "POST",
        }),
      }),
      publishedJournal: builder.mutation<{ success: boolean }, string>({
        query: (_id) => ({
          url: `/journal/published-journal/${_id}`,
          method: "POST",
        }),
      }),
      getArticleOfJournal: builder.query<Article[], string | undefined>({
        query: (journalId) => ({
          url: `/journal/${journalId}/articles`,
          method: "GET",
        }),
        transformResponse,
      }),
    };
  },
});

export const {
  useGetAllJournalsQuery,
  useGetRecentPublishedJournalsQuery,
  useGetPublishedJournalsQuery,
  useGetPublishingJournalsQuery,
  useCreateJournalMutation,
  useGetJournalByIdQuery,
  useFindJournalQuery,
  useDeleteJournalMutation,
  useGetArticleOfJournalQuery,
  useAddArticleToJournalMutation,
  useRemoveArticleToJournalMutation,
  usePublishedJournalMutation,
} = journalApiSlice;
