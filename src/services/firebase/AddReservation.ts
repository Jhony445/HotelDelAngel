// src/services/firebase/firestoreService.ts
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

// Función para agregar reserva
export const agregarReserva = async (
  room: string,
  date: Date,
  guestName: string,
  phone: string,
  company: string,
  amount: string,
  paymentMethod: string
) => {
  try {
    // Agregar la reserva a Firestore
    const docRef = await addDoc(collection(db, "reservaciones"), {
      room,
      date,
      guestName,
      phone,
      company,
      amount,
      paymentMethod,
      createdAt: new Date(), // Fecha de creación de la reserva
    });
    console.log("Reserva agregada con ID:", docRef.id);
  } catch (error) {
    console.error("Error agregando la reserva:", error);
  }
};
