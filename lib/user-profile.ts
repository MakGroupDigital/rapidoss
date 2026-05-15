'use client';

import {
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from '@firebase/auth';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, type DocumentData, type Unsubscribe } from '@firebase/firestore';
import { auth, db } from '@/lib/firebase';

export type UserRole = 'client' | 'driver';

export type UserProfile = {
  uid: string;
  email: string;
  fullName: string;
  photoURL: string;
  role: UserRole | null;
  phone: string;
  location: {
    lat: number;
    lng: number;
  } | null;
  locationLabel: string;
  onboardingCompleted: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export type ProfileLoadResult = {
  profile: UserProfile;
  isOffline: boolean;
};

const USER_PROFILE_STORAGE_KEY = 'rapidoss:user-profile:';
export const PENDING_ROLE_STORAGE_KEY = 'rapidoss:pending-role';

function isOfflineError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error.code === 'unavailable' || error.code === 'failed-precondition')
  );
}

function mapProfile(uid: string, data: DocumentData | undefined, user?: User | null): UserProfile {
  return {
    uid,
    email: data?.email ?? user?.email ?? '',
    fullName: data?.fullName ?? user?.displayName ?? 'Utilisateur Rapidoss',
    photoURL: data?.photoURL ?? user?.photoURL ?? '',
    role: data?.role ?? null,
    phone: data?.phone ?? '',
    location: data?.location ?? null,
    locationLabel: data?.locationLabel ?? '',
    onboardingCompleted: Boolean(data?.onboardingCompleted),
    createdAt: data?.createdAt,
    updatedAt: data?.updatedAt,
  };
}

function getProfileStorageKey(uid: string) {
  return `${USER_PROFILE_STORAGE_KEY}${uid}`;
}

function readCachedProfile(uid: string, user?: User | null) {
  if (typeof window === 'undefined') {
    return null;
  }

  const cachedValue = window.localStorage.getItem(getProfileStorageKey(uid));

  if (!cachedValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(cachedValue) as Partial<UserProfile>;
    return mapProfile(uid, parsed, user);
  } catch {
    return mapProfile(uid, undefined, user);
  }
}

function cacheProfile(profile: UserProfile) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(getProfileStorageKey(profile.uid), JSON.stringify(profile));
}

function clearCachedProfile(uid: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(getProfileStorageKey(uid));
}

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { result, mode: 'popup' as const };
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request')
    ) {
      await signInWithRedirect(auth, googleProvider);
      return { result: null, mode: 'redirect' as const };
    }

    throw error;
  }
}

export async function resolveGoogleRedirect() {
  try {
    return await getRedirectResult(auth);
  } catch {
    return null;
  }
}

export async function logout() {
  const currentUid = auth.currentUser?.uid;
  if (currentUid) {
    clearCachedProfile(currentUid);
  }
  return signOut(auth);
}

export function observeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(uid: string, user?: User | null): Promise<ProfileLoadResult> {
  try {
    const snapshot = await getDoc(doc(db, 'users', uid));
    const profile = snapshot.exists() ? mapProfile(uid, snapshot.data(), user) : mapProfile(uid, undefined, user);
    cacheProfile(profile);
    return {
      profile,
      isOffline: false,
    };
  } catch (error) {
    if (isOfflineError(error)) {
      const cachedProfile = readCachedProfile(uid, user);
      return {
        profile: cachedProfile ?? mapProfile(uid, undefined, user),
        isOffline: true,
      };
    }
    throw error;
  }
}

export function subscribeToUserProfile(
  uid: string,
  callback: (profile: UserProfile) => void,
  user?: User | null,
): Unsubscribe {
  return onSnapshot(
    doc(db, 'users', uid),
    (snapshot) => {
      const profile = snapshot.exists() ? mapProfile(uid, snapshot.data(), user) : mapProfile(uid, undefined, user);
      cacheProfile(profile);
      callback(profile);
    },
    () => {
      callback(readCachedProfile(uid, user) ?? mapProfile(uid, undefined, user));
    },
  );
}

export async function upsertUserProfile(
  user: User,
  payload: {
    role: UserRole;
    phone: string;
    location: { lat: number; lng: number };
    locationLabel: string;
  },
) {
  const userRef = doc(db, 'users', user.uid);
  let existingCreatedAt: unknown = undefined;

  try {
    const existingSnapshot = await getDoc(userRef);
    existingCreatedAt = existingSnapshot.exists() ? existingSnapshot.data().createdAt : undefined;
  } catch (error) {
    if (!isOfflineError(error)) {
      throw error;
    }
  }

  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email ?? '',
      fullName: user.displayName ?? 'Utilisateur Rapidoss',
      photoURL: user.photoURL ?? '',
      role: payload.role,
      phone: payload.phone,
      location: payload.location,
      locationLabel: payload.locationLabel,
      onboardingCompleted: true,
      updatedAt: serverTimestamp(),
      createdAt: existingCreatedAt ?? serverTimestamp(),
    },
    { merge: true },
  );

  cacheProfile({
    uid: user.uid,
    email: user.email ?? '',
    fullName: user.displayName ?? 'Utilisateur Rapidoss',
    photoURL: user.photoURL ?? '',
    role: payload.role,
    phone: payload.phone,
    location: payload.location,
    locationLabel: payload.locationLabel,
    onboardingCompleted: true,
    createdAt: existingCreatedAt,
    updatedAt: new Date().toISOString(),
  });
}
