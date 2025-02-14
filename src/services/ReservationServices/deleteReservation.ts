import { db } from './firebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';

export const eliminarReserva = async (reservaId: string) => {
  try {
    const reservaRef = doc(db, 'reservaciones', reservaId);
    await deleteDoc(reservaRef);
    console.log('Reserva eliminada correctamente.');
  } catch (error) {
    console.error('Error al eliminar la reservación:', error);
    throw error;
  }
};