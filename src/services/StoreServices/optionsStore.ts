import { getProducts, getAllProducts, getSales } from "../StoreServices/ProductService";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import { db } from "./firebaseConfigStore";
import { collection, getDocs, writeBatch } from "firebase/firestore";

// Exportar inventario (solo productos activos)
export const exportInventoryData = async () => {
  try {
    const products = await getProducts();
    
    if (products.length === 0) {
      Alert.alert("Aviso", "No hay productos para exportar");
      return;
    }

    const jsonData = JSON.stringify(products, null, 2);
    const fileUri = FileSystem.documentDirectory + "inventario_exportado.json";

    await FileSystem.writeAsStringAsync(fileUri, jsonData, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
      Alert.alert("Éxito", "Datos exportados correctamente");
    } else {
      Alert.alert("Error", "Función de compartir no disponible");
    }
  } catch (error) {
    console.error("Error al exportar:", error);
    Alert.alert("Error", "Error al exportar inventario");
  }
};

// Backup completo (productos + ventas)
export const backupInventoryData = async () => {
  try {
    const [products, sales] = await Promise.all([
      getAllProducts(),
      getSales(),
    ]);

    if (products.length === 0 && sales.length === 0) {
      Alert.alert("Aviso", "No hay datos para respaldar");
      return;
    }

    const backupData = {
      metadata: {
        fecha: new Date().toISOString(),
        totalProductos: products.length,
        totalVentas: sales.length,
      },
      productos: products,
      ventas: sales,
    };

    const jsonData = JSON.stringify(backupData, null, 2);
    const fileUri = FileSystem.documentDirectory + "backup_completo.json";

    await FileSystem.writeAsStringAsync(fileUri, jsonData, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
      Alert.alert("Éxito", "Backup realizado correctamente");
    } else {
      Alert.alert("Error", "Función de compartir no disponible");
    }
  } catch (error) {
    console.error("Error en backup:", error);
    Alert.alert("Error", "Error al realizar el backup");
  }
};

// Eliminar todos los datos
export const deleteAllStoreData = async () => {
  try {
    const batch = writeBatch(db);
    
    // Eliminar productos
    const productsSnapshot = await getDocs(collection(db, "products"));
    productsSnapshot.forEach((doc) => batch.delete(doc.ref));
    
    // Eliminar ventas
    const salesSnapshot = await getDocs(collection(db, "sales"));
    salesSnapshot.forEach((doc) => batch.delete(doc.ref));

    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error al eliminar datos:", error);
    throw error;
  }
};