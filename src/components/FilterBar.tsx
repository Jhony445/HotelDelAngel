import React, { useState } from 'react';
import { Platform } from 'react-native';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface FilterBarProps {
  onFilterChange: (text: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [filterText, setFilterText] = useState('');
  const [animation] = useState(new Animated.Value(0));

  const handleFilterChange = (text: string) => {
    setFilterText(text);
    onFilterChange(text);
    Animated.timing(animation, {
      toValue: text ? 1 : 0,
      duration: 200,
      useNativeDriver: false
    }).start();
  };

  const clearFilter = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false
    }).start(() => {
      setFilterText('');
      onFilterChange('');
    });
  };

  const buttonBackground = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e0e0e0', '#1a237e']
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={20} color="#757575" style={styles.icon} />

        <TextInput
          style={styles.input}
          placeholder="Buscar reservación..."
          placeholderTextColor="#9e9e9e"
          value={filterText}
          onChangeText={handleFilterChange}
        />

        {filterText.length > 0 && (
          <TouchableOpacity onPress={clearFilter} style={styles.clearButton}>
            <Ionicons name="close" size={20} color="#757575" />
          </TouchableOpacity>
        )}
      </View>

      {/* <Animated.View style={[styles.filterButton, { backgroundColor: buttonBackground }]}>
        <TouchableOpacity disabled={!filterText}>
          <Text style={styles.filterButtonText}>Filtrar</Text>
        </TouchableOpacity>
      </Animated.View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  icon: {
    marginLeft: 10,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2d3436',
    paddingVertical: 8,
  },
  clearButton: {
    padding: 5,
    marginLeft: 8,
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  filterButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

export default FilterBar;