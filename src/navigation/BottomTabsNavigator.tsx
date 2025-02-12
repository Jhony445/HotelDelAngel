import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StoreScreen from '../screens/StoreScreen';
import AddReservationFormScreen from '../screens/Reservation/AddReservationFormScreen';
import ReservationDetailsScreen from '../screens/Reservation/ReservationDetailsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import UpdateReservationScreen from '../screens/Reservation/UpdateReservationScreen';
import AgendaSettingsScreen from '../screens/OptionsScreens/AgendaSettingsScreen';
import StoreSettingsScreen from '../screens/OptionsScreens/StoreSettingsScreen';
import { RootStackParamList, TabParamList } from './navigationTypes';
import { Keyboard } from 'react-native';
import OptionsMenu from '../components/ComponentsReservation/OptionsMenu';

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
          } else if (route.name === 'Calendar') {
            iconName = 'calendar';
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
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: 'Agenda' }} />
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
              onUpdate={() => {
                navigation.navigate('UpdateReservation', { reservation: route.params.reservation });
              }}
              onDelete={() => console.log('Eliminar')}
            />
          ),
        })}
      />
      <Stack.Screen
        name="UpdateReservation"
        component={UpdateReservationScreen}
        options={{
          title: 'Actualizar Reservación',
          headerStyle: { backgroundColor: '#007bff' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen
        name="AgendaSettings"
        component={AgendaSettingsScreen}
        options={{
          title: 'Configuración Agenda',
          headerStyle: { backgroundColor: '#007bff' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen
        name="StoreSettings"
        component={StoreSettingsScreen}
        options={{
          title: 'Configuración Tienda',
          headerStyle: { backgroundColor: '#007bff' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
