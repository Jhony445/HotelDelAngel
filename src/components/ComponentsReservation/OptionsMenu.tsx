import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
  Text,
} from "react-native";
import { Menu, Divider } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { eliminarReserva } from "../../services/firebase/deleteReservation"; // Función de eliminación

interface OptionsMenuProps {
  reservaId: string;
  onUpdate: () => void;
  onDelete: () => void;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({ reservaId, onUpdate, onDelete }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await eliminarReserva(reservaId);
      setLoading(false);
      Alert.alert("Eliminado", "Se eliminó correctamente.", [
        { text: "Aceptar", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "No se pudo eliminar la reservación.");
    }
  };

  const confirmDelete = () => {
    closeMenu();
    Alert.alert("Confirmación", "¿Seguro que desea eliminar esta reserva?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Aceptar", onPress: handleDelete },
    ]);
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <TouchableOpacity onPress={openMenu} style={styles.button}>
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        }
        style={styles.menu}
      >
        <Menu.Item onPress={() => { closeMenu(); onUpdate(); }} title="Actualizar" />
        <Divider />
        <Menu.Item onPress={confirmDelete} title="Eliminar" />
      </Menu>

      {/* Modal para mostrar el ActivityIndicator mientras se elimina */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="blue" />
            <Text style={styles.loadingText}>Eliminando...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  button: {
    padding: 10,
  },
  menu: {
    marginTop: 87,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});

export default OptionsMenu;
