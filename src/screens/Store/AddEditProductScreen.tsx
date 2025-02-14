import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/navigationTypes";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createProduct, updateProduct } from "../../services/StoreServices/ProductService";

type Props = NativeStackScreenProps<RootStackParamList, "AddEditProduct">;

const AddEditProductScreen: React.FC<Props> = ({ route, navigation }) => {
    const product = route.params?.product;
    const [name, setName] = useState(product?.name || "");
    const [description, setDescription] = useState(product?.description || "");
    const [price, setPrice] = useState(product?.price.toString() || "");
    const [stock, setStock] = useState(product?.stock.toString() || "");
    const [inputFocus, setInputFocus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!name.trim()) {
            Alert.alert("Error", "El nombre del producto es requerido");
            return false;
        }
        if (!price || isNaN(Number(price))) {
            Alert.alert("Error", "Precio inválido");
            return false;
        }
        if (!stock || isNaN(Number(stock))) {
            Alert.alert("Error", "Stock inválido");
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            const productData = {
                name: name.trim(),
                description: description.trim(),
                price: Number(price),
                stock: Number(stock)
            };

            if (product) {
                await updateProduct(product.id, productData);
                Alert.alert("Éxito", "Producto actualizado correctamente");
            } else {
                await createProduct(productData);
                Alert.alert("Éxito", "Producto creado correctamente");
            }

            navigation.goBack();
        } catch (error) {
            console.error("Error saving product:", error);
            Alert.alert("Error", "Ocurrió un error al guardar el producto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.screenTitle}>
                {product ? "Editar Producto" : "Nuevo Producto"}
            </Text>

            {/* Campo Nombre */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>
                    <Ionicons name="pricetag-outline" size={16} color={COLORS.primary} /> Nombre
                </Text>
                <TextInput
                    style={[styles.input, inputFocus === 'name' && styles.inputFocused]}
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setInputFocus('name')}
                    onBlur={() => setInputFocus(null)}
                    placeholder="Ej: Refresco de cola"
                />
            </View>

            {/* Campo Descripción */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>
                    <Ionicons name="document-text-outline" size={16} color={COLORS.primary} /> Descripción
                </Text>
                <TextInput
                    style={[
                        styles.input,
                        styles.multilineInput,
                        inputFocus === 'description' && styles.inputFocused
                    ]}
                    value={description}
                    onChangeText={setDescription}
                    onFocus={() => setInputFocus('description')}
                    onBlur={() => setInputFocus(null)}
                    placeholder="Descripción detallada del producto"
                    multiline
                    numberOfLines={4}
                />
            </View>

            {/* Campo Precio */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>
                    <Ionicons name="cash-outline" size={16} color={COLORS.primary} /> Precio
                </Text>
                <View style={styles.inputWithUnit}>
                    <TextInput
                        style={[styles.input, inputFocus === 'price' && styles.inputFocused]}
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="decimal-pad"
                        onFocus={() => setInputFocus('price')}
                        onBlur={() => setInputFocus(null)}
                        placeholder="0.00"
                    />
                    <Text style={styles.unitText}>$</Text>
                </View>
            </View>

            {/* Campo Stock */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>
                    <Ionicons name="cube-outline" size={16} color={COLORS.primary} /> Stock
                </Text>
                <View style={styles.inputWithUnit}>
                    <TextInput
                        style={[styles.input, inputFocus === 'stock' && styles.inputFocused]}
                        value={stock}
                        onChangeText={setStock}
                        keyboardType="number-pad"
                        onFocus={() => setInputFocus('stock')}
                        onBlur={() => setInputFocus(null)}
                        placeholder="0"
                    />
                    <Text style={styles.unitText}>unidades</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[
                    styles.saveButton,
                    loading && styles.disabledButton
                ]}
                onPress={handleSave}
                activeOpacity={0.8}
                disabled={loading}
            >
                <Text style={styles.saveButtonText}>
                    <Ionicons name="save-outline" size={18} />
                    {loading ? "Guardando..." : "Guardar Producto"}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const COLORS = {
    primary: '#2e7d32',
    secondary: '#388e3c',
    background: '#f5f5f5',
    textDark: '#1b5e20',
    textLight: '#ffffff',
    accent: '#c8e6c9',
    error: '#d32f2f'
};
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: COLORS.background,
        padding: 24,
    },
    multilineInput: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    disabledButton: {
        backgroundColor: '#a5d6a7',
        opacity: 0.7,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.textDark,
        textAlign: 'center',
        marginBottom: 30,
    },
    formGroup: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        color: COLORS.textDark,
        marginBottom: 10,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        borderWidth: 2,
        borderColor: COLORS.accent,
        color: COLORS.textDark,
    },
    inputFocused: {
        borderColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 2,
    },
    inputWithUnit: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    unitText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '500',
        marginLeft: 8,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        padding: 16,
        marginTop: 30,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    saveButtonText: {
        color: COLORS.textLight,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default AddEditProductScreen;