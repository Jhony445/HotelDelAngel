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
