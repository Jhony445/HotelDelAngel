import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Platform, TouchableOpacity, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, TextInput, Button, Menu, Provider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddReservationFormScreen = () => {
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [room, setRoom] = useState('');
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();

  const roomOptions = ['301-D', '302-E', '303-F', '304-G', '305-H', '201-I','202-J',  '204-L'];

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

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      handleInputChange();
    }
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
              onPress={() => {
                setMenuVisible(true);
                Keyboard.dismiss();
              }}
            >
              <TextInput
                label="Seleccionar habitación"
                value={room}
                mode="outlined"
                style={styles.input}
                editable={false}
                left={<TextInput.Icon icon="bed" />}
              />
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

        {/* Selector de Fecha */}
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <View pointerEvents="box-only">
            <TextInput
              label="Seleccionar fecha"
              value={date ? date.toLocaleDateString() : ''}
              mode="outlined"
              style={styles.input}
              editable={false}
              left={<TextInput.Icon icon="calendar" />}
            />
          </View>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}

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
          placeholder="Ejemplo: 1000.00"
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
  button: {
    marginTop: 20,
  },
});

export default AddReservationFormScreen;
