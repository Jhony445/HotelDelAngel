import { obtenerReservaciones } from "../firebase/firestoreQueries";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

const generarCSV = (reservaciones: any[]) => {
  const encabezados = "ID,Huésped,Fecha,Habitación,Estado,Monto Pagado,Anticipo,Empresa,Método de Pago,Tipo de Pago,Personas,Teléfono\n";
  const filas = reservaciones
    .map(
      (res) =>
        `${res.id},${res.guestName || "Desconocido"},${res.date},${res.room || "N/A"},${res.status || "Pendiente"},${res.amount || "0.00"},${res.advancePayment || "0.00"},${res.company || "N/A"},${res.paymentMethod || "N/A"},${res.paymentMethodType || "N/A"},${res.peoples || "1"},${res.phone || "N/A"}`
    )
    .join("\n");
  return encabezados + filas;
};

export const exportarDatos = async () => {
  try {
    const reservaciones = await obtenerReservaciones();
    if (reservaciones.length === 0) {
      Alert.alert("Aviso", "No hay datos para exportar");
      return;
    }

    const csvData = generarCSV(reservaciones);
    const fileUri = FileSystem.documentDirectory + "reservaciones.csv";

    await FileSystem.writeAsStringAsync(fileUri, csvData, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert("Error", "No se puede compartir el archivo en este dispositivo");
    }
  } catch (error) {
    console.error("Error al exportar datos:", error);
    Alert.alert("Error", "No se pudieron exportar los datos");
  }
};
