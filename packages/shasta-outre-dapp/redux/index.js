import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';

import { outreAuthApi } from '@dapp/services';
import { essentialListeners } from './essential/essential.effects';
import { walletListeners } from './wallet/wallet.effects';

const listenerMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware, outreAuthApi.middleware),
});

const listeners = [essentialListeners, walletListeners, ] //spacesListeners];
listeners.forEach((listener) => listener(listenerMiddleware.startListening));
