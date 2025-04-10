import React from 'react';
import { StatusBar } from 'expo-status-bar'; 
import BottomTabsNavigator from './src/navigation/BottomTabsNavigator';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "./src/services/xdateConfig";
import NetworkGuard from './src/components/ComponentsReservation/NetworkGuard';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StatusBar 
          style="light"
          translucent
          backgroundColor="transparent"
        />
        <NetworkGuard>
          <BottomTabsNavigator />
        </NetworkGuard>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
