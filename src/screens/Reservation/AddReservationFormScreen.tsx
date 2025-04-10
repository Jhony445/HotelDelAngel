import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Platform, TouchableOpacity, Keyboard, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Menu, Provider, Dialog, Portal, Text, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { agregarReserva } from '../../services/ReservationServices/AddReservation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { checkRoomAvailability } from '../../services/ReservationServices/checkAvailability';
import { KeyboardAvoidingView, ScrollView } from 'react-native';

const forcedLightTheme = {
  ...PaperDefaultTheme,
  dark: false,
  colors: {
    ...PaperDefaultTheme.colors,
    background: '#ffffff',
    surface: '#ffffff',
    text: '#000000',
    primary: '#6200ee',
  },
  roundness: 8,
};

const AddReservationFormScreen = () => {
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [room, setRoom] = useState('');
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [peoples, setPeoples] = useState('');
  const [company, setCompany] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [numDays, setNumDays] = useState('1');
  const [menuVisible, setMenuVisible] = useState(false);
  const [paymentMenuVisible, setPaymentMenuVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogSuccess, setDialogSuccess] = useState(false);
  const [advancePayment, setAdvancePayment] = useState('');
  const navigation = useNavigation();
  const [reservationType, setReservationType] = useState('');
  const [reservationMenuVisible, setReservationMenuVisible] = useState(false);
  const [methodMenuVisible, setMethodMenuVisible] = useState(false);
  const [paymentMethodType, setPaymentMethodType] = useState('');
  const [manualAdvancePayment, setManualAdvancePayment] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const roomOptions = ['301-D', '302-E', '303-F', '304-G', '305-H', '201-I', '202-J', '204-L', '401-M', '1-Posada', '2-Posada', '3-Posada'];
  const paymentMethodValues: { [key: string]: string } = {
    "Reservación pagada": "Pago completo",
    "Reservación (50%)": "Pago parcial",
    "Registro directo": "Registro directo",
  };
  const paymentMethodTypeValues: { [key: string]: string } = {
    "Efectivo": "Efectivo",
    "Tarjeta de Crédito": "Tarjeta",
    "Transferencia": "Transferencia",
  };

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

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      setEndDate(null);
      setNumDays('1');
    }
  };
  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate && startDate) {
      setEndDate(selectedDate);
      const diffTime = Math.abs(selectedDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNumDays(diffDays.toString());
    }
  };

  const handleNextStep = async () => {
    if (!room || !startDate) {
      Alert.alert("Error", "Selecciona una habitación y una fecha");
      return;
    }
    const days = parseInt(numDays, 10);
    if (isNaN(days) || days < 1) {
      Alert.alert("Error", "Número de días inválido");
      return;
    }
    const computedEndDate = new Date(startDate);
    computedEndDate.setDate(computedEndDate.getDate() + days);
    computedEndDate.setHours(0, 0, 0, 0);

    try {
      const isAvailable = await checkRoomAvailability(room, startDate, computedEndDate);
      if (!isAvailable) {
        Alert.alert(
          "Habitación ocupada",
          "La habitación seleccionada no está disponible para esas fechas."
        );
        return;
      }
      setCurrentStep(2);
    } catch (error) {
      Alert.alert("Error", "No se pudo verificar la disponibilidad.");
    }
  };


  const handleSubmit = async () => {
    if (!guestName || !amount || !paymentMethod || !paymentMethodType) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    if (!startDate) {
      Alert.alert("Error", "Selecciona una fecha de inicio.");
      return;
    }

    setLoading(true);
    setDialogVisible(true);
    setDialogMessage("Guardando reserva...");
    const days = parseInt(numDays, 10) || 1;
    const computedEndDate = new Date(startDate);
    computedEndDate.setDate(computedEndDate.getDate() + days);
    computedEndDate.setHours(0, 0, 0, 0);

    try {
      const status = paymentMethod === "Reservación (50%)" ? "Reservado" : "Pagado";

      await agregarReserva({
        room,
        startDate: startDate,
        endDate: computedEndDate,
        guestName,
        phone,
        company: company || 'No especificado',
        amount,
        paymentMethod: paymentMethodValues[paymentMethod],
        paymentMethodType,
        advancePayment,
        status,
        peoples: peoples ? parseInt(peoples) : 1,
      });

      setDialogSuccess(true);
      setDialogMessage("¡Reserva guardada con éxito!");
    } catch (error) {
      setDialogSuccess(false);
      setDialogMessage("Error al guardar la reserva.");
    } finally {
      setLoading(false);
      setIsFormDirty(false);
    }
  };


  return (
    <Provider theme={forcedLightTheme}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {currentStep === 1 && (
              <>
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
                <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                  <View pointerEvents="box-only">
                    <TextInput
                      label="Fecha de Entrada"
                      value={startDate ? startDate.toLocaleDateString() : ''}
                      mode="outlined"
                      style={[styles.input, !startDate && styles.placeholderText]}
                      editable={false}
                      left={<TextInput.Icon icon="calendar" />}
                    />
                  </View>
                </TouchableOpacity>
                {showStartPicker && (
                  <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleStartDateChange}
                  />
                )}
                <TouchableOpacity onPress={() => {
                  if (startDate) setShowEndPicker(true);
                }}>
                  <View pointerEvents="box-only">
                    <TextInput
                      label="Fecha de Salida"
                      value={endDate ? endDate.toLocaleDateString() : ''}
                      mode="outlined"
                      style={[styles.input, !endDate && styles.placeholderText]}
                      editable={false}
                      left={<TextInput.Icon icon="calendar-range" />}
                    />
                  </View>
                </TouchableOpacity>
                {showEndPicker && (
                  <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleEndDateChange}
                    minimumDate={startDate || new Date()}
                  />
                )}
                <Text>Noches: {numDays}</Text>
                <Button
                  mode="contained"
                  onPress={handleNextStep}
                  style={styles.button}
                  disabled={!room || !startDate}
                >
                  Siguiente
                </Button>
              </>
            )}
            {currentStep === 2 && (
              <>
                {currentStep === 2 && (
                  <>
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
                            label="Tipo de Reservación"
                            value={paymentMethod}
                            mode="outlined"
                            style={[styles.input, !paymentMethod && styles.placeholderText]}
                            editable={false}
                            left={<TextInput.Icon icon="credit-card-outline" />}
                          />
                        </TouchableOpacity>
                      }
                    >
                      {Object.keys(paymentMethodValues).map((option, index) => (
                        <Menu.Item
                          key={index}
                          title={option}
                          onPress={() => {
                            setPaymentMethod(option);
                            setAmount('');
                            setAdvancePayment('');
                            setPaymentMenuVisible(false);
                            handleInputChange();
                          }}
                        />
                      ))}
                    </Menu>
                    <Menu
                      visible={methodMenuVisible}
                      onDismiss={() => setMethodMenuVisible(false)}
                      anchor={
                        <TouchableOpacity
                          onPress={() => {
                            setMethodMenuVisible(true);
                            Keyboard.dismiss();
                          }}
                        >
                          <TextInput
                            label="Método de Pago"
                            value={Object.keys(paymentMethodTypeValues).find(
                              key => paymentMethodTypeValues[key] === paymentMethodType
                            ) || ''}
                            mode="outlined"
                            style={[styles.input, !paymentMethodType && styles.placeholderText]}
                            editable={false}
                            left={<TextInput.Icon icon="cash" />}
                          />
                        </TouchableOpacity>
                      }
                    >
                      {Object.keys(paymentMethodTypeValues).map((option, index) => (
                        <Menu.Item
                          key={index}
                          title={option}
                          onPress={() => {
                            setPaymentMethodType(paymentMethodTypeValues[option]);
                            setMethodMenuVisible(false);
                            handleInputChange();
                          }}
                        />
                      ))}
                    </Menu>
                    {paymentMethod === 'Reservación (50%)' && (
                      <>
                        <TextInput
                          label="Monto Total"
                          value={amount}
                          onChangeText={(text) => {
                            const numericValue = text.replace(/[^0-9.]/g, '');
                            setAmount(numericValue);
                            if (!manualAdvancePayment) {
                              setAdvancePayment((parseFloat(numericValue || '0') * 0.5).toFixed(2));
                            }
                            handleInputChange();
                          }}
                          mode="outlined"
                          keyboardType="numeric"
                          placeholder="Ejemplo: 1000.00"
                          style={[styles.input, !amount && styles.placeholderText]}
                          left={<TextInput.Icon icon="cash" />}
                        />
                        <TextInput
                          label="Adelanto (50%)"
                          value={advancePayment}
                          onChangeText={(text) => {
                            const numericValue = text.replace(/[^0-9.]/g, '');
                            setAdvancePayment(numericValue);
                            setManualAdvancePayment(numericValue !== "");
                          }}
                          onBlur={() => {
                            if (advancePayment.trim() === "") {
                              const autoValue = (parseFloat(amount || '0') * 0.5).toFixed(2);
                              setAdvancePayment(autoValue);
                              setManualAdvancePayment(false);
                            }
                          }}
                          mode="outlined"
                          keyboardType="numeric"
                          style={styles.input}
                          left={<TextInput.Icon icon="cash-multiple" />}
                        />
                      </>
                    )}
                    {paymentMethod === 'Reservación pagada' && (
                      <TextInput
                        label="Monto Total"
                        value={amount}
                        onChangeText={(text) => {
                          const numericValue = text.replace(/[^0-9.]/g, '');
                          setAmount(numericValue);
                          handleInputChange();
                        }}
                        mode="outlined"
                        keyboardType="numeric"
                        placeholder="Ejemplo: 1000.00"
                        style={[styles.input, !amount && styles.placeholderText]}
                        left={<TextInput.Icon icon="cash" />}
                      />
                    )}
                    {paymentMethod === 'Registro directo' && (
                      <TextInput
                        label="Pago Total"
                        value={amount}
                        onChangeText={(text) => {
                          const numericValue = text.replace(/[^0-9.]/g, '');
                          setAmount(numericValue);
                          handleInputChange();
                        }}
                        mode="outlined"
                        keyboardType="numeric"
                        placeholder="Ejemplo: 1000.00"
                        style={[styles.input, !amount && styles.placeholderText]}
                        left={<TextInput.Icon icon="cash-register" />}
                      />
                    )}
                  </>
                )}
                <TextInput
                  label="Nombre del Cliente"
                  value={guestName}
                  onChangeText={(text) => {
                    setGuestName(text);
                    handleInputChange();
                  }}
                  mode="outlined"
                  placeholder="Ejemplo: Juan Pérez"
                  style={[styles.input, !guestName && styles.placeholderText]}
                  left={<TextInput.Icon icon="account" />}
                />

                <TextInput
                  label="Teléfono (Opcional)"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    handleInputChange();
                  }}
                  mode="outlined"
                  keyboardType="phone-pad"
                  placeholder="Ejemplo: 5551234567"
                  style={[styles.input, !phone && styles.placeholderText]}
                  left={<TextInput.Icon icon="phone" />}
                />

                <TextInput
                  label="Compañía (Opcional)"
                  value={company}
                  onChangeText={(text) => {
                    setCompany(text);
                    handleInputChange();
                  }}
                  mode="outlined"
                  placeholder="Ejemplo: Empresa XYZ"
                  style={[styles.input]}
                  left={<TextInput.Icon icon="domain" />}
                />

                <TextInput
                  label="Huéspedes (Opcional)"
                  value={peoples}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, '');
                    setPeoples(numericValue);
                    handleInputChange();
                  }}
                  mode="outlined"
                  placeholder="Ejemplo: 2 adultos"
                  keyboardType="numeric"
                  style={styles.input}
                  left={<TextInput.Icon icon="account-group" />}
                  right={<TextInput.Affix text="personas" />}
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
                    disabled={
                      !guestName || !amount || !paymentMethod || !paymentMethodType
                    }
                  >
                    Guardar
                  </Button>
                </View>
              </>
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
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
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 1,
  },
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