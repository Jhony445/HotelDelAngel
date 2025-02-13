import React from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/navigationTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";

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

    const sales = [
        { id: "1", product: "Refresco", quantity: 2, total: 30, date: "2024-03-15 14:30" },
        { id: "2", product: "Agua Mineral", quantity: 1, total: 10, date: "2024-03-15 12:45" },
    ];

    const SaleHistoryItem = ({ item }: { item: typeof sales[0] }) => (
        <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.productName}>{item.product}</Text>
                <Text style={styles.total}>${item.total.toFixed(2)}</Text>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                    <Ionicons name="pricetag" size={16} color={COLORS.primary} />
                    <Text style={styles.detailText}>{item.quantity} unidades</Text>
                </View>

                <View style={styles.detailItem}>
                    <Ionicons name="calendar" size={16} color={COLORS.primary} />
                    <Text style={styles.detailText}>{item.date}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

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