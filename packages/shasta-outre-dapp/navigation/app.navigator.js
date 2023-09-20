import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Screens
import {
  HomeScreen
} from '@dapp/features/essentials';
import { useSelector } from 'react-redux';

const AppStack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <AppStack.Navigator initialRouteName="Home">
        <AppStack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
    </AppStack.Navigator>
  );
}
