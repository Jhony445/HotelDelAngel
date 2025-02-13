import React from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/navigationTypes";
import ProductListItem from "../components/ComponentsStore/ProductListItem";
import Ionicons from "react-native-vector-icons/Ionicons";

// Colores principales
const COLORS = {
  primary: '#2e7d32',    // Verde principal
  primaryLight: '#e8f5e9', // Verde claro de fondo
  accent: '#00c853',     // Verde acento
  textDark: '#1b5e20',   // Texto oscuro
  textLight: '#ffffff',  // Texto claro
  background: '#f5f5f5'  // Fondo general
};

const StoreScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const products = [
    { id: "1", name: "Refresco", price: 15, stock: 10, image: 'https://via.placeholder.com/100' },
    { id: "2", name: "Agua Mineral", price: 10, stock: 20, image: 'https://via.placeholder.com/100' },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductListItem
            product={item}
            onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Productos en Inventario</Text>}
      />

      <View style={styles.fabContainer}>
        <TouchableOpacity 
          style={styles.fabButton}
          onPress={() => navigation.navigate("AddEditProduct", { product: undefined })}
        >
          <Ionicons name="add" size={28} color={COLORS.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.fabButton, styles.salesButton]}
          onPress={() => navigation.navigate("SalesHistory")}
        >
          <Ionicons name="receipt" size={24} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
  },
  listContent: {
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
    width: '100%',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    gap: 15
  },
  fabButton: {
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  salesButton: {
    backgroundColor: COLORS.accent,
  }
});

export default StoreScreen;