import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useNavigation, NavigationProp, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/navigationTypes";
import ProductListItem from "../components/ComponentsStore/ProductListItem";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getProducts, Product } from "../services/StoreServices/ProductService";
import SearchBar from "../components/ComponentsStore/SearchBar";
import { debounce } from "lodash";

const COLORS = {
  primary: '#2e7d32',
  primaryLight: '#e8f5e9',
  accent: '#00c853',
  textDark: '#1b5e20',
  textLight: '#ffffff',
  background: '#f5f5f5',
  error: '#d32f2f',
};

const StoreScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getProducts();
      setProducts(productsData);
      setFilteredProducts(productsData);
      setError(null);
    } catch (err) {
      setError("Error al cargar los productos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = debounce((query: string) => {
    const filtered = query
      ? products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      )
      : products;

    setFilteredProducts(filtered);
  }, 300);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
      setSearchQuery('');
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchProducts} style={styles.retryButton}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductListItem
            product={item}
            onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <Text style={styles.sectionTitle}>Productos en Inventario</Text>
            <SearchBar
              onSearch={(query) => {
                setSearchQuery(query);
                handleSearch(query);
              }}
              onClear={() => {
                setSearchQuery('');
                setFilteredProducts(products);
              }}
            />
            {searchQuery && (
              <Text style={styles.resultsText}>
                {filteredProducts.length} resultados para "{searchQuery}"
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle" size={48} color={COLORS.primary} />
            <Text style={styles.emptyText}>No se encontraron productos</Text>
          </View>
        }
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
    width: '100%',
  },
  resultsText: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  listContent: {
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
  },
  retryText: {
    color: COLORS.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  salesButton: {
    backgroundColor: COLORS.accent,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 16,
    textAlign: 'center',
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
});

export default StoreScreen;