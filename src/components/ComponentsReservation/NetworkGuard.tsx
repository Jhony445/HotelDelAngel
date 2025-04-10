import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const NetworkGuard = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connectionStatus = state.isConnected;
      setIsConnected(connectionStatus);
      if (!connectionStatus) showOfflineAlert();
    });

    return () => unsubscribe();
  }, []);

  const checkConnection = () => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) showOfflineAlert();
    });
  };

  const showOfflineAlert = () => {
    Alert.alert(
      'Sin conexión a internet',
      'Necesitas conexión a internet para usar esta aplicación',
      [
        {
          text: 'Reintentar',
          onPress: () => checkConnection(),
        },
      ],
      { cancelable: false }
    );
  };

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Verificando conexión...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default NetworkGuard;