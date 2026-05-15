/**
 * Exemples d'utilisation Firebase pour Rapidoss
 * À adapter selon vos besoins
 */

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from '@firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from '@firebase/auth';
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { auth, db, storage } from './firebase';

// ============ AUTHENTIFICATION ============

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Erreur inscription:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Erreur connexion:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erreur déconnexion:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

// ============ COMMANDES (ORDERS) ============

export interface Order {
  id?: string;
  userId: string;
  driverId?: string;
  departure: string;
  destination: string;
  packageType: 'small' | 'medium';
  weight: number;
  price: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Erreur création commande:', error);
    throw error;
  }
};

export const getOrdersByUser = async (userId: string) => {
  try {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    throw error;
  }
};

export const getOrdersByDriver = async (driverId: string) => {
  try {
    const q = query(collection(db, 'orders'), where('driverId', '==', driverId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  } catch (error) {
    console.error('Erreur récupération commandes livreur:', error);
    throw error;
  }
};

export const subscribeToOrders = (userId: string, callback: (orders: Order[]) => void) => {
  const q = query(collection(db, 'orders'), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
    callback(orders);
  });
};

export const updateOrder = async (orderId: string, updates: Partial<Order>) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Erreur mise à jour commande:', error);
    throw error;
  }
};

// ============ UTILISATEURS (USERS) ============

export interface User {
  id?: string;
  email: string;
  name: string;
  phone: string;
  role: 'client' | 'driver';
  avatar?: string;
  createdAt: Date;
}

export const createUserProfile = async (userId: string, userData: Omit<User, 'id' | 'createdAt'>) => {
  try {
    await addDoc(collection(db, 'users'), {
      uid: userId,
      ...userData,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Erreur création profil:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const q = query(collection(db, 'users'), where('uid', '==', userId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    return {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data(),
    } as User;
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    throw error;
  }
};

// ============ STOCKAGE (STORAGE) ============

export const uploadProfileImage = async (userId: string, file: File) => {
  try {
    const storageRef = ref(storage, `profiles/${userId}/avatar`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Erreur upload image:', error);
    throw error;
  }
};

export const uploadDeliveryProof = async (orderId: string, file: File) => {
  try {
    const storageRef = ref(storage, `deliveries/${orderId}/proof`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Erreur upload preuve livraison:', error);
    throw error;
  }
};
