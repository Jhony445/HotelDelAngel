import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StoreScreen from '../screens/StoreScreen';
import AddReservationFormScreen from '../screens/AddReservationFormScreen';
import ReservationDetailsScreen from '../screens/ReservationDetailsScreen';
import { RootStackParamList, TabParamList } from './navigationTypes';
import { Keyboard, View, Platform } from 'react-native';
import OptionsMenu from '../components/OptionsMenu';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const TabNavigator = () => {
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {});
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {});

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Store') {
            iconName = 'storefront';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="Store" component={StoreScreen} options={{ tabBarLabel: 'Tienda' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Configuración' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="AddReservationForm"
        component={AddReservationFormScreen}
        options={{
          title: 'Agregar Reservación',
          headerStyle: { backgroundColor: '#007bff' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen 
        name="ReservationDetails" 
        component={ReservationDetailsScreen}
        options={({ route, navigation }) => ({
          title: 'Detalles',
          headerStyle: { backgroundColor: '#007bff' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <OptionsMenu
              reservaId={route.params.reservation.id} 
              onUpdate={() => console.log('Actualizar')} 
              onDelete={() => console.log('Eliminar')} 
            />
          ),
        })}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
