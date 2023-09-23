import { combineReducers } from '@reduxjs/toolkit';
import essentialsReducer from './essential/essential.slice';
import walletRedeucer from './wallet/wallet.slice';

import { outreAuthApi } from '@dapp/services';

export const rootReducer = combineReducers({
  essential: essentialsReducer,
  wallet: walletRedeucer,
  [outreAuthApi.reducerPath]: outreAuthApi.reducer,
});
