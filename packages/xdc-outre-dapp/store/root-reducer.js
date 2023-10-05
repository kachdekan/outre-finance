import { combineReducers } from '@reduxjs/toolkit';
import essentialsReducer from './essential/essential.slice';
import walletRedeucer from './wallet/wallet.slice';
import loansReducer from './microloans/loans.slice';

import { outreAuthApi, blockscoutApi } from '@dapp/services';

export const rootReducer = combineReducers({
  essential: essentialsReducer,
  wallet: walletRedeucer,
  loans: loansReducer,
  [outreAuthApi.reducerPath]: outreAuthApi.reducer,
  [blockscoutApi.reducerPath]: blockscoutApi.reducer,
});
