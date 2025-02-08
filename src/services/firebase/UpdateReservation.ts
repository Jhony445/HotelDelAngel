import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const actualizarReservaCompleta = async (reservaId: string) => {
  try {
    const reservaRef = doc(db, 'reservaciones', reservaId);
    
    const reservaSnapshot = await getDoc(reservaRef);
    if (!reservaSnapshot.exists()) {
      throw new Error('La reserva no existe');
    }

    const reservaData = reservaSnapshot.data();
    const advancePayment = reservaData.advancePayment || 0;

    await updateDoc(reservaRef, {
      paymentMethod: 'Pago completo',
      status: 'Pagado',
      advancePayment: advancePayment,
    });

    return true;
  } catch (error) {
    console.error('Error actualizando reservación:', error);
    throw error;
  }
};

export const actualizarReserva = async (reservaId: string, updatedData: any) => {
  try {
    const reservaRef = doc(db, 'reservaciones', reservaId);
    await updateDoc(reservaRef, updatedData);
    console.log('Reservación actualizada correctamente.');
    return true;
  } catch (error) {
    console.error('Error actualizando reservación:', error);
    throw error;
  }
};