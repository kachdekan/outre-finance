import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { GroupsHomeScreen, PersonalHomeScreen, ChallengesHomeScreen } from '@dapp/features/spaces';

const Tab = createMaterialTopTabNavigator();

function SpacesLandingNavigator() {
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
          marginBottom: 10,
        },
        tabBarPressColor: '#ffffff',
      }}
    >
      <Tab.Screen name="Personal" component={PersonalHomeScreen} />
      <Tab.Screen name="Groups" component={GroupsHomeScreen} />
      <Tab.Screen name="Challenges" component={ChallengesHomeScreen} />
    </Tab.Navigator>
  );
}
export default SpacesLandingNavigator;
