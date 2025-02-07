// src/screens/ReservationDetailsScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigationTypes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, ActivityIndicator } from 'react-native-paper';
import { actualizarReservaCompleta } from '../services/firebase/UpdateReservation';

type DetailsRouteProp = RouteProp<RootStackParamList, 'ReservationDetails'>;

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const ReservationDetailsScreen = ({ route, navigation }: { route: DetailsRouteProp, navigation: any }) => {
  const { reservation } = route.params;
  const [loading, setLoading] = useState(false);
  
  const getStatusColor = () => {
    switch (reservation.status.toLowerCase()) {
      case 'pagado':
        return '#66bb6a';
      case 'reservado':
        return '#ffa726';
      default:
        return '#ef5350';
    }
  };

  const showCompleteButton = reservation.paymentMethod === 'Pago parcial' || reservation.status === 'Reservado';
  
  const handleCompletePayment = async () => {
    setLoading(true);
    try {
      await actualizarReservaCompleta(reservation.id);
  
      // 🔹 Actualizar la vista con los nuevos datos
      reservation.paymentMethod = 'Pago completo';
      reservation.status = 'Pagado';
  
      Alert.alert('¡Éxito!', 'El pago se ha marcado como completo');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar el pago');
    } finally {
      setLoading(false);
    }
  };
  

  const amount = parseFloat(reservation.amount) || 0;
  const advancePayment = parseFloat(reservation.advancePayment) || 0;
  const showAdvancePayment = reservation.paymentMethod === 'Pago parcial';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Detalles de Reservación</Text>
        <MaterialCommunityIcons name="file-document" size={32} color="#1a237e" />
      </View>

      {/* Sección de Información General */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="information" size={24} color="#1a237e" />
          <Text style={styles.sectionTitle}>Información General</Text>
        </View>
        
        <DetailRow icon="bed" label="Habitación" value={reservation.room} />
        <DetailRow icon="account" label="Huésped" value={reservation.guestName} />
        <DetailRow icon="phone" label="Teléfono" value={reservation.phone} />
        <DetailRow icon="office-building" label="Compañía" value={reservation.company} />
        <DetailRow icon="account-group" label="Personas" value={reservation.peoples} />
      </View>

      {/* Sección de Fechas */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="calendar" size={24} color="#1a237e" />
          <Text style={styles.sectionTitle}>Fechas</Text>
        </View>
        <DetailRow icon="calendar-check" label="Fecha reservación" value={formatDate(reservation.date)} />
        <DetailRow icon="calendar-clock" label="Creación registro" value={formatDate(reservation.createdAt)} />
      </View>

      {/* Sección de Pagos */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="cash" size={24} color="#1a237e" />
          <Text style={styles.sectionTitle}>Información de Pago</Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{reservation.status}</Text>
        </View>
        
        <DetailRow 
          icon="currency-usd" 
          label="Monto total" 
          value={`$${amount.toFixed(2)}`} 
        />
        
        {showAdvancePayment && (
          <DetailRow 
            icon="cash-multiple" 
            label="Adelanto" 
            value={`$${advancePayment.toFixed(2)}`} 
          />
        )}
        
        <DetailRow icon="credit-card" label="Método de pago" value={reservation.paymentMethod} />
        <DetailRow icon="wallet" label="Tipo de pago" value={reservation.paymentMethodType} />
      </View>

      {showCompleteButton && (
        <Button 
          mode="contained" 
          onPress={handleCompletePayment}
          style={styles.completeButton}
          labelStyle={styles.buttonLabel}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            'Completar Pago'
          )}
        </Button>
      )}
    </ScrollView>
  );
};

const DetailRow = ({ icon, label, value }: { icon: string; label: string; value: any }) => (
  <View style={styles.detailRow}>
    <MaterialCommunityIcons name={icon} size={20} color="#666" />
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || 'No especificado'}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginLeft: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  detailTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#2d3436',
    fontWeight: '500',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  completeButton: {
    margin: 20,
    backgroundColor: '#1a237e',
    borderRadius: 8,
    paddingVertical: 8
  },
  buttonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default ReservationDetailsScreen;