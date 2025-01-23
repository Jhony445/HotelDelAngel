import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { agregarDocumentoPrueba, obtenerDocumentosPrueba } from "../services/firebase/firestoreTest"; // Ajusta la ruta si es necesario

const StoreScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de Store</Text>
      <Button 
        title="Agregar Documento" 
        onPress={agregarDocumentoPrueba} 
      />
      <Button 
        title="Obtener Documentos" 
        onPress={obtenerDocumentosPrueba} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default StoreScreen;
