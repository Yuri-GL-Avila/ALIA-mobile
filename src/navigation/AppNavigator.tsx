import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

import HomeScreen from '../screens/HomeScreen';
import SecurityScreen from '../screens/SecurityScreen';
import LocationScreen from '../screens/LocationScreen';
import ContactsScreen from '../screens/ContactsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import DeviceScreen from '../screens/DeviceScreen';
import HistoryScreen from '../screens/HistoryScreen';
import DeskScreen from '../screens/DeskScreen';
import PlacesScreen from '../screens/PlacesScreen';
import LoginScreen from '../screens/LoginScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.black,
    card: colors.black,
    primary: colors.pink,
    text: colors.white,
    border: colors.blackSecondary,
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.blackSecondary,
          borderTopColor: colors.blackTertiary,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.pink,
        tabBarInactiveTintColor: colors.gray,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Início') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Segurança') iconName = focused ? 'shield' : 'shield-outline';
          else if (route.name === 'Localização') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'Contatos') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Segurança" component={SecurityScreen} />
      <Tab.Screen name="Localização" component={LocationScreen} />
      <Tab.Screen name="Contatos" component={ContactsScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useApp();

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="Emergency"
              component={EmergencyScreen}
              options={{ animation: 'fade' }}
            />
            <Stack.Screen name="Device" component={DeviceScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Desk" component={DeskScreen} />
            <Stack.Screen name="Places" component={PlacesScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
