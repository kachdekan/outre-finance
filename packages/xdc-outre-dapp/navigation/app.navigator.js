import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Icon from 'react-native-remix-icon';
import { Box, Text, Avatar, Pressable, HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';

//Screens
import { HomeScreen, DummyScreen } from '@dapp/features/essentials';
import { AccountScreen } from '@dapp/features/account';

import { useSelector } from 'react-redux';
import {
  //LoanInfoScreen,
  //BorrowLoanScreen,
  //CreateOfferScreen,
  //FundLoanScreen,
  //SelectLoanScreen,
  LoansHomeScreen,
  LoanOffersScreen,
  LoanRequestsScreen,
} from '@dapp/features/microloans';

import { DepositScreen, TransferFundsScreen } from '@dapp/features/wallet';

const Tab = createBottomTabNavigator();
const AppStack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      {/*
      <AppStack.Group screenOptions={{ presentation: 'modal' }}>
        <AppStack.Screen name="DummyModal" component={DummyScreen} />
        <AppStack.Screen name="AccountScreen" component={AccountScreen} />
        <AppStack.Screen name="depositFunds" component={DepositScreen} />
        <AppStack.Screen name="transferFunds" component={TransferFundsScreen} />

        <AppStack.Screen name="LoanHome" component={LoanInfoScreen} />
        <AppStack.Screen name="borrowLoan" component={BorrowLoanScreen} />
        <AppStack.Screen name="createOffer" component={CreateOfferScreen} />
        <AppStack.Screen name="fundLoan" component={FundLoanScreen} />
        <AppStack.Screen name="selectLoan" component={SelectLoanScreen} />

  </AppStack.Group>*/}
    </AppStack.Navigator>
  );
}

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Loans" component={LoansHomeScreen} />
      <Tab.Screen name="Offers" component={LoanOffersScreen} />
      <Tab.Screen name="Requests" component={LoanRequestsScreen} />
    </Tab.Navigator>
  );
};

const TAB_ICON = {
  Home: ['home-3-fill', 'home-3-line'],
  Loans: ['ri-refund-fill', 'ri-refund-line'],
  Offers: ['ri-pantone-fill', 'ri-pantone-line'],
  Requests: ['hand-coin-fill', 'hand-coin-line'],
};

const screenOptions = ({ route }) => {
  const iconName = TAB_ICON[route.name];
  return {
    tabBarIcon: ({ focused }) => (
      <Box bg={focused ? 'primary.200' : '#ffffff'} rounded="2xl" px="5" py="1" mt="1">
        <Icon name={focused ? iconName[0] : iconName[1]} size={22} color="#5852ff" />
      </Box>
    ),
    tabBarLabel: () => (
      <Text _light={{ color: 'primary.900' }} fontSize="xs" mb="0.5">
        {route.name}
      </Text>
    ),
    tabBarStyle: { height: 60 },
    tabBarHideOnKeyboard: true,
    headerLeft: () => <AccPressable />,
    headerRight: () => <HeaderRightIcons />,
  };
};

function HeaderRightIcons() {
  const navigation = useNavigation();
  return (
    <HStack space="5" mr="3">
      <Pressable
        onPress={() => navigation.navigate('DummyModal')}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <Icon size={24} name="donut-chart-fill" />
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate('DummyModal')}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <Icon size={24} name="star-fill" />
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate('DummyModal')}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <Icon size={24} name="notification-4-fill" />
      </Pressable>
    </HStack>
  );
}

function AccPressable() {
  const { initials } = useSelector((s) => s.essential.userDetails);
  const navigation = useNavigation();
  return (
    // fix avatar text color to primary.700
    <Pressable
      onPress={() => navigation.navigate('Account')}
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <Avatar bg="primary.200" ml="2" size="sm" _text={{ color: 'primary.800' }}>
        {initials}
      </Avatar>
    </Pressable>
  );
}