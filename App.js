import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importing screens
import HomeScreen from './screens/HomeScreen';
import LogScreen from './screens/LogScreen';
import RiskMapScreen from './screens/RiskMapScreen';
import UserProfile from './screens/UserProfile';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Home Screen */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Welcome to SafeTrack' }} />
        
        {/* Log Screen for Login/Signup */}
        <Stack.Screen name="Log" component={LogScreen} options={{ title: 'Login / Signup' }} />
        
        {/* User Profile Screen */}
        <Stack.Screen name="Profile" component={UserProfile} options={{ title: 'Your Profile' }} />
        
        {/* Risk Map Screen */}
        <Stack.Screen name="Risk Map" component={RiskMapScreen} options={{ title: 'Risk Zones' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
