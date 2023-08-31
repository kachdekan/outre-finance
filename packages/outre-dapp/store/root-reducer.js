import { combineReducers } from '@reduxjs/toolkit';
//import userReducer from './user/user.slice';
import spacesReducer from './spaces/spaces.slice';
import walletReducer from './wallet/wallet.slice';
import essentialsReducer from './essential/essential.slice';

import { blockscoutApi } from '@dapp/services/blockscout';
//import { newsdataApi } from '@dapp/services/newsdata';

export const rootReducer = combineReducers({
  //user: userReducer,
  spaces: spacesReducer,
  wallet: walletReducer,
  essential: essentialsReducer,
  [blockscoutApi.reducerPath]: blockscoutApi.reducer,
  //[newsdataApi.reducerPath]: newsdataApi.reducer,
});
