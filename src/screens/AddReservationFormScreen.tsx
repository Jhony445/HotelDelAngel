import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, TextInput, Button, HelperText, Menu, Provider } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';

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
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const navigation = useNavigation();

  const roomOptions = ['101', '102', '103', '104'];

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!isFormDirty) {
        return;
      }
      e.preventDefault();
      Alert.alert('Salir sin guardar', '¿Estás seguro de que quieres salir sin guardar los cambios?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => navigation.dispatch(e.data.action),
        },
      ]);
    });
    return unsubscribe;
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
            <TouchableOpacity
              style={styles.touchableInput}
              onPress={() => setMenuVisible(true)} // Abre el menú al presionar
            >
              <Text style={styles.text}>
                {room || 'Seleccionar habitación'}
              </Text>
            </TouchableOpacity>
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

        {/* Fecha con DatePicker */}
        <TouchableOpacity
          style={styles.touchableInput}
          onPress={() => setDatePickerVisible(true)} // Abre el calendario al presionar
        >
          <Text style={styles.text}>
            {date ? new Date(date).toLocaleDateString() : 'Seleccionar fecha'}
          </Text>
        </TouchableOpacity>
        <HelperText type="info">Selecciona una fecha del calendario</HelperText>
        <DatePicker
          modal
          open={datePickerVisible}
          date={date ? new Date(date) : new Date()}
          onConfirm={(selectedDate) => {
            console.log('Fecha seleccionada:', selectedDate);
            setDate(selectedDate.toISOString());
            setDatePickerVisible(false);
            handleInputChange();
          }}
          onCancel={() => setDatePickerVisible(false)}
        />

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
          left={<TextInput.Icon icon="account" />}
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
          left={<TextInput.Icon icon="phone" />}
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
          left={<TextInput.Icon icon="briefcase-outline" />}
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
          left={<TextInput.Icon icon="cash" />}
        />

        {/* Botón Guardar */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          disabled={!room || !guestName || !phone || !company || !amount || !date}
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
  touchableInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    justifyContent: 'center',
  },
  text: {
    color: '#000',
  },
  button: {
    marginTop: 20,
  },
});

export default AddReservationFormScreen;
