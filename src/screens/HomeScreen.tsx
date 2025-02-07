import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  Text
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigationTypes';
import ScreenTitle from '../components/ScreenTitle';
import SubTitle from '../components/SubTitle';
import FloatingButton from '../components/FloatingButton';
import FilterBar from '../components/FilterBar';
import ReservationListItem from '../components/ReservationListItem';
import { obtenerReservaciones } from '../services/firebase/firestoreQueries';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [filter, setFilter] = useState('');
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cambio 2: Modificar el useEffect existente
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchReservations = async () => {
        try {
          const data = await obtenerReservaciones();
          if (isActive) {
            setReservations(data);
            setError('');
          }
        } catch (err) {
          if (isActive) {
            setError('Error cargando las reservaciones');
            console.error(err);
          }
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchReservations();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleAddPress = () => {
    navigation.navigate('AddReservationForm');
  };

  const filteredReservations = reservations.filter(reservation =>
    reservation.guestName.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a237e" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <View style={styles.container}>
        <ScreenTitle title="Hotel del Angel" />
        <FilterBar onFilterChange={setFilter} />
        <View style={styles.content}>
          <View style={styles.subtitleContainer}>
            <SubTitle text="Reservaciones próximas" />
          </View>
          <FlatList
            data={filteredReservations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ReservationListItem
                guestName={item.guestName || ''}
                date={item.date || ''}
                room={item.room || ''}
                paymentMethod={item.paymentMethod || 'No especificado'}
                amount={item.amount || '0'}
                status={item.status || 'pendiente'}
                paymentMethodType={item.paymentMethodType || 'No especificado'}
                advancePayment={item.advancePayment || '0'}
              />
            )}
            contentContainerStyle={styles.listContainer}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No se encontraron reservaciones</Text>
              </View>
            }
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
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
  },
  content: {
    flex: 1,
  },
  filterBar: {
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  subtitleContainer: {
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingBottom: 100,
    paddingTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    color: '#ef5350',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#757575',
    fontSize: 16,
  },
});

export default HomeScreen;