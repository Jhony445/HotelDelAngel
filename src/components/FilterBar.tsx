import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface FilterBarProps {
  onFilterChange: (text: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [filterText, setFilterText] = useState('');

  const handleFilterChange = (text: string) => {
    setFilterText(text);
    onFilterChange(text);
  };

  const clearFilter = () => {
    setFilterText('');
    onFilterChange('');
  };

  return (
    <View style={[styles.container, filterText ? styles.activeContainer : null]}>
      <Ionicons name="search" size={20} color="#007bff" style={styles.icon} />

      <TextInput
        style={styles.input}
        placeholder="Buscar reservación..."
        placeholderTextColor="#aaa"
        value={filterText}
        onChangeText={handleFilterChange}
      />

      {filterText.length > 0 && (
        <TouchableOpacity onPress={clearFilter} style={styles.clearButton}>
          <Ionicons name="close-circle" size={18} color="#ff4d4d" />
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={[styles.filterButton, filterText ? styles.filterButtonActive : null]}
        disabled={!filterText}
      >
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
    borderWidth: 0.3,
    borderColor: '#999090',
    marginBottom: 10,
    width: '100%',
  },
  activeContainer: {
    borderColor: '#007bff',
    borderWidth: 1,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    marginRight: 10,
  },
  filterButton: {
    backgroundColor: '#ccc',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
  },
  filterButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default FilterBar;
