import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigationTypes';
import ScreenTitle from '../components/ScreenTitle';
import SubTitle from '../components/SubTitle';
import FloatingButton from '../components/FloatingButton';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleAddPress = () => {
    navigation.navigate('AddReservationForm');
  };

  return (
    <View style={styles.container}>
      <ScreenTitle title="Inicio" />
      <View style={styles.content}>
        <SubTitle text="Reservaciones próximas" />
      </View>
      <FloatingButton onPress={handleAddPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default HomeScreen;
