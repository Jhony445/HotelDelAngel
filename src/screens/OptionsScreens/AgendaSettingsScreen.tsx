import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ConfirmModal from '../../components/ComponentsSettings/ConfirmModal'; // Asumiendo que crearás este componente
import { exportarDatos } from '../../services/options/exportData';
import { realizarBackup } from '../../services/options/BackUpDataAgenda';
import { eliminarTodasLasReservaciones } from '../../services/options/delete';

const AgendaSettingsScreen: React.FC = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleExportData = () => {
    exportarDatos();
    Alert.alert('Éxito', 'Datos exportados correctamente');
  };

  const handleBackup = () => {
    realizarBackup();
    Alert.alert('Copia de seguridad', 'Backup realizado con éxito');
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    await eliminarTodasLasReservaciones();
    Alert.alert('Eliminados', 'Todos los datos han sido borrados');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Tarjeta de Exportación */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.optionItem} onPress={handleExportData}>
          <Ionicons name="download-outline" size={24} color="#1E88E5" />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Exportar Datos</Text>
            <Text style={styles.optionSubtitle}>Generar archivo CSV/PDF con todos los registros</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#90A4AE" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.optionItem} onPress={handleBackup}>
          <Ionicons name="cloud-upload-outline" size={24} color="#1E88E5" />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Copia de Seguridad</Text>
            <Text style={styles.optionSubtitle}>Guardar en la nube todos los registros actuales</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#90A4AE" />
        </TouchableOpacity>
      </View>

      {/* Zona Peligrosa */}
      <View style={[styles.card, styles.dangerCard]}>
        <Text style={styles.dangerTitle}>Zona de Acciones Críticas</Text>
        
        <TouchableOpacity 
          style={styles.dangerOption} 
          onPress={() => setShowDeleteModal(true)}
        >
          <Ionicons name="trash-bin-outline" size={24} color="#D32F2F" />
          <View style={styles.textContainer}>
            <Text style={styles.dangerOptionTitle}>Borrar Todos los Datos</Text>
            <Text style={styles.dangerOptionSubtitle}>Esta acción es irreversible y eliminará todos los registros</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ConfirmModal
        visible={showDeleteModal}
        title="Confirmar Eliminación"
        message="¿Estás seguro que deseas eliminar todos los datos de forma permanente?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        danger
      />
      <Text style={styles.versionText}>Versión 1.0.0</Text>
    </ScrollView>
  );
};

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

export default AgendaSettingsScreen;