import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ConfirmModal from '../../components/ComponentsSettings/ConfirmModal';

const StoreSettingsScreen: React.FC = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleExportStoreData = () => {
    Alert.alert('Éxito', 'Datos de la tienda exportados correctamente');
  };

  const handleInventoryBackup = () => {
    Alert.alert('Backup', 'Inventario respaldado con éxito');
  };

  const confirmDeleteStoreData = () => {
    setShowDeleteModal(false);
    Alert.alert('Eliminados', 'Todos los datos de la tienda han sido borrados');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Configuración del Inventario */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.optionItem} onPress={handleExportStoreData}>
          <Ionicons name="document-text-outline" size={24} color="#1E88E5" />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Exportar Inventario</Text>
            <Text style={styles.optionSubtitle}>Generar reporte detallado de productos</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#90A4AE" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.optionItem} onPress={handleInventoryBackup}>
          <Ionicons name="server-outline" size={24} color="#1E88E5" />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Respaldo de Inventario</Text>
            <Text style={styles.optionSubtitle}>Guardar copia en la nube</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#90A4AE" />
        </TouchableOpacity>
      </View>

      {/* Configuración Avanzada */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="pricetags-outline" size={24} color="#1E88E5" />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Etiquetas y Precios</Text>
            <Text style={styles.optionSubtitle}>Configurar formato de precios</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#90A4AE" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="notifications-outline" size={24} color="#1E88E5" />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Alertas de Stock</Text>
            <Text style={styles.optionSubtitle}>Configurar niveles mínimos</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#90A4AE" />
        </TouchableOpacity>
      </View>

      {/* Zona Peligrosa */}
      <View style={[styles.card, styles.dangerCard]}>
        <Text style={styles.dangerTitle}>Acciones Destructivas</Text>
        
        <TouchableOpacity 
          style={styles.dangerOption} 
          onPress={() => setShowDeleteModal(true)}
        >
          <Ionicons name="trash-bin-outline" size={24} color="#D32F2F" />
          <View style={styles.textContainer}>
            <Text style={styles.dangerOptionTitle}>Restablecer Tienda</Text>
            <Text style={styles.dangerOptionSubtitle}>Eliminará todos los productos y transacciones</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ConfirmModal
        visible={showDeleteModal}
        title="Restablecer Tienda"
        message="¿Estás seguro de eliminar todos los datos de la tienda? Esta acción no se puede deshacer."
        confirmText="Confirmar"
        cancelText="Cancelar"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteStoreData}
        danger
      />

      <Text style={styles.versionText}>Versión 1.0.0</Text>
    </ScrollView>
  );
};

// Reutilizamos los mismos estilos de AgendaSettingsScreen
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  dangerCard: {
    borderColor: '#FFCDD2',
    borderWidth: 1,
    backgroundColor: '#FFF9F9',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#263238',
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#90A4AE',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 8,
  },
  dangerTitle: {
    color: '#D32F2F',
    fontWeight: '700',
    marginBottom: 12,
    fontSize: 14,
  },
  dangerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  dangerOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
  },
  dangerOptionSubtitle: {
    fontSize: 13,
    color: '#E57373',
    marginTop: 4,
  },
  versionText: {
    textAlign: 'center',
    color: '#B0BEC5',
    marginTop: 24,
    fontSize: 12,
  },
});

export default StoreSettingsScreen;