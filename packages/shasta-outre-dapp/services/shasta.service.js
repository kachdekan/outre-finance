import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { shastaApiURL } from '@dapp/config';

export const shastaApi = createApi({
  reducerPath: 'shastaApi',
  baseQuery: fetchBaseQuery({ baseUrl: shastaApiURL }),
  endpoints: (builder) => ({
    //Account
    getAccountInfo: builder.query({
      query: (address) => `/accounts/${address}`,
    }),
    getAccountTransactions: builder.query({
      query: (address) => `/accounts/${address}/transactions`,
    }),
    getContractTransactions: builder.query({
      query: (address) => `/contracts/${address}/transactions`,
    }),
    getAccountTrc20Transactions: builder.query({
      query: (address) => `/accounts/${address}/transactions/trc20`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAccountInfoQuery,
  useGetAccountTransactionsQuery,
  useGetContractTransactionsQuery,
  useGetAccountTrc20TransactionsQuery,
} = shastaApi;
