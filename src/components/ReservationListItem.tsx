import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ReservationListItemProps {
  guestName: string;
  date: string;
}

const ReservationListItem: React.FC<ReservationListItemProps> = ({ guestName, date }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.guestName}>{guestName}</Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guestName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});

export default ReservationListItem;
