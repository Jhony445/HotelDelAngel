import { db } from "./firebaseConfig";
import { collection, addDoc, Timestamp, serverTimestamp } from "firebase/firestore";

interface ReservaData {
  room: string;
  startDate: Date;
  endDate: Date;
  guestName: string;
  phone: string;
  company: string;
  amount: string;
  paymentMethod: string;
  paymentMethodType: string;
  advancePayment: string;
  status: string;
  peoples: number;
}

export const agregarReserva = async (reservaData: ReservaData) => {
  try {
    const startTimestamp = Timestamp.fromDate(reservaData.startDate);
    const endTimestamp = Timestamp.fromDate(reservaData.endDate);

    const docRef = await addDoc(collection(db, "reservaciones"), {
      ...reservaData,
      createdAt: serverTimestamp(),
      startDate: startTimestamp,
      endDate: endTimestamp,
    });

    console.log("Reserva agregada con ID:", docRef.id);
  } catch (error) {
    console.error("Error agregando la reserva:", error);
    throw error;
  }
};