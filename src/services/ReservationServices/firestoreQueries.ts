import { db } from './firebaseConfig';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
export const obtenerReservaciones = async () => {
    try {
        const q = query(
            collection(db, 'reservaciones'),
            orderBy('date', 'desc')
        );

        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date.toDate().toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            rawDate: doc.data().date
        }));
    } catch (error) {
        console.error('Error obteniendo reservaciones:', error);
        throw error;
    }
};