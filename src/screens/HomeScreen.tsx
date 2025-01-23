import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigationTypes';
import ScreenTitle from '../components/ScreenTitle';
import SubTitle from '../components/SubTitle';
import FloatingButton from '../components/FloatingButton';
import FilterBar from '../components/FilterBar';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [filter, setFilter] = useState('');

  const handleAddPress = () => {
    navigation.navigate('AddReservationForm');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScreenTitle title="Hotel del Angel" />
          <View style={styles.content}>
            <FilterBar onFilterChange={setFilter} />
            <SubTitle text="Reservaciones próximas" />
          </View>
          <FloatingButton onPress={handleAddPress} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default HomeScreen;
