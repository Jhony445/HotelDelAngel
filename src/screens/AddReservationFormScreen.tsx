import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const AddReservationFormScreen = () => {
  const [isFormDirty, setIsFormDirty] = useState(false); // Indica si el formulario tiene cambios no guardados
  const navigation = useNavigation();

  useEffect(() => {
    // Intercepta el evento de salir de la pantalla
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!isFormDirty) {
        // Si no hay cambios, permite la navegación
        return;
      }

      // Evita que se ejecute la navegación inmediatamente
      e.preventDefault();

      // Muestra la alerta
      Alert.alert(
        'Salir sin guardar',
        '¿Estás seguro de que quieres salir sin guardar los cambios?',
        [
          { text: 'Cancelar', style: 'cancel' }, // No hace nada, mantiene al usuario en la pantalla
          {
            text: 'Salir',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action), // Permite la navegación
          },
        ]
      );
    });

    // Limpia el listener al desmontar el componente
    return unsubscribe;
  }, [isFormDirty, navigation]);

  // Marca el formulario como modificado
  const handleInputChange = () => {
    setIsFormDirty(true);
  };

  // Manejo del botón "Guardar"
  const handleSubmit = () => {
    console.log('Formulario enviado');
    setIsFormDirty(false); // Después de guardar, el formulario está limpio
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulario de Reservación</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        onChangeText={handleInputChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha"
        onChangeText={handleInputChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Detalles"
        multiline
        onChangeText={handleInputChange}
      />
      <Button title="Guardar" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default AddReservationFormScreen;
