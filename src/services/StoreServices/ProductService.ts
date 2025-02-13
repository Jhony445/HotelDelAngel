import { db } from "./firebaseConfigStore";
import { 
  addDoc, 
  collection, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  serverTimestamp 
} from "firebase/firestore";

// Tipo para el producto
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'archived'; // Para borrado lógico
}

// Nombre de la colección (sugiero 'products')
const PRODUCTS_COLLECTION = "products";

// Crear producto
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