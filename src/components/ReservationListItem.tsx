import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface ReservationListItemProps {
  guestName: string;
  date: string;
  room: string;
  paymentMethod: string;
  amount: string;
  status: string;
  paymentMethodType: string;
  advancePayment?: string;
}

const ReservationListItem: React.FC<ReservationListItemProps> = ({
  guestName,
  date,
  room,
  paymentMethod,
  amount,
  status,
  paymentMethodType,
  advancePayment = "0"
}) => {
  const getStatusDetails = () => {
    const currentStatus = (status || '').toLowerCase();
    switch (currentStatus) {
      case 'reservado':
      case 'reserva':
        return { color: '#ffa726', label: 'Reserva (50%)', icon: 'timer-sand' };
      case 'pagado':
      case 'completo':
        return { color: '#66bb6a', label: 'Pagado', icon: 'check-circle' };
      case 'pendiente':
        return { color: '#ef5350', label: 'Pendiente', icon: 'alert-circle' };
      default:
        return { color: '#666', label: 'Desconocido', icon: 'help-circle' };
    }
  };
  const remainingBalance = parseFloat(amount) - parseFloat(advancePayment);

  const statusInfo = getStatusDetails();

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.guestName}>{guestName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
          <MaterialCommunityIcons name={statusInfo.icon} size={16} color="white" />
          <Text style={styles.statusText}>{statusInfo.label}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="bed" size={18} color="#666" />
          <Text style={styles.detailText}>{room}</Text>
        </View>

        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="calendar" size={18} color="#666" />
          <Text style={styles.detailText}>{date}</Text>
        </View>
      </View>

      <View style={styles.paymentInfo}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Monto total:</Text>
          <Text style={styles.amountText}>${amount}</Text>
        </View>

        {status.toLowerCase() === 'reservado' && (
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Saldo pendiente:</Text>
            <Text style={styles.pendingAmount}>
              ${remainingBalance.toFixed(2)}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <View style={styles.paymentMethod}>
          <MaterialCommunityIcons
            name={
              paymentMethodType === 'Efectivo' ? 'cash' :
                paymentMethodType === 'Tarjeta' ? 'credit-card' : 'bank-transfer'
            }
            size={16}
            color="#666"
          />
          <Text style={styles.paymentMethodText}>
            {paymentMethod || 'Método no especificado'} {/* Mostrar el tipo de operación */}
          </Text>
          <Text style={styles.paymentMethodText}>
            ({paymentMethodType || 'Tipo no especificado'}) {/* Mostrar método de pago entre paréntesis */}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },
  guestName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
    maxWidth: '70%',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    color: '#666',
    fontSize: 14,
  },
  paymentInfo: {
    marginBottom: 12,
    gap: 6,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    color: '#666',
    fontSize: 14,
  },
  amountText: {
    color: '#2d3436',
    fontSize: 16,
    fontWeight: '600',
  },
  pendingAmount: {
    color: '#ef5350',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paymentMethodText: {
    color: '#666',
    fontSize: 12,
  },
});

export default ReservationListItem;