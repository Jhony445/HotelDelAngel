import React, { useState } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput , Alert} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Product, createSale } from "../../services/StoreServices/ProductService";

const COLORS = {
  primary: '#2e7d32',
  background: '#f5f5f5',
  textDark: '#1b5e20',
  textLight: '#ffffff',
  error: '#d32f2f',
  accent: '#c8e6c9'
};

type SaleModalProps = {
  visible: boolean;
  onClose: () => void;
  product: Product;
  onSaleSuccess: (quantitySold: number) => void;
};

const SaleModal: React.FC<SaleModalProps> = ({ 
  visible, 
  onClose, 
  product,
  onSaleSuccess
}) => {
  const [quantity, setQuantity] = useState("1");

  const handleQuantityChange = (value: string) => {
    if (/^\d*$/.test(value) && value !== "") {
      setQuantity(value);
    }
  };

  const calculateTotal = () => {
    return (product.price * Number(quantity)).toFixed(2);
  };

  const adjustQuantity = (operation: 'add' | 'subtract') => {
    const current = parseInt(quantity) || 0;
    const newValue = operation === 'add' ? current + 1 : Math.max(0, current - 1);
    setQuantity(newValue.toString());
  };

  const handleConfirmSale = async () => {
    const quantityNumber = Number(quantity);
    
    if (quantityNumber > 0 && quantityNumber <= product.stock) {
      try {
        // Registrar la venta
        await createSale({
          productId: product.id,
          productName: product.name,
          quantity: quantityNumber,
          total: product.price * quantityNumber
        });
        
        onSaleSuccess(quantityNumber);
        onClose();
      } catch (error) {
        Alert.alert("Error", "No se pudo registrar la venta");
      }
    } else {
      Alert.alert("Error", "Cantidad inválida o excede el stock disponible");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.textDark} />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Registrar Venta</Text>
          
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.price}>Precio unitario: ${product.price.toFixed(2)}</Text>
          </View>

          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Cantidad:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => adjustQuantity('subtract')}
              >
                <Ionicons name="remove" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.quantityInput}
                value={quantity}
                onChangeText={handleQuantityChange}
                keyboardType="numeric"
                selectTextOnFocus
              />
              
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => adjustQuantity('add')}
              >
                <Ionicons name="add" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>${calculateTotal()}</Text>
          </View>

          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={handleConfirmSale}
          >
            <Text style={styles.confirmButtonText}>Confirmar Venta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 16,
    padding: 24,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  productInfo: {
    marginBottom: 24,
    alignItems: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#616161',
  },
  quantityContainer: {
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  quantityButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityInput: {
    borderWidth: 2,
    borderColor: COLORS.accent,
    borderRadius: 8,
    width: 80,
    height: 45,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SaleModal;