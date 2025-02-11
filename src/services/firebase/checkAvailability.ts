import { db } from "./firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

/**
 * Verifica si una habitación está disponible en una fecha específica.
 * @param room - El ID o nombre de la habitación a verificar.
 * @param date - La fecha a comprobar en formato Date.
 * @returns `true` si la habitación está disponible, `false` en caso contrario.
 */
export const checkRoomAvailability = async (room: string, date: Date): Promise<boolean> => {
  try {
    // Obtiene el inicio y el fin del día para la fecha seleccionada
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    // Consulta Firestore para buscar reservas en el mismo día para la habitación seleccionada
    const reservacionesRef = collection(db, "reservaciones");
    const q = query(
      reservacionesRef,
      where("room", "==", room),
      where("date", ">=", startOfDay),
      where("date", "<=", endOfDay)
    );

    const querySnapshot = await getDocs(q);

    // Si hay resultados, la habitación no está disponible
    return querySnapshot.empty;
  } catch (error) {
    console.error("Error verificando disponibilidad de la habitación:", error);
    throw new Error("No se pudo verificar la disponibilidad");
  }
};

/**
 * Verifica si una habitación está disponible en una fecha específica para el caso de actualización.
 * Si la única reserva encontrada es la misma que la que se está actualizando (según reservationId),
 * se considerará que la habitación está disponible.
 * 
 * @param room - El ID o nombre de la habitación a verificar.
 * @param date - La fecha a comprobar (tipo Date).
 * @param reservationId - El ID de la reserva que se está actualizando.
 * @returns `true` si la habitación está disponible o si la única reserva es la propia, `false` en caso contrario.
 */
export const checkRoomAvailabilityForUpdate = async (
  room: string,
  date: Date,
  reservationId: string
): Promise<boolean> => {
  try {
    // Clonar la fecha para no modificar el objeto original.
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Consulta Firestore para buscar reservas en la misma habitación y el mismo día.
    const reservacionesRef = collection(db, "reservaciones");
    const q = query(
      reservacionesRef,
      where("room", "==", room),
      where("date", ">=", startOfDay),
      where("date", "<=", endOfDay)
    );

    const querySnapshot = await getDocs(q);

    // Si no hay reservas, la habitación está disponible.
    if (querySnapshot.empty) {
      return true;
    }

    // Recorremos las reservas encontradas.
    let differentReservationFound = false;
    querySnapshot.forEach((doc) => {
      // Si se encuentra alguna reserva cuyo ID sea distinto a la que se está actualizando,
      // significa que la habitación ya está ocupada para esa fecha.
      if (doc.id !== reservationId) {
        differentReservationFound = true;
      }
    });

    return !differentReservationFound;
  } catch (error) {
    console.error("Error verificando disponibilidad de la habitación para actualización:", error);
    throw new Error("No se pudo verificar la disponibilidad para actualización");
  }
};