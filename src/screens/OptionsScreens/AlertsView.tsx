import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigationTypes';

const AlertsView: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [alerts, setAlerts] = useState({
    newReservations: true,
    cancellations: true,
    upcomingReservations: true,
    lowStock: true,
    salesUpdates: false,
  });

  const toggleSwitch = (alertType: keyof typeof alerts) => {
    setAlerts(prev => ({ ...prev, [alertType]: !prev[alertType] }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Configuración Global */}
      <View style={styles.card}>
        <View style={styles.optionItem}>
          <Ionicons name="notifications-outline" size={24} color="#1E88E5" />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Notificaciones</Text>
            <Text style={styles.optionSubtitle}>Activar/Desactivar todas las notificaciones</Text>
          </View>
          <Switch
            trackColor={{ false: '#B0BEC5', true: '#90CAF9' }}
            thumbColor={notificationsEnabled ? '#1E88E5' : '#f4f3f4'}
            onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
            value={notificationsEnabled}
          />
        </View>
      </View>

      {/* Alertas de Reservaciones */}
      <View style={[styles.card, { marginTop: 16 }]}>
        <Text style={styles.sectionTitle}>Alertas de Reservaciones</Text>
        <TouchableOpacity style={styles.optionItem} onPress={() => toggleSwitch('newReservations')}>
          <Ionicons name="add-circle-outline" size={24} color="#1E88E5" />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Nuevas Reservaciones</Text>
            <Text style={styles.optionSubtitle}>Recibir notificaciones inmediatas</Text>
          </View>
          <Switch
            trackColor={{ false: '#B0BEC5', true: '#90CAF9' }}
            thumbColor={alerts.newReservations ? '#1E88E5' : '#f4f3f4'}
            value={alerts.newReservations}
          />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.optionItem} onPress={() => toggleSwitch('upcomingReservations')}>
          <Ionicons name="alarm-outline" size={24} color="#1E88E5" />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Recordatorios</Text>
            <Text style={styles.optionSubtitle}>Alertas previas a las reservaciones</Text>
          </View>
          <Switch
            trackColor={{ false: '#B0BEC5', true: '#90CAF9' }}
            thumbColor={alerts.upcomingReservations ? '#1E88E5' : '#f4f3f4'}
            value={alerts.upcomingReservations}
          />
        </TouchableOpacity>
      </View>

      {/* Alertas de Tienda */}
      <View style={[styles.card, { marginTop: 16 }]}>
        <Text style={styles.sectionTitle}>Alertas de Tienda</Text>
        
        <TouchableOpacity style={styles.optionItem} onPress={() => toggleSwitch('lowStock')}>
          <Ionicons name="alert-circle-outline" size={24} color="#1E88E5" />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Stock Bajo</Text>
            <Text style={styles.optionSubtitle}>Notificar cuando el inventario sea bajo</Text>
          </View>
          <Switch
            trackColor={{ false: '#B0BEC5', true: '#90CAF9' }}
            thumbColor={alerts.lowStock ? '#1E88E5' : '#f4f3f4'}
            value={alerts.lowStock}
          />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.optionItem} onPress={() => toggleSwitch('salesUpdates')}>
          <Ionicons name="trending-up-outline" size={24} color="#1E88E5" />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Actualizaciones de Ventas</Text>
            <Text style={styles.optionSubtitle}>Resumen diario de ventas</Text>
          </View>
          <Switch
            trackColor={{ false: '#B0BEC5', true: '#90CAF9' }}
            thumbColor={alerts.salesUpdates ? '#1E88E5' : '#f4f3f4'}
            value={alerts.salesUpdates}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A237E',
    marginBottom: 24,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E88E5',
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#263238'
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#90A4AE',
    marginTop: 4
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8
  },
});

export default AlertsView;