import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const COLORS = {
  primary: '#2e7d32',
  background: '#ffffff',
  text: '#1b5e20',
  border: '#cccccc',
};

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onClear }) => {
  const [query, setQuery] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: query.length > 0 ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [query]);

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={COLORS.text} style={styles.searchIcon} />
      
      <TextInput
        style={styles.input}
        placeholder="Buscar productos..."
        placeholderTextColor={COLORS.border}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          onSearch(text);
        }}
        autoCorrect={false}
        autoCapitalize="none"
      />
      
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color={COLORS.border} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginHorizontal: 16,
    marginVertical: 10,
    height: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  clearButton: {
    padding: 5,
    marginLeft: 10,
  },
});

export default SearchBar;