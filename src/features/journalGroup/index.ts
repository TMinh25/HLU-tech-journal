import { createApi } from "@reduxjs/toolkit/dist/query/react";
import Journal from "../../interface/journal.model";
import JournalGroup from "../../interface/journalGroup.model";
import { NewJournalGroupRequest } from "../../interface/requestAndResponse";
import { baseQueryWithReauthenticate } from "../utils";

const transformResponse = (
  response: { success: boolean; data: any },
  _meta: {} | undefined,
  _arg: any
) => {
  console.log(response.data);
  return response.data;
};

export const journalGroupApiSlice = createApi({
  reducerPath: "Journal Group",
  baseQuery: baseQueryWithReauthenticate,
  endpoints(builder) {
    return {
      getAllJournalGroups: builder.query<JournalGroup[], void>({
        query: () => ({
          url: `/journal-group`,
          method: "GET",
        }),
        transformResponse,
        
      }),
      getJournalsInGroup: builder.query<Journal[], string>({
        query: (journalGroupId) => ({
          url: `/journal-group/${journalGroupId}/journals`,
          method: "GET",
        }),
        transformResponse,
      }),
      modifyJournalGroup: builder.mutation<
        JournalGroup,
        { journalId: string; body: { name: string; tags: string[] } }
      >({
        query: (modification) => ({
          url: `/journal-group/${modification.journalId}`,
          method: "PATCH",
          body: modification.body,
        }),
        transformResponse,
      }),
      createJournalGroup: builder.mutation<
        JournalGroup,
        NewJournalGroupRequest
      >({
        query: (newJournalGroup) => ({
          url: "/journal-group/new",
          method: "POST",
          body: newJournalGroup,
        }),
        transformResponse,
      }),
      deleteJournalGroup: builder.mutation<{ success: boolean }, string>({
        query: (journalId) => ({
          url: `/journal-group/${journalId}`,
          method: "DELETE",
        }),
      }),
    };
  },
});

export const {
  useGetJournalsInGroupQuery,
  useGetAllJournalGroupsQuery,
  useModifyJournalGroupMutation,
  useCreateJournalGroupMutation,
  useDeleteJournalGroupMutation,
} = journalGroupApiSlice;
