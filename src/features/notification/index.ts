import { createApi } from "@reduxjs/toolkit/dist/query/react";
import INotification from "../../interface/notification";
import { baseQueryWithReauthenticate } from "../utils";

const transformResponse = (
  response: { success: boolean; data: any },
  _meta: {} | undefined,
  _arg: any
) => {
  console.log(response.data);
  return response.data;
};

export const notificationApiSlice = createApi({
  reducerPath: "Notifications",
  baseQuery: baseQueryWithReauthenticate,
  endpoints(builder) {
    return {
      getAllNotifications: builder.query<INotification[], void>({
        query: () => ({
          url: `/notification`,
          method: "GET",
        }),
        transformResponse,
      }),
    };
  },
});

export const { useGetAllNotificationsQuery } = notificationApiSlice;
