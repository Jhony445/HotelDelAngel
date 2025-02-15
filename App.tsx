import React from 'react';
import { StatusBar } from 'expo-status-bar'; 
import BottomTabsNavigator from './src/navigation/BottomTabsNavigator';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* Ajustar estilo de barra de estado */}
      <StatusBar 
        style="light"
        translucent
        backgroundColor="transparent"
      />
      <PaperProvider>
        <BottomTabsNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
