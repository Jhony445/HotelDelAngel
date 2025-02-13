import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/navigationTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SaleModal from "../../components/ComponentsStore/SaleModal";
import Ionicons from "react-native-vector-icons/Ionicons";

const COLORS = {
    primary: '#2e7d32',
    secondary: '#388e3c',
    background: '#f5f5f5',
    textDark: '#1b5e20',
    textLight: '#ffffff',
    error: '#d32f2f',
    accent: '#c8e6c9'
};

type ProductDetailRouteProp = RouteProp<RootStackParamList, "ProductDetail">;

const ProductDetailScreen: React.FC<{ route: ProductDetailRouteProp }> = ({ route }) => {
    const { productId } = route.params;
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [modalVisible, setModalVisible] = useState(false);

    const product = {
        id: productId,
        name: "Refresco",
        price: 15,
        stock: 10,
        description: "Bebida gaseosa de 500ml",
        image: 'https://via.placeholder.com/300'
    };

    return (
        <ScrollView style={styles.container}>
             {/**<Image source={{ uri: product.image }} style={styles.productImage} />*/}
            <View style={styles.detailsContainer}>
                <Text style={styles.productName}>{product.name}</Text>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Precio:</Text>
                        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Stock disponible:</Text>
                        <View style={[styles.stockBadge, { backgroundColor: product.stock <= 5 ? COLORS.error : COLORS.primary }]}>
                            <Text style={styles.stockText}>{product.stock} unidades</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.description}>{product.description}</Text>
            </View>

            <View style={styles.buttonGroup}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.buttonText}>Registrar Venta</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: COLORS.secondary }]}
                    onPress={() => navigation.navigate('AddEditProduct', { product })}
                >
                    <Text style={styles.buttonText}>Editar Producto</Text>
                </TouchableOpacity>
            </View>

            <SaleModal visible={modalVisible} onClose={() => setModalVisible(false)} product={product} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 1,
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    /**   
    productImage: {
      width: '100%',
      height: 300,
      resizeMode: 'cover',
    }, */
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
        gap: 16,
    },
    actionButton: {
        borderRadius: 10,
        paddingVertical: 16,
        alignItems: 'center',
        elevation: 2,
    },
    buttonText: {
        color: COLORS.textLight,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProductDetailScreen;