import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface FilterBarProps {
  onFilterChange: (text: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#007bff" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Buscar reservación..."
        placeholderTextColor="#aaa"
        onChangeText={onFilterChange}
      />
      <TouchableOpacity style={styles.filterButton}>
        <Text style={styles.filterButtonText}>Filtrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
    borderWidth: 0.3,
    borderColor: '#999090',
    marginBottom: 10,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  filterButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default FilterBar;
