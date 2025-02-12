import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigationTypes';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
      
      {/* Tarjeta de Configuración */}
      <View style={styles.card}>
        <TouchableOpacity 
          style={styles.optionItem}
          onPress={() => navigation.navigate('AgendaSettings')}
        >
          <Ionicons name="calendar" size={24} color="#1E88E5" />
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Agenda</Text>
            <Text style={styles.optionSubtitle}>Configura tu agenda</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#90A4AE" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity 
          style={styles.optionItem}
          onPress={() => navigation.navigate('StoreSettings')}
        >
          <Ionicons name="storefront" size={24} color="#1E88E5" />
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Tienda</Text>
            <Text style={styles.optionSubtitle}>Ajustes de tu negocio</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#90A4AE" />
        </TouchableOpacity>
      </View>

      {/* Opción adicional de ejemplo */}
      <View style={[styles.card, { marginTop: 16 }]}>
        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="notifications" size={24} color="#1E88E5" />
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Notificaciones</Text>
            <Text style={styles.optionSubtitle}>Personaliza alertas</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#90A4AE" />
        </TouchableOpacity>
      </View>

      {/* Botón de Cerrar Sesión */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A237E',
    marginVertical: 24,
    marginLeft: 8
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionText: {
    flex: 1,
    marginLeft: 16
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#263238'
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#90A4AE',
    marginTop: 2
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8
  },
  logoutButton: {
    marginTop: 32,
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  logoutText: {
    color: '#1E88E5',
    fontWeight: '600',
    fontSize: 16
  }
});

export default SettingsScreen;