import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/dist/query";
import config from "../config";
import TokenService from "../services/token.service";
import { setError } from "./appState";

const baseQuery = fetchBaseQuery({
  baseUrl: new URL(config.server.url).toString(),
  prepareHeaders(headers) {
    const accessToken = TokenService.getLocalAccessToken();
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauthenticate: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const refreshToken = TokenService.getLocalRefreshToken();

  if (result.error && result.error.status === 401 && refreshToken) {
    const refreshResult = await baseQuery(
      {
        url: "/auth/access-token",
        method: "POST",
        body: {
          refreshToken,
        },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // update token in localStorage
      TokenService.updateLocalAccessToken(
        (refreshResult.data as any)?.accessToken
      );
      TokenService.updateLocalRefreshToken(
        (refreshResult.data as any)?.refreshToken
      );
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(
        setError({
          title: "Phiên hết hạn!",
          description: "Vui lòng đăng nhập lại",
        })
      );
      api.dispatch(setError(null));
    }
  }
  return result;
};

export { baseQueryWithReauthenticate };
