import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril',
  'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const COLORS = {
    primary: '#2e7d32',
    primaryLight: '#e8f5e9',
    textLight: '#ffffff',
    error: '#d32f2f'
  };
  

interface MonthFilterProps {
  onFilter: (month: number | null, year: number | null) => void;
}

const MonthFilter: React.FC<MonthFilterProps> = ({ onFilter }) => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showPicker, setShowPicker] = useState(false);

  const handleApply = () => {
    onFilter(selectedMonth, selectedYear);
    setShowPicker(false);
  };

  const handleClear = () => {
    setSelectedMonth(null);
    setSelectedYear(new Date().getFullYear());
    onFilter(null, null);
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={() => setShowPicker(!showPicker)}
      >
        <Ionicons name="calendar" size={20} color={COLORS.textLight} />
        <Text style={styles.buttonText}>Filtrar por mes</Text>
      </TouchableOpacity>

      {showPicker && (
        <View style={styles.pickerContainer}>
          <View style={styles.pickerRow}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
              style={styles.picker}
              dropdownIconColor={COLORS.primary}
            >
              <Picker.Item label="Todos los meses" value={null} />
              {months.map((month, index) => (
                <Picker.Item key={index} label={month} value={index} />
              ))}
            </Picker>

            <Picker
              selectedValue={selectedYear}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
              style={styles.picker}
              dropdownIconColor={COLORS.primary}
            >
              {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map((year) => (
                <Picker.Item key={year} label={year.toString()} value={year} />
              ))}
            </Picker>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearText}>Limpiar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 6,
    zIndex: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    gap: 10,
    elevation: 2,
  },
  buttonText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 8,
    elevation: 4,
    padding: 10,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  picker: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
    marginTop: 10,
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  clearText: {
    color: COLORS.error,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  applyText: {
    color: COLORS.textLight,
    fontWeight: '600',
  },
});

export default MonthFilter;