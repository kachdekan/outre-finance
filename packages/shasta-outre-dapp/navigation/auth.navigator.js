import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Screens
import {
  WelcomeScreen,
  DummyScreen,
  LoginScreen,
} from '@dapp/features/essentials';
import { useSelector } from 'react-redux';

const AuthStack = createNativeStackNavigator();

export function AuthNavigator() {
  const hasAccount = true//useSelector((s) => s.essential.userDetails.userToken);
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
    </AuthStack.Navigator>
  );
}
