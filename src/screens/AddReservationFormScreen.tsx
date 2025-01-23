import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Platform, TouchableOpacity, Keyboard, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Menu, Provider, Dialog, Portal, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { agregarReserva } from '../services/firebase/AddReservation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { checkRoomAvailability } from '../services/firebase/checkAvailability';

const AddReservationFormScreen = () => {
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [room, setRoom] = useState('');
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [paymentMenuVisible, setPaymentMenuVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogSuccess, setDialogSuccess] = useState(false);
  const navigation = useNavigation();

  const roomOptions = ['301-D', '302-E', '303-F', '304-G', '305-H', '201-I', '202-J', '204-L'];
  const paymentOptions = ['Efectivo', 'Tarjeta de Crédito', 'Transferencia Bancaria'];

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

  const handleNextStep = async () => {
    if (!room || !date) {
      Alert.alert("Error", "Selecciona una habitación y una fecha");
      return;
    }

    try {
      const isAvailable = await checkRoomAvailability(room, date);

      if (!isAvailable) {
        Alert.alert("Habitación ocupada", "La habitación seleccionada no está disponible para esta fecha. Por favor, elige otra fecha u otra habitación.");
        return;
      }

      setCurrentStep(2);
    } catch (error) {
      Alert.alert("Error", "No se pudo verificar la disponibilidad. Intenta de nuevo más tarde.");
    }
  };


  const handleSubmit = async () => {
    setLoading(true);
    setDialogVisible(true);
    setDialogMessage('Guardando reserva...');

    try {
      await agregarReserva(room, date!, guestName, phone, company, amount, paymentMethod);
      setDialogSuccess(true);
      setDialogMessage('¡Reserva guardada con éxito!');
    } catch (error) {
      setDialogSuccess(false);
      setDialogMessage('Error al guardar la reserva');
    } finally {
      setLoading(false);
      setIsFormDirty(false);
    }
  };


  return (
    <Provider>
      <View style={styles.container}>
        {currentStep === 1 && (
          <>
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
                    style={[styles.input, !room && styles.placeholderText]}
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
                  style={[styles.input, !date && styles.placeholderText]}
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

            {/* Botón Siguiente */}
            <Button
              mode="contained"
              onPress={handleNextStep}
              style={styles.button}
              disabled={!room || !date}
            >
              Siguiente
            </Button>
          </>
        )}

        {currentStep === 2 && (
          <>
            {/* Nombre del Huésped */}
            <TextInput
              label="Nombre del Huésped"
              value={guestName}
              onChangeText={(text) => {
                setGuestName(text);
                handleInputChange();
              }}
              mode="outlined"
              style={[styles.input, !guestName && styles.placeholderText]}
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
              style={[styles.input, !phone && styles.placeholderText]}
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
              style={[styles.input, !company && styles.placeholderText]}
              left={<TextInput.Icon icon="briefcase-outline" />}
            />

            {/* Método de Pago */}
            <Menu
              visible={paymentMenuVisible}
              onDismiss={() => setPaymentMenuVisible(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => {
                    setPaymentMenuVisible(true);
                    Keyboard.dismiss();
                  }}
                >
                  <TextInput
                    label="Método de Pago"
                    value={paymentMethod}
                    mode="outlined"
                    style={[styles.input, !paymentMethod && styles.placeholderText]}
                    editable={false}
                    left={<TextInput.Icon icon="credit-card" />}
                  />
                </TouchableOpacity>
              }
            >
              {paymentOptions.map((option, index) => (
                <Menu.Item
                  key={index}
                  title={option}
                  onPress={() => {
                    setPaymentMethod(option);
                    setPaymentMenuVisible(false);
                    handleInputChange();
                  }}
                />
              ))}
            </Menu>


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
              style={[styles.input, !amount && styles.placeholderText]}
              left={<TextInput.Icon icon="cash" />}
            />

            {/* Botones de Volver y Guardar */}
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => setCurrentStep(1)}
                style={styles.buttonBack}
              >
                Volver
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.buttonSave}
                disabled={!guestName || !phone || !company || !amount || !paymentMethod}
              >
                Guardar
              </Button>
            </View>
          </>
        )}
      </View>

      {/* Modal de Carga y Resultado */}
      <Portal>
        <Dialog visible={dialogVisible} dismissable={false}>
          <Dialog.Content style={styles.dialogContent}>
            {loading ? (
              <ActivityIndicator size="large" color="#6200ea" />
            ) : (
              <>
                <View style={dialogSuccess ? styles.successIcon : styles.errorIcon}>
                  <MaterialCommunityIcons
                    name={dialogSuccess ? 'check-circle' : 'close-circle'}
                    size={30}
                    color="white"
                  />
                </View>
                {/* Mensaje descriptivo */}
                <View style={styles.messageContainer}>
                  <Text style={dialogSuccess ? styles.successText : styles.errorText}>
                    {dialogSuccess
                      ? '¡Se registró correctamente!'
                      : 'Error al agregar, vuelve a intentarlo más tarde'}
                  </Text>
                </View>
                <Button
                  onPress={() => {
                    setDialogVisible(false);
                    setIsFormDirty(false);
                    navigation.goBack();
                  }}
                >
                  Aceptar
                </Button>
              </>
            )}
          </Dialog.Content>
        </Dialog>
      </Portal>

    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonBack: {
    flex: 1,
    marginRight: 10,
  },
  buttonSave: {
    flex: 1,
  },
  placeholderText: {
    color: '#999090',
  },
  dialogContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'green',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'red',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  successText: {
    color: 'green',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AddReservationFormScreen;