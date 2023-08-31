import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-remix-icon';
import { Box, Text, Avatar, Pressable, HStack } from '@clixpesa/native-base';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { AccountNavigator } from './account.navigator';

import { HomeScreen, DepositScreen, DummyScreen } from '@dapp/features/essentials';
import {
  SpacesHomeScreen,
  CreateSpaceScreen,
  SelectContactsScreen,
  SetRoscaGoalScreen,
  FundRoscaRoundScreen,
} from '../features/spaces';
//import { LoansHomeScreen } from '../features/microloans';
import RoscaTabsNavigator from './rosca-tabs.navigator';
import LoansTabsNavigator from './loan-tabs.navigator';
import SpacesLandingNavigator from './spaces-landing.navigator';

const Tab = createBottomTabNavigator();
const AppStack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <AppStack.Group screenOptions={{ presentation: 'modal' }}>
        <AppStack.Screen name="depositFunds" component={DepositScreen} />
      </AppStack.Group>
      <AppStack.Group screenOptions={{ presentation: 'modal' }}>
        <AppStack.Screen
          name="SpacesLanding"
          component={SpacesLandingNavigator}
          options={{
            headerTitle: 'My Spaces',
          }}
        />
        <AppStack.Screen name="RoscaHome" component={RoscaTabsNavigator} />
        <AppStack.Screen
          name="createSpace"
          component={CreateSpaceScreen}
          options={{
            headerTitle: 'Create a Space',
          }}
        />
        <AppStack.Screen
          name="selectContacts"
          component={SelectContactsScreen}
          options={{
            headerTitle: 'Invite Friends',
          }}
        />
        <AppStack.Screen
          name="setRoscaGoal"
          component={SetRoscaGoalScreen}
          options={{
            headerTitle: 'Set Pot Amount',
          }}
        />
        <AppStack.Screen
          name="fundRoscaRound"
          component={FundRoscaRoundScreen}
          options={{
            headerTitle: 'Fund Round',
          }}
        />
      </AppStack.Group>
    </AppStack.Navigator>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Spaces" component={SpacesHomeScreen} />
      <Tab.Screen name="Loans" component={LoansTabsNavigator} />
      <Tab.Screen name="Account" component={AccountNavigator} />
    </Tab.Navigator>
  );
};

const TAB_ICON = {
  Home: ['home-3-fill', 'home-3-line'],
  Spaces: ['safe-2-fill', 'safe-2-line'],
  Loans: ['hand-coin-fill', 'hand-coin-line'],
  Account: ['user-3-fill', 'user-3-line'],
};

const screenOptions = ({ route }) => {
  const iconName = TAB_ICON[route.name];
  return {
    tabBarIcon: ({ focused }) => (
      <Box bg={focused ? 'primary.200' : '#ffffff'} rounded="2xl" px="5" py="1" mt="1">
        <Icon name={focused ? iconName[0] : iconName[1]} size={22} color="#005db4" />
      </Box>
    ),
    tabBarLabel: () => (
      <Text _light={{ color: 'primary.900' }} fontSize="2xs" mb="0.5">
        {route.name}
      </Text>
    ),
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
      <Avatar bg="primary.200" ml="2" size="sm" _text={{ color: 'warmGray.800' }}>
        {initials}
      </Avatar>
    </Pressable>
  );
}
