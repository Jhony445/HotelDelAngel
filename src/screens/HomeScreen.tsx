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
import ScreenTitle from '../components/ComponentsReservation/ScreenTitle';
import SubTitle from '../components/ComponentsReservation/SubTitle';
import FloatingButton from '../components/ComponentsReservation/FloatingButton';
import FilterBar from '../components/ComponentsReservation/FilterBar';
import ReservationListItem from '../components/ComponentsReservation/ReservationListItem';
import { obtenerReservaciones } from '../services/ReservationServices/firestoreQueries';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [filter, setFilter] = useState('');
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const today = new Date();
  const startCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0, 23, 59, 59, 999);

  const reservationsWithinRange = filteredReservations.filter(reservation => {
    let startDate: Date;

    if (reservation.startDate && typeof reservation.startDate.toDate === 'function') {
      startDate = reservation.startDate.toDate();
    } else {
      startDate = new Date(reservation.startDate);
    }
  
    return startDate >= startCurrentMonth && startDate <= endNextMonth;
  });
  // ---------------------------------------------------------------------------------

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
        <ScreenTitle title="Hotel del Ángel" />
        <FilterBar onFilterChange={setFilter} />
        <View style={styles.content}>
          <View style={styles.subtitleContainer}>
            <SubTitle text="Reservaciones próximas" />
          </View>
          <FlatList
            data={reservationsWithinRange}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ReservationListItem
                guestName={item.guestName || ''}
                date={item.startDate ? 
                  item.startDate.toLocaleDateString('es-MX') :
                  'Sin fecha'
                }
                room={item.room || ''}
                paymentMethod={item.paymentMethod || 'No especificado'}
                amount={item.amount || '0'}
                status={item.status || 'pendiente'}
                paymentMethodType={item.paymentMethodType || 'No especificado'}
                advancePayment={item.advancePayment || '0'}
                onPress={() =>
                  navigation.navigate('ReservationDetails', {
                    reservation: {
                      id: item.id,
                      ...item,
                      startDate: item.startDate?.getTime(),
                      endDate: item.endDate?.getTime(),
                      createdAt: item.createdAt?.getTime()
                    }
                  })
                }
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