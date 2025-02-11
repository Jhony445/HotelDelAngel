import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/navigationTypes";
import ReservationListItem from "../components/ComponentsReservation/ReservationListItem";
import { obtenerReservaciones } from "../services/firebase/firestoreQueries";
import CalendarPicker from "../components/ComponentsReservation/CalendarPicker";

const CalendarScreen = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [calendarHeight, setCalendarHeight] = useState(360);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await obtenerReservaciones();
        setReservations(data);
      } catch (err) {
        setError("Error al cargar las reservaciones");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <View style={styles.container}>
      {/* Parte superior */}
      <View style={styles.topSection}>
        <Text style={styles.title}>Calendario de Reservas</Text>
        <View style={[styles.calendarContainer, { height: calendarHeight }]}>
          <CalendarPicker
            onHeightChange={setCalendarHeight}
            reservations={reservations}
          />
        </View>
      </View>

      {/* Parte inferior */}
      <View style={styles.bottomSection}>
        <Text style={styles.sectionSubtitle}>Reservas del Día</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#1E88E5" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={reservations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ReservationListItem
                guestName={item.guestName || ""}
                date={item.date || "Sin fecha"}
                room={item.room || ""}
                paymentMethod={item.paymentMethod || "No especificado"}
                amount={item.amount || "0"}
                status={item.status || "pendiente"}
                paymentMethodType={item.paymentMethodType || "No especificado"}
                advancePayment={item.advancePayment || "0"}
                onPress={() =>
                  navigation.navigate("ReservationDetails", {
                    reservation: {
                      id: item.id,
                      ...item,
                      date: item.rawDate?.toMillis(),
                      createdAt: item.createdAt?.toMillis(),
                    },
                  })
                }
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No hay reservas programadas
              </Text>
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  topSection: {
    alignItems: "center",
    paddingVertical: 25,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    paddingHorizontal: 5,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1E88E5",
    marginBottom: 20,
    letterSpacing: 0.8,
    textShadowColor: "rgba(25, 118, 210, 0.15)", // Sombra sutil en tono azul
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  calendarContainer: {
    width: "100%",
    borderRadius: 15,
    padding: 5,
    marginHorizontal: 0,
  },
  sectionSubtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1E88E5",
    textAlign: "center",
    marginBottom: 15,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  bottomSection: {
    flex: 1,
    padding: 5,
    paddingTop: 15,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#757575",
  },
});

export default CalendarScreen;
