import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/navigationTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getSales, Sale } from "../../services/StoreServices/ProductService";

const COLORS = {
    primary: '#2e7d32',
    secondary: '#388e3c',
    background: '#f5f5f5',
    textDark: '#1b5e20',
    textLight: '#ffffff',
    accent: '#c8e6c9',
    error: '#d32f2f'
};

const SalesHistoryScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadSales = async () => {
        try {
            setLoading(true);
            const salesData = await getSales();
            setSales(salesData);
            setError(null);
        } catch (err) {
            setError("Error al cargar el historial");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadSales();
        }, [])
    );


    const SaleHistoryItem = ({ item }: { item: Sale }) => (
        <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.productName}>{item.productName}</Text>
                <Text style={styles.total}>${item.total.toFixed(2)}</Text>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                    <Ionicons name="pricetag" size={16} color={COLORS.primary} />
                    <Text style={styles.detailText}>{item.quantity} unidades</Text>
                </View>

                <View style={styles.detailItem}>
                    <Ionicons name="calendar" size={16} color={COLORS.primary} />
                    <Text style={styles.detailText}>
                        {item.date.toLocaleDateString('es-MX', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
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
                <Ionicons name="alert-circle" size={48} color={COLORS.error} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={loadSales} style={styles.retryButton}>
                    <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={sales}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <SaleHistoryItem item={item} />}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="receipt-outline" size={48} color={COLORS.primary} />
                        <Text style={styles.emptyText}>No hay ventas registradas</Text>
                    </View>
                }
            />
        </View>
    );
};


const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }, errorContainer: {
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
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: 16,
    },
    listContent: {
        paddingBottom: 20,
        paddingTop: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textDark,
        flex: 1,
        marginRight: 10,
    },
    total: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primary,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 14,
        color: '#616161',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.primary,
        marginTop: 16,
        textAlign: 'center',
    },
});

export default SalesHistoryScreen;