
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Timestamp } from 'firebase/firestore';
export const agregarReserva = async (reservaData: {
  room: string;
  date: Date;
  guestName: string;
  phone: string;
  company: string;
  amount: string;
  paymentMethod: string;
  paymentMethodType: string;
  advancePayment: string;
  status: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, "reservaciones"), {
      ...reservaData,
      createdAt: new Date(),
      date: Timestamp.fromDate(reservaData.date),
    });
    console.log("Reserva agregada con ID:", docRef.id);
  } catch (error) {
    console.error("Error agregando la reserva:", error);
    throw error;
  }
};