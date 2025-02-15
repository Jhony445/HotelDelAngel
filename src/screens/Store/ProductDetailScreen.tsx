import React, { useState, useEffect, } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  Alert
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/navigationTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SaleModal from "../../components/ComponentsStore/SaleModal";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getProductById, updateProduct, Product } from "../../services/StoreServices/ProductService";
import { useFocusEffect } from "@react-navigation/native";
import { deleteProduct } from "../../services/StoreServices/ProductService";
import { AntDesign } from '@expo/vector-icons';

const COLORS = {
  primary: '#2e7d32',
  secondary: '#388e3c',
  background: '#f5f5f5',
  textDark: '#1b5e20',
  textLight: '#ffffff',
  error: '#d32f2f',
  accent: '#c8e6c9',
  delete: '#d32f2f',
  deleteHover: '#b71c1c'
};

type ProductDetailRouteProp = RouteProp<RootStackParamList, "ProductDetail">;

const ProductDetailScreen: React.FC<{ route: ProductDetailRouteProp }> = ({ route }) => {
  const { productId } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadProduct = async () => {
        try {
          setLoading(true);
          const productData = await getProductById(productId);

          if (productData) {
            setProduct(productData);
            setError(null);
          } else {
            setError("Producto no encontrado");
          }
        } catch (err) {
          setError("Error al cargar el producto");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadProduct();
    }, [productId])
  );


  const handleSaleSuccess = async (quantitySold: number) => {
    if (!product) return;

    try {
      const newStock = product.stock - quantitySold;
      await updateProduct(product.id, { stock: newStock });
      setProduct({ ...product, stock: newStock });
      Alert.alert("Éxito", "Venta registrada correctamente");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el stock");
      console.error(error);
    }
  };

  const handleDeleteProduct = async () => {
    Alert.alert(
      "Eliminar Producto",
      "¿Estás seguro de eliminar este producto permanentemente?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              if (product) {
                await deleteProduct(product.id);
              } else {
                Alert.alert("Error", "Producto no encontrado");
              }
              Alert.alert("Éxito", "Producto eliminado correctamente");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el producto");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>{error || "Error desconocido"}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{product.name}</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Precio:</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Stock disponible:</Text>
            <View style={[styles.stockBadge, {
              backgroundColor: product.stock <= 5 ? COLORS.error : COLORS.primary
            }]}>
              <Text style={styles.stockText}>{product.stock} unidades</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>
          {product.description || "Sin descripción"}
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.actionButton, {
            backgroundColor: product.stock > 0 ? COLORS.primary : '#cccccc',
            opacity: product.stock > 0 ? 1 : 0.6
          }]}
          onPress={() => setModalVisible(true)}
          disabled={product.stock <= 0}
        >
          <Text style={styles.buttonText}>
            {product.stock > 0 ? 'Registrar Venta' : 'Sin stock'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.secondary }]}
          onPress={() => navigation.navigate('AddEditProduct', {
            product: {
              id: product.id,
              name: product.name,
              description: product.description || '',
              price: product.price,
              stock: product.stock
            }
          })}
        >
          <Text style={styles.buttonText}>Editar Producto</Text>
        </TouchableOpacity>
        {product.stock === 0 && (
          <TouchableOpacity
            style={[styles.actionButton, {
              backgroundColor: COLORS.error,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10
            }]}
            onPress={handleDeleteProduct}
          >
            <AntDesign name="delete" size={20} color="white" />
            <Text style={styles.buttonText}>Eliminar Producto</Text>
          </TouchableOpacity>
        )}
      </View>

      <SaleModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        product={product}
        onSaleSuccess={handleSaleSuccess}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 12,
    marginBottom: 20,
  },
  detailsContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#616161',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  stockBadge: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  stockText: {
    color: COLORS.textLight,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#616161',
  },
  buttonGroup: {
    padding: 20,
    gap: 14,
  },
  actionButton: {
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 2,
    width: '100%',
  },
  buttonText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailScreen;