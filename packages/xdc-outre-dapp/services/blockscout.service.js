import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { blockscoutApiURL } from '@dapp/config/appconfig';
// Define a service using a base URL and expected endpoints
export const blockscoutApi = createApi({
  reducerPath: 'blockscoutApi',
  baseQuery: fetchBaseQuery({ baseUrl: blockscoutApiURL }),
  endpoints: (builder) => ({
    //Account

    getTxsByAddr: builder.query({
      query: (addr) => `txs/listByAccount/${addr}`,
    }),
    getTokenTransfers: builder.query({
      query: (addr) => `token-txs/xrc20?holder=${addr}`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTxsByAddrQuery, useGetTokenTransfersQuery } = blockscoutApi;
