import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  TextInput,
  Button,
  ActivityIndicator,
  Menu,
  Provider,
  Portal,
} from "react-native-paper";
import { useNavigation, RouteProp } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RootStackParamList } from "../../navigation/navigationTypes";
import { checkRoomAvailability , checkRoomAvailabilityForUpdate } from "../../services/ReservationServices/checkAvailability";
import { actualizarReserva } from "../../services/ReservationServices/UpdateReservation";

type UpdateReservationRouteProp = RouteProp<
  RootStackParamList,
  "UpdateReservation"
>;

interface UpdateReservationScreenProps {
  route: UpdateReservationRouteProp;
}

const ROOM_OPTIONS = [
  "301-D",
  "302-E",
  "303-F",
  "304-G",
  "305-H",
  "201-I",
  "202-J",
  "204-L",
  "1-Posada",
  "2-Posada",
  "3-Posada",
];

const UpdateReservationScreen: React.FC<UpdateReservationScreenProps> = ({
  route,
}) => {
  const { reservation } = route.params;
  const navigation = useNavigation();

  const [guestName, setGuestName] = useState(reservation.guestName || "");
  const [phone, setPhone] = useState(reservation.phone || "");
  const [company, setCompany] = useState(reservation.company || "");
  const [room, setRoom] = useState(reservation.room || "");
  const [amount, setAmount] = useState(reservation.amount || "");
  const [status, setStatus] = useState(reservation.status || "");
  const [paymentMethod, setPaymentMethod] = useState(
    reservation.paymentMethod || ""
  );
  const [paymentMethodType, setPaymentMethodType] = useState(
    reservation.paymentMethodType || ""
  );
  const [advancePayment, setAdvancePayment] = useState(
    reservation.advancePayment || ""
  );
  const [date, setDate] = useState(new Date(reservation.date));
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [peoples, setPeoples] = useState(reservation.peoples?.toString() || "");
  const [menuVisible, setMenuVisible] = useState(false);

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleUpdate = async () => {
    if (!room || !date) {
      Alert.alert("Error", "Selecciona una habitación y una fecha.");
      return;
    }

    setLoading(true);
    try {
      const isAvailable = await checkRoomAvailabilityForUpdate(room, date, reservation.id);
      if (!isAvailable) {
        Alert.alert(
          "Habitación ocupada",
          "La habitación seleccionada no está disponible para esta fecha."
        );
        setLoading(false);
        return;
      }

      const updatedData = {
        guestName,
        phone,
        peoples: Number(peoples),
        company,
        room,
        amount,
        status,
        paymentMethod,
        paymentMethodType,
        advancePayment,
        date,
      };

      await actualizarReserva(reservation.id, updatedData);
      Alert.alert("¡Éxito!", "La reservación se actualizó correctamente.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la reservación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Provider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Sección Principal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Principal</Text>

            {/* Selector de Habitación */}
            <View style={styles.inputContainer}>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setMenuVisible(true)}
                    style={styles.dropdownTrigger}
                  >
                    <TextInput
                      label="Habitación *"
                      value={room}
                      style={styles.input}
                      editable={false}
                      mode="outlined"
                      theme={inputTheme}
                      right={<TextInput.Icon icon="chevron-down" />}
                    />
                  </TouchableOpacity>
                }
                style={styles.menu}
              >
                {ROOM_OPTIONS.map((roomOption) => (
                  <Menu.Item
                    key={roomOption}
                    title={roomOption}
                    onPress={() => {
                      setRoom(roomOption);
                      setMenuVisible(false);
                    }}
                    titleStyle={styles.menuItem}
                    style={styles.menuItemContainer}
                  />
                ))}
              </Menu>
            </View>

            {/* Selector de Fecha */}
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateInput}
            >
              <TextInput
                label="Fecha"
                value={date.toLocaleDateString()}
                style={styles.input}
                editable={false}
                mode="outlined"
                theme={inputTheme}
                left={<TextInput.Icon icon="calendar" />}
              />
            </TouchableOpacity>
          </View>

          {/* Sección Huéspedes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos del Huésped</Text>

            <TextInput
              label="Nombre completo"
              value={guestName}
              onChangeText={setGuestName}
              style={styles.input}
              mode="outlined"
              theme={inputTheme}
              left={<TextInput.Icon icon="account" />}
            />

            <TextInput
              label="Teléfono"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              keyboardType="phone-pad"
              mode="outlined"
              theme={inputTheme}
              left={<TextInput.Icon icon="phone" />}
            />

            <TextInput
              label="Número de huéspedes"
              value={peoples}
              onChangeText={setPeoples}
              style={styles.input}
              keyboardType="numeric"
              mode="outlined"
              theme={inputTheme}
              left={<TextInput.Icon icon="account-group" />}
            />

            <TextInput
              label="Compañía"
              value={company}
              onChangeText={setCompany}
              style={styles.input}
              mode="outlined"
              theme={inputTheme}
              left={<TextInput.Icon icon="office-building" />}
            />
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
            />
          )}

          <Button
            mode="contained"
            onPress={handleUpdate}
            style={styles.button}
            loading={loading}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
          >
            {loading ? "Actualizando..." : "Guardar Cambios"}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </Provider>
  );
};

const inputTheme = {
  colors: {
    primary: '#6d28d9',
    background: '#fff',
  },
  roundness: 10,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
    overflow: 'visible',
  },
  input: {
    backgroundColor: '#fff',
    fontSize: 16,
    marginVertical: 8,
  },
  menu: {
    marginTop: 8,
    marginLeft: 12, // separa el menú del margen izquierdo
    width: '70%',
    borderRadius: 8,
    elevation: 10,
    backgroundColor: '#fff',
  },
  dropdownTrigger: {
    width: '100%',
  },
  menuItem: {
    fontSize: 16,
    color: '#374151',
  },
  menuItemContainer: {
    height: 48,
    paddingHorizontal: 12,
  },
  dateInput: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
    borderRadius: 12,
    backgroundColor: '#6d28d9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContent: {
    height: 52,
  },
});

export default UpdateReservationScreen;
