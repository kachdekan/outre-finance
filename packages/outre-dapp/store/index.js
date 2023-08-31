import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';

import { essentialListeners } from './essential/essential.effects';
import { walletListeners } from './wallet/wallet.effects';
import { spacesListeners } from './spaces/spaces.effects';

import { blockscoutApi } from '@dapp/services/blockscout';

const listenerMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware, blockscoutApi.middleware),
});

const listeners = [essentialListeners, walletListeners, spacesListeners];
listeners.forEach((listener) => listener(listenerMiddleware.startListening));
