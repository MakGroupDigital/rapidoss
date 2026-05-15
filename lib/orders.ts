'use client';

import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  updateDoc,
  where,
  type Unsubscribe,
} from '@firebase/firestore';
import { db } from '@/lib/firebase';
import type { OrderDocumentType } from '@/lib/order-document';

export type OrderStatus = 'confirmed' | 'driver_assigned' | 'picked_up' | 'completed';

export type DeliveryOrder = {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverPlate: string;
  departure: string;
  destination: string;
  departureCoords: { lat: number; lng: number };
  destinationCoords: { lat: number; lng: number };
  stops: string[];
  weight: number;
  packageSize?: 'small' | 'medium' | 'large';
  instructions: string;
  paymentMethod: 'mobile' | 'cash';
  price: number;
  distanceKm: number;
  etaMinutes: number;
  status: OrderStatus;
  documentType?: OrderDocumentType;
  documentNumber?: string;
  documentImageUrl?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

type CreateOrderInput = Omit<DeliveryOrder, 'id' | 'createdAt' | 'updatedAt' | 'status'>;

function sortOrdersByCreatedAt(orders: DeliveryOrder[]) {
  return [...orders].sort((a, b) => {
    const aTime = typeof a.createdAt === 'object' && a.createdAt && 'seconds' in a.createdAt ? Number(a.createdAt.seconds) : 0;
    const bTime = typeof b.createdAt === 'object' && b.createdAt && 'seconds' in b.createdAt ? Number(b.createdAt.seconds) : 0;
    return bTime - aTime;
  });
}

export async function createDeliveryOrder(payload: CreateOrderInput) {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...payload,
    status: 'confirmed' satisfies OrderStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export function subscribeToOrder(orderId: string, callback: (order: DeliveryOrder | null) => void): Unsubscribe {
  return onSnapshot(doc(db, 'orders', orderId), (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }

    callback({
      id: snapshot.id,
      ...(snapshot.data() as Omit<DeliveryOrder, 'id'>),
    });
  });
}

export async function updateDeliveryOrderStatus(orderId: string, status: OrderStatus) {
  await updateDoc(doc(db, 'orders', orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToUserOrders(userId: string, callback: (orders: DeliveryOrder[]) => void): Unsubscribe {
  const q = query(collection(db, 'orders'), where('userId', '==', userId));

  return onSnapshot(q, (snapshot) => {
    callback(sortOrdersByCreatedAt(snapshot.docs.map((orderDoc) => ({
        id: orderDoc.id,
        ...(orderDoc.data() as Omit<DeliveryOrder, 'id'>),
      }))));
  });
}

export function subscribeToDriverOrders(
  driverId: string,
  driverName: string,
  callback: (orders: DeliveryOrder[]) => void,
): Unsubscribe {
  const ordersById = new Map<string, DeliveryOrder>();
  const ordersByName = new Map<string, DeliveryOrder>();

  const emit = () => {
    callback(sortOrdersByCreatedAt([...new Map([...ordersByName, ...ordersById]).values()]));
  };

  const subscriptions: Unsubscribe[] = [
    onSnapshot(query(collection(db, 'orders'), where('driverId', '==', driverId)), (snapshot) => {
      ordersById.clear();
      snapshot.docs.forEach((orderDoc) => {
        ordersById.set(orderDoc.id, {
          id: orderDoc.id,
          ...(orderDoc.data() as Omit<DeliveryOrder, 'id'>),
        });
      });
      emit();
    }),
  ];

  if (driverName.trim()) {
    subscriptions.push(
      onSnapshot(query(collection(db, 'orders'), where('driverName', '==', driverName)), (snapshot) => {
        ordersByName.clear();
        snapshot.docs.forEach((orderDoc) => {
          if (ordersById.has(orderDoc.id)) {
            return;
          }

          ordersByName.set(orderDoc.id, {
            id: orderDoc.id,
            ...(orderDoc.data() as Omit<DeliveryOrder, 'id'>),
          });
        });
        emit();
      }),
    );
  }

  return () => subscriptions.forEach((unsubscribe) => unsubscribe());
}

export function subscribeToCompletedDriverOrders(
  driverId: string,
  driverName: string,
  callback: (orders: DeliveryOrder[]) => void,
): Unsubscribe {
  return subscribeToDriverOrders(driverId, driverName, (orders) => {
    callback(orders.filter((order) => order.status === 'completed'));
  });
}
