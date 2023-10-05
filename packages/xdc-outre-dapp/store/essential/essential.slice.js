import { createSlice, createAction } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  isConnected: false,
  isSignerSet: false,
  isImporting: false,
  hasAccount: false,
  userDetails: {
    names: null,
    initials: null,
    phone: '',
    country: null,
    address: null,
  },
};

const essentialSlice = createSlice({
  name: 'essential',
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setUserDetails: (state, { payload }) => {
      const { userNames, phoneNumber, address } = payload;
      state.userDetails.names = userNames;
      state.userDetails.phone = phoneNumber;

      const country = { '+254': 'Kenya', '+256': 'Uganda', '+255': 'Tanzania' };
      state.userDetails.country = country[phoneNumber.slice(0, 4)];

      const names = userNames.split(' ');
      state.userDetails.initials = names[0].slice(0, 1) + names[1].slice(0, 1);
      if (address) state.userDetails.address = address;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setHasAccount: (state, action) => {
      state.hasAccount = action.payload;
    },
    setIsImporting: (state, action) => {
      state.status.isImporting = action.payload;
    },
    setIsSignered: (state, action) => {
      state.isSignerSet = action.payload;
    },
    resetUserDetails: () => initialState,
  },
});

export const {
  setLoggedIn,
  setIsConnected,
  setHasAccount,
  setIsImporting,
  setUserDetails,
  resetUserDetails,
} = essentialSlice.actions;

export const createAccount = createAction('essential/createAccount');

export default essentialSlice.reducer;
