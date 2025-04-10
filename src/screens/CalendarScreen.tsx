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
import CalendarPicker from "../components/ComponentsReservation/CalendarPicker";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../services/ReservationServices/firebaseConfig";

const CalendarScreen = () => {
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${("0" + (today.getMonth() + 1)).slice(-2)}-${("0" + today.getDate()).slice(-2)}`;
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(formattedToday);
  
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [calendarHeight, setCalendarHeight] = useState(360);

  useEffect(() => {
    const q = query(
      collection(db, "reservaciones"),
      orderBy("startDate", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          const reservationData = doc.data();

          const safeStartDate =
            reservationData?.startDate &&
            typeof reservationData.startDate.toDate === "function"
              ? reservationData.startDate.toDate()
              : new Date();

          const safeEndDate =
            reservationData?.endDate &&
            typeof reservationData.endDate.toDate === "function"
              ? reservationData.endDate.toDate()
              : new Date(safeStartDate);

          return {
            id: doc.id,
            ...reservationData,
            startDate: safeStartDate,
            endDate: safeEndDate,
            date: safeStartDate.toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            rawDate: safeStartDate,
          };
        });
        setReservations(data);
        setLoading(false);
      },
      (err) => {
        setError("Error al cargar las reservaciones");
        console.error(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredReservations = selectedDate
    ? reservations.filter((reservation) => {
        const [year, month, day] = selectedDate.split("-").map(Number);
        const selectedLocal = new Date(year, month - 1, day);

        const startDay = new Date(
          reservation.startDate.getFullYear(),
          reservation.startDate.getMonth(),
          reservation.startDate.getDate()
        );
        const endDay = new Date(
          reservation.endDate.getFullYear(),
          reservation.endDate.getMonth(),
          reservation.endDate.getDate()
        );

        return selectedLocal >= startDay && selectedLocal <= endDay;
      })
    : reservations;

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Agenda</Text>
        <View style={[styles.calendarContainer, { height: calendarHeight }]}>
          <CalendarPicker
            onHeightChange={setCalendarHeight}
            reservations={reservations.flatMap((reservation) => {
              const datesInRange: string[] = [];
              const startDate = reservation.startDate;
              const endDate = reservation.endDate;
              const current = new Date(startDate);
              while (current <= endDate) {
                datesInRange.push(current.toISOString().split("T")[0]);
                current.setDate(current.getDate() + 1);
              }
              return datesInRange;
            })}
            onDateSelected={(date) => setSelectedDate(date)}
          />
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.sectionSubtitle}>Reservas del Día</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#1E88E5" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : filteredReservations.length > 0 ? (
          <FlatList
            data={filteredReservations}
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
                      startDate: item.startDate.getTime(),
                      endDate: item.endDate.getTime(),
                      createdAt:
                        item.createdAt &&
                        typeof item.createdAt.toDate === "function"
                          ? item.createdAt.toDate().getTime()
                          : item.createdAt,
                      rawDate: item.startDate.getTime()
                    },
                  })
                }
              />
            )}
          />
        ) : (
          <Text style={styles.emptyText}>Sin reservas</Text>
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
    textShadowColor: "rgba(25, 118, 210, 0.15)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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