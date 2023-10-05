import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Screens
import {
  WelcomeScreen,
  DummyScreen,
  UserDetailsScreen,
  LoginScreen,
  VerificationScreen,
  SetPasscodeScreen,
  StagingScreen,
  ImportWalletScreen,
} from '@dapp/features/essentials';
import { useSelector } from 'react-redux';
const AuthStack = createNativeStackNavigator();

export function AuthNavigator() {
  const hasAccount = useSelector((s) => s.essential.hasAccount);
  return (
    <AuthStack.Navigator initialRouteName="Welcome">
      {hasAccount ? (
        <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <AuthStack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
      )}
      <AuthStack.Group screenOptions={{ presentation: 'modal' }}>
        <AuthStack.Screen name="DummyModal" component={DummyScreen} />
        <AuthStack.Screen
          name="getUserDetails"
          component={UserDetailsScreen}
          options={{ headerTitle: 'Your Details' }}
        />
        <AuthStack.Screen
          name="verifyPhoneNo"
          component={VerificationScreen}
          options={{ headerTitle: 'Verification' }}
        />
        <AuthStack.Screen
          name="setPasscode"
          component={SetPasscodeScreen}
          options={{ headerTitle: 'Set a Passcode' }}
        />
        <AuthStack.Screen
          name="Staging"
          component={StagingScreen}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="importWallet"
          component={ImportWalletScreen}
          options={{ headerTitle: 'Restore Account' }}
        />
      </AuthStack.Group>
    </AuthStack.Navigator>
  );
}
