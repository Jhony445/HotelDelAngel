import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const actualizarReservaCompleta = async (reservaId: string) => {
  try {
    const reservaRef = doc(db, 'reservaciones', reservaId);
    
    // 🔹 Obtener los datos actuales de la reserva
    const reservaSnapshot = await getDoc(reservaRef);
    if (!reservaSnapshot.exists()) {
      throw new Error('La reserva no existe');
    }

    const reservaData = reservaSnapshot.data();
    const advancePayment = reservaData.advancePayment || 0; // Mantener el adelanto

    // 🔹 Actualizar la reserva pero conservando el advancePayment
    await updateDoc(reservaRef, {
      paymentMethod: 'Pago completo',
      status: 'Pagado',
      advancePayment: advancePayment, // Asegurar que no se pierda
    });

    return true;
  } catch (error) {
    console.error('Error actualizando reservación:', error);
    throw error;
  }
};
