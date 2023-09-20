import { combineReducers } from '@reduxjs/toolkit';
import essentialsReducer from './essential/essential.slice';

import { outreAuthApi } from '@dapp/services';

export const rootReducer = combineReducers({
  essential: essentialsReducer,
  [outreAuthApi.reducerPath]: outreAuthApi.reducer,
});
