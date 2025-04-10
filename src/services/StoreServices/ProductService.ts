import { db } from "./firebaseConfigStore";
import {
    addDoc,
    collection,
    doc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    query,
    where,
    serverTimestamp,
    orderBy
} from "firebase/firestore";

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
    status: 'active' | 'archived';
}

export interface Sale {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    total: number;
    date: Date;
}


const PRODUCTS_COLLECTION = "products";
const SALES_COLLECTION = "sales";

export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    try {
        const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
            ...productData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            status: 'active'
        });

        return { id: docRef.id, ...productData };
    } catch (error) {
        console.error("Error creating product: ", error);
        throw error;
    }
};

export const updateProduct = async (productId: string, productData: Partial<Product>) => {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, productId);
        await updateDoc(docRef, {
            ...productData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating product: ", error);
        throw error;
    }
};

export const getProducts = async (): Promise<Product[]> => {
    try {
        const q = query(
            collection(db, PRODUCTS_COLLECTION),
            where("status", "==", "active")
        );

        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            price: doc.data().price,
            stock: doc.data().stock,
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
            status: doc.data().status
        } as Product));
    } catch (error) {
        console.error("Error getting products: ", error);
        throw error;
    }
};

export const getProductById = async (productId: string): Promise<Product | null> => {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
                status: data.status
            };
        }
        return null;
    } catch (error) {
        console.error("Error getting product: ", error);
        throw error;
    }
};

export const getAllProducts = async (): Promise<Product[]> => {
    try {
        const q = query(
            collection(db, PRODUCTS_COLLECTION),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            price: doc.data().price,
            stock: doc.data().stock,
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
            status: doc.data().status
        } as Product));
    } catch (error) {
        console.error("Error getting all products: ", error);
        throw error;
    }
};

export const createSale = async (saleData: Omit<Sale, 'id' | 'date'>) => {
    try {
        const docRef = await addDoc(collection(db, SALES_COLLECTION), {
            ...saleData,
            date: serverTimestamp()
        });
        return { id: docRef.id, ...saleData };
    } catch (error) {
        console.error("Error creating sale: ", error);
        throw error;
    }
};

export const getSales = async (): Promise<Sale[]> => {
    try {
        const q = query(
            collection(db, SALES_COLLECTION),
            orderBy('date', 'desc')
        );

        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            productId: doc.data().productId,
            productName: doc.data().productName,
            quantity: doc.data().quantity,
            total: doc.data().total,
            date: doc.data().date?.toDate()
        } as Sale));
    } catch (error) {
        console.error("Error getting sales: ", error);
        throw error;
    }

};

export const deleteProduct = async (productId: string) => {
    try {
        const productRef = doc(db, PRODUCTS_COLLECTION, productId);
        await deleteDoc(productRef);
    } catch (error) {
        console.error("Error deleting product: ", error);
        throw error;
    }
};