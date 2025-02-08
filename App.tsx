import React from 'react';
import BottomTabsNavigator from './src/navigation/BottomTabsNavigator';
import { PaperProvider } from 'react-native-paper';

const App = () => {
  return (
    <PaperProvider>
      <BottomTabsNavigator />
    </PaperProvider>
  );
};

export default App;

