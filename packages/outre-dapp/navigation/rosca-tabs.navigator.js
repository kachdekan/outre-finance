import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { RoscaHomeScreen, RoscaLoansScreen, RoscaPocketsScreen } from '../features/spaces';

const Tab = createMaterialTopTabNavigator();

function RoscaTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { textTransform: 'none', fontWeight: 'bold' },
        tabBarIndicatorStyle: {
          backgroundColor: '#ffffff',
          height: '100%',
          borderRadius: 50,
          elevation: 1,
        },
        tabBarStyle: {
          backgroundColor: '#f5f5f5',
          elevation: 0,
          marginHorizontal: 10,
          marginTop: 10,
        },
        tabBarPressColor: '#ffffff',
      }}
    >
      <Tab.Screen name="Home" component={RoscaHomeScreen} />
      <Tab.Screen name="Loans" component={RoscaLoansScreen} />
      <Tab.Screen name="Pockets" component={RoscaPocketsScreen} />
    </Tab.Navigator>
  );
}
export default RoscaTabsNavigator;
