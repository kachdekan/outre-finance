import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { authURL, SALT } from "@dapp/config" 

// Define a service using a base URL and expected endpoints
export const outreAuthApi = createApi({
  reducerPath: 'outreAuthApi',
  baseQuery: fetchBaseQuery({ baseUrl: authURL + '/api' }),
  endpoints: (builder) => ({
    //Account
    registerUser: builder.mutation({
      query: (payload) => ({
        url: '/register',
        method: 'POST',
        body: payload,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),

    getUserProfile: builder.query({
      query: () => '/profile'
    }),

    //Auth
    authUser: builder.mutation({
      query: ({ phone, password }) => ({
        url: '/auth',
        method: 'POST',
        body: { phone, password },
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),

    //Wallets
    addWallet: builder.mutation({
      query: ({ address, enMnemonic, enPrivateKey, publicKey }) => ({
        url: '/addWallet',
        method: 'POST',
        body: { address, enMnemonic, enPrivateKey, publicKey },
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useRegisterUserMutation, useAuthUserMutation, useGetUserProfileQuery, useAddWalletMutation} = outreAuthApi;