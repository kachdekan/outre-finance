import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from '@clixpesa/native-base';
import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { Navigation } from './navigation';
//import { USER_STORE, WALLETS_STORE } from '@dapp/consts';
//import { getUserDetails } from '@dapp/services/storage';
//import { connectToProvider } from '@dapp/blockchain/provider';

export default function App() {
  return (
    <NativeBaseProvider>
      <Navigation />
      <StatusBar style="auto" />
    </NativeBaseProvider>
  );
}
