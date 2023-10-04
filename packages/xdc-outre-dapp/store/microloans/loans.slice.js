import { createSlice, createAction } from '@reduxjs/toolkit';

const loansInitialState = {
  myLoans: [],
  allOffers: [],
  allRequests: [],
};

const loansSlice = createSlice({
  name: 'loans',
  initialState: loansInitialState,
  reducers: {
    setOffers: (state, action) => {
      state.allOffers = action.payload;
    },
    setRequests: (state, action) => {
      state.allRequests = action.payload;
    },
    setLoans: (state, action) => {
      state.myLoans = action.payload;
    },
  },
});

//Created Actions
export const fetchOffers = createAction('loans/fetchOffers');
export const fetchRequests = createAction('loans/fetchRequests');
export const fetchLoans = createAction('loans/fetchLoans');
export const updateLoans = createAction('loans/updateLoans');

export const { setOffers, setRequests, setLoans } = loansSlice.actions;

export default loansSlice.reducer;
