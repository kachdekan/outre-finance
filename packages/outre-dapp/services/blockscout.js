import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '@dapp/blockchain/config';

// Define a service using a base URL and expected endpoints
export const blockscoutApi = createApi({
  reducerPath: 'blockscoutApi',
  baseQuery: fetchBaseQuery({ baseUrl: config.blockscoutUrl + '/api' }),
  endpoints: (builder) => ({
    //Account
    getTxsByAddr: builder.query({
      query: (addr) => `?module=account&action=txlist&address=${addr}&apikey=${config.polyscan}`,
    }),
    getTokenTransfers: builder.query({
      query: (addr) =>
        `?module=account&action=tokentx&contractaddress=${config.contractAddresses.StableToken}&address=${addr}&apikey=${config.polyscan}`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTxsByAddrQuery, useGetTokenTransfersQuery } = blockscoutApi;
