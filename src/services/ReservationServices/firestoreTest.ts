// src/services/firebase/firestoreTest.ts
import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Función para agregar datos de prueba
export const agregarDocumentoPrueba = async () => {
  try {
    const docRef = await addDoc(collection(db, "pruebas"), {
      nombre: "Nuevo Documento",
      activo: true,
      fecha: new Date(),
    });
    console.log("Documento agregado con ID:", docRef.id);
  } catch (error) {
    console.error("Error agregando documento:", error);
  }
};

// Función para leer datos de Firestore
export const obtenerDocumentosPrueba = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "pruebas"));
    querySnapshot.forEach((doc) => {
      console.log(`ID: ${doc.id}, Datos:`, doc.data());
    });
  } catch (error) {
    console.error("Error leyendo documentos:", error);
  }
};
