import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // Asegúrate de importar la instancia correcta de Firestore
import { Alert } from "react-native";

export const eliminarTodasLasReservaciones = async () => {
  try {
    const reservasRef = collection(db, "reservaciones");
    const snapshot = await getDocs(reservasRef);

    if (snapshot.empty) {
      Alert.alert("Aviso", "No hay datos para eliminar.");
      return;
    }

    const batchDelete = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, "reservaciones", docSnap.id))
    );

    await Promise.all(batchDelete);
    Alert.alert("Éxito", "Todas las reservaciones han sido eliminadas.");
  } catch (error) {
    console.error("Error al eliminar reservaciones:", error);
    Alert.alert("Error", "No se pudieron eliminar las reservaciones.");
  }
};
