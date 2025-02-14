import { obtenerReservaciones } from "../firestoreQueries";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

export const realizarBackup = async () => {
  try {
    const reservaciones = await obtenerReservaciones();
    if (reservaciones.length === 0) {
      Alert.alert("Aviso", "No hay datos para respaldar");
      return;
    }

    const jsonData = JSON.stringify(reservaciones, null, 2);
    const fileUri = FileSystem.documentDirectory + "backup_reservaciones.json";

    await FileSystem.writeAsStringAsync(fileUri, jsonData, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert("Error", "No se puede compartir el archivo en este dispositivo");
    }

    Alert.alert("Éxito", "Copia de seguridad realizada correctamente");
  } catch (error) {
    console.error("Error al realizar la copia de seguridad:", error);
    Alert.alert("Error", "No se pudo completar la copia de seguridad");
  }
};
