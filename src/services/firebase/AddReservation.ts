import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

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
    const docRef = await addDoc(collection(db, "reservaciones"), {
      room,
      date,
      guestName,
      phone,
      company,
      amount,
      paymentMethod,
      createdAt: new Date(),
    });
    console.log("Reserva agregada con ID:", docRef.id);
  } catch (error) {
    console.error("Error agregando la reserva:", error);
  }
};
