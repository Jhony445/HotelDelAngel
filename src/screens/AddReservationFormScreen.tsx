import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, TextInput, Button, HelperText, Menu, Provider } from 'react-native-paper';

const AddReservationFormScreen = () => {
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [room, setRoom] = useState('');
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [date, setDate] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  const roomOptions = ['101', '102', '103', '104']; // Opciones de habitaciones
  const paymentMethods = ['Efectivo', 'Tarjeta', 'Transferencia'];

  useEffect(() => {
    // Intercepta el evento de salir de la pantalla
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!isFormDirty) {
        return; // Permite navegar si no hay cambios
      }
      e.preventDefault(); // Detiene la navegación

      // Muestra la alerta
      Alert.alert(
        'Salir sin guardar',
        '¿Estás seguro de que quieres salir sin guardar los cambios?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Salir',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action), // Permite la navegación
          },
        ]
      );
    });

    return unsubscribe; // Limpia el listener al desmontar el componente
  }, [isFormDirty, navigation]);

  const handleInputChange = () => {
    setIsFormDirty(true);
  };

  const handleSubmit = () => {
    console.log('Formulario enviado:', { room, guestName, phone, company, amount, paymentMethod, date });
    setIsFormDirty(false);
    navigation.goBack();
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>Formulario de Reservación</Text>

        {/* Selector de Habitación */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TextInput
              label="Habitación"
              value={room}
              mode="outlined"
              onFocus={() => setMenuVisible(true)}
              style={styles.input}
              right={<TextInput.Icon icon="chevron-down" />}
            />
          }
        >
          {roomOptions.map((option, index) => (
            <Menu.Item
              key={index}
              title={option}
              onPress={() => {
                setRoom(option);
                setMenuVisible(false);
                handleInputChange();
              }}
            />
          ))}
        </Menu>

        {/* Fecha */}
        <TextInput
          label="Fecha de Registro"
          value={date}
          onChangeText={(text) => {
            setDate(text);
            handleInputChange();
          }}
          mode="outlined"
          style={styles.input}
          placeholder="YYYY-MM-DD"
        />
        <HelperText type="info">Formato: Año-Mes-Día</HelperText>

        {/* Nombre del Huésped */}
        <TextInput
          label="Nombre del Huésped"
          value={guestName}
          onChangeText={(text) => {
            setGuestName(text);
            handleInputChange();
          }}
          mode="outlined"
          style={styles.input}
        />

        {/* Número de Celular */}
        <TextInput
          label="Número Celular"
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            handleInputChange();
          }}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />

        {/* Compañía */}
        <TextInput
          label="Compañía"
          value={company}
          onChangeText={(text) => {
            setCompany(text);
            handleInputChange();
          }}
          mode="outlined"
          style={styles.input}
        />

        {/* Monto */}
        <TextInput
          label="Monto"
          value={amount}
          onChangeText={(text) => {
            setAmount(text);
            handleInputChange();
          }}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        {/* Forma de Pago */}
        <TextInput
          label="Forma de Pago"
          value={paymentMethod}
          onFocus={() => {
            setPaymentMethod(paymentMethods[0]);
          }}
          onChangeText={(text) => {
            setPaymentMethod(text);
            handleInputChange();
          }}
          mode="outlined"
          style={styles.input}
        />

        {/* Botón Guardar */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          disabled={!room || !guestName || !phone || !company || !amount || !paymentMethod || !date}
        >
          Guardar
        </Button>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
  },
});

export default AddReservationFormScreen;
