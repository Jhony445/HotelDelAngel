import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const COLORS = {
  primary: '#2e7d32',
  secondary: '#388e3c',
  background: '#f5f5f5',
  textDark: '#1b5e20',
  textLight: '#ffffff',
  accent: '#c8e6c9'
};

interface ProductListItemProps {
  product: { id: string; name: string; price: number; stock: number };
  onPress?: () => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product, onPress }) => {
  const stockStatusColor = product.stock <= 5 ? '#d32f2f' : COLORS.primary;

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <View style={[styles.stockBadge, { backgroundColor: stockStatusColor }]}>
              <Text style={styles.stockText}>{product.stock} disponibles</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.iconContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: stockStatusColor }]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  stockBadge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  stockText: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '500',
  },
  iconContainer: {
    paddingLeft: 10,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default ProductListItem;