import { db } from './firebaseConfig';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';

export const obtenerReservaciones = async () => {
    try {
        const q = query(
            collection(db, 'reservaciones'),
            orderBy('startDate', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            const startDate = data.startDate?.toDate();
            const endDate = data.endDate?.toDate();

            return {
                id: doc.id,
                ...data,
                date: startDate?.toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }) || 'Sin fecha',
                rawDate: data.startDate,
                startDate: startDate,
                endDate: endDate,
                createdAt: data.createdAt?.toDate()
            };
        });
    } catch (error) {
        console.error('Error obteniendo reservaciones:', error);
        throw error;
    }
};