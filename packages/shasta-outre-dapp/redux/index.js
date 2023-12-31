import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';

import { outreAuthApi, shastaApi } from '@dapp/services';
import { essentialListeners } from './essential/essential.effects';
import { walletListeners } from './wallet/wallet.effects';
import { loansListeners } from './microloans/loans.effects';

const listenerMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(
      listenerMiddleware.middleware,
      outreAuthApi.middleware,
      shastaApi.middleware,
    ),
});

const listeners = [essentialListeners, walletListeners, loansListeners]; //spacesListeners];
listeners.forEach((listener) => listener(listenerMiddleware.startListening));
