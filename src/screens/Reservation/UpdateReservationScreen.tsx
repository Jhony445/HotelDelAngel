// src/screens/Reservation/UpdateReservationScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigationTypes';
import { actualizarReserva } from '../../services/firebase/UpdateReservation';

type UpdateReservationRouteProp = RouteProp<RootStackParamList, 'UpdateReservation'>;

interface UpdateReservationScreenProps {
  route: UpdateReservationRouteProp;
}

const UpdateReservationScreen: React.FC<UpdateReservationScreenProps> = ({ route }) => {
  // Extraemos la reservación desde los parámetros de la ruta
  const { reservation } = route.params;
  const navigation = useNavigation();

  // Inicializamos estados con los valores actuales de la reserva
  const [guestName, setGuestName] = useState(reservation.guestName || '');
  const [phone, setPhone] = useState(reservation.phone || '');
  const [company, setCompany] = useState(reservation.company || '');
  const [room, setRoom] = useState(reservation.room || '');
  const [amount, setAmount] = useState(reservation.amount || '');
  const [status, setStatus] = useState(reservation.status || '');
  const [paymentMethod, setPaymentMethod] = useState(reservation.paymentMethod || '');
  const [paymentMethodType, setPaymentMethodType] = useState(reservation.paymentMethodType || '');
  const [advancePayment, setAdvancePayment] = useState(reservation.advancePayment || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updatedData = {
        guestName,
        phone,
        company,
        room,
        amount,
        status,
        paymentMethod,
        paymentMethodType,
        advancePayment,
      };
      await actualizarReserva(reservation.id, updatedData);
      Alert.alert('¡Éxito!', 'La reservación se actualizó correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la reservación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TextInput
          label="Huésped"
          value={guestName}
          onChangeText={setGuestName}
          style={styles.input}
        />
        <TextInput
          label="Teléfono"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          keyboardType="phone-pad"
        />
        <TextInput
          label="Compañía"
          value={company}
          onChangeText={setCompany}
          style={styles.input}
        />
        <TextInput
          label="Habitación"
          value={room}
          onChangeText={setRoom}
          style={styles.input}
        />
        <TextInput
          label="Monto"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          label="Estado"
          value={status}
          onChangeText={setStatus}
          style={styles.input}
        />
        <TextInput
          label="Método de Pago"
          value={paymentMethod}
          onChangeText={setPaymentMethod}
          style={styles.input}
        />
        <TextInput
          label="Tipo de Pago"
          value={paymentMethodType}
          onChangeText={setPaymentMethodType}
          style={styles.input}
        />
        <TextInput
          label="Adelanto"
          value={advancePayment}
          onChangeText={setAdvancePayment}
          style={styles.input}
          keyboardType="numeric"
        />
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <Button 
            mode="contained" 
            onPress={handleUpdate} 
            style={styles.button}
          >
            Actualizar Reservación
          </Button>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  contentContainer: { 
    padding: 20 
  },
  input: { 
    marginBottom: 15 
  },
  button: { 
    marginTop: 20 
  },
});

export default UpdateReservationScreen;
