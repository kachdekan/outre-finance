import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { LoansHomeScreen, LoanOffersScreen, LoanRequestsScreen } from '../features/microloans';

const Tab = createMaterialTopTabNavigator();

function LoansTabsNavigator() {
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
      <Tab.Screen name="YourLoans" component={LoansHomeScreen} />
      <Tab.Screen name="Offers" component={LoanOffersScreen} />
      <Tab.Screen name="Requests" component={LoanRequestsScreen} />
    </Tab.Navigator>
  );
}
export default LoansTabsNavigator;
