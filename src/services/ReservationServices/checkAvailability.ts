import { db } from "./firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

/**
 * Verifica si una habitación está disponible en el rango [startDate, endDate].
 * Retorna `true` si está libre (no traslapa con ninguna reserva), `false` si está ocupada.
 */
export const checkRoomAvailability = async (
  room: string,
  startDate: Date,
  endDate: Date
): Promise<boolean> => {
  try {
    const normalizeDate = (date: Date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const normalizedStart = normalizeDate(startDate);
    const normalizedEnd = normalizeDate(endDate);

    const q = query(
      collection(db, "reservaciones"),
      where("room", "==", room),
      where("startDate", "<=", normalizedEnd)
    );

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return true;

    return !querySnapshot.docs.some(doc => {
      const reserva = doc.data();
      const rStart = normalizeDate(reserva.startDate.toDate());
      const rEnd = normalizeDate(reserva.endDate.toDate());
      
      return (
        (rStart < normalizedEnd) && 
        (rEnd > normalizedStart)
      );
    });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Verifica disponibilidad para actualizar una reserva existente (reservationId).
 * Permite que la única reserva traslapada sea la propia.
 */
export const checkRoomAvailabilityForUpdate = async (
  room: string,
  startDate: Date,
  endDate: Date,
  reservationId: string
): Promise<boolean> => {
  try {
    const normalizeDate = (date: Date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const normalizedStart = normalizeDate(startDate);
    const normalizedEnd = normalizeDate(endDate);

    const q = query(
      collection(db, "reservaciones"),
      where("room", "==", room),
      where("startDate", "<=", normalizedEnd)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return true;

    return !querySnapshot.docs.some((doc) => {
      if (doc.id === reservationId) return false; // Ignorar la reserva actual

      const reserva = doc.data();
      const rStart = normalizeDate(reserva.startDate.toDate());
      const rEnd = normalizeDate(reserva.endDate.toDate());

      // Comprobar si hay traslape de fechas
      return (
        (rStart < normalizedEnd && rEnd > normalizedStart) ||
        (rStart <= normalizedStart && rEnd >= normalizedEnd)
      );
    });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
