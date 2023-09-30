import { combineReducers } from '@reduxjs/toolkit';
import essentialsReducer from './essential/essential.slice';
import walletRedeucer from './wallet/wallet.slice';
import loansReducer from './microloans/loans.slice';
import spacesReducer from './spaces/spaces.slice';

import { outreAuthApi, shastaApi } from '@dapp/services';

export const rootReducer = combineReducers({
  essential: essentialsReducer,
  wallet: walletRedeucer,
  loans: loansReducer,
  spaces: spacesReducer,
  [outreAuthApi.reducerPath]: outreAuthApi.reducer,
  [shastaApi.reducerPath]: shastaApi.reducer,
});
