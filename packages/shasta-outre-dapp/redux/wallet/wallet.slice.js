import { createAction, createSlice } from '@reduxjs/toolkit';

const walletInitialState = {
  walletInfo: {
    address: null,
    isRegistered: false,
    lastUpdated: null,
  },
  walletBalances: {
    tokenAddrToValue: null,
    lastUpdated: null,
  },
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState: walletInitialState,
  reducers: {
    updateBalances: (state, action) => {
      const { tokenAddrToValue, lastUpdated } = action.payload;
      console.log('updateBalances', tokenAddrToValue, lastUpdated);
      state.walletBalances.tokenAddrToValue = tokenAddrToValue;
      state.walletBalances.lastUpdated = lastUpdated;
    },
    updateWalletAddress: (state, action) => {
      state.walletInfo.address = action.payload;
    },
  },
});

export const { updateBalances, updateWalletAddress } = walletSlice.actions;

//Created action
export const createWallet = createAction('wallet/createWallet');
export const importWallet = createAction('wallet/importWallet');
export const fetchBalances = createAction('wallet/fetchBalances');

export default walletSlice.reducer;
