import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigationTypes';
import ScreenTitle from '../components/ScreenTitle';
import SubTitle from '../components/SubTitle';
import FloatingButton from '../components/FloatingButton';
import FilterBar from '../components/FilterBar';
import ReservationListItem from '../components/ReservationListItem';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [filter, setFilter] = useState('');

  // Datos simulados
  const reservations = Array.from({ length: 20 }, (_, i) => ({
    guestName: `Invitado ${i + 1}`,
    date: `2025-02-${(i % 28) + 1}`,
  }));

  const handleAddPress = () => {
    navigation.navigate('AddReservationForm');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      {/* Eliminamos TouchableWithoutFeedback para evitar conflictos */}
      <View style={styles.container}>
        <ScreenTitle title="Hotel del Angel" />
        <View style={styles.content}>
          <FilterBar onFilterChange={setFilter} />
          <SubTitle text="Reservaciones próximas" />

          {/* 🔥 FlatList en lugar de ScrollView */}
          <FlatList
            data={reservations}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <ReservationListItem guestName={item.guestName} date={item.date} />
            )}
            contentContainerStyle={styles.listContainer}
            keyboardShouldPersistTaps="handled"
          />
        </View>

        <FloatingButton onPress={handleAddPress} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
});

export default HomeScreen;
