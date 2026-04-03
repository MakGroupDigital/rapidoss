# 🔥 Configuration Firebase - Rapidoss

Firebase est intégré à Rapidoss pour gérer :
- ✅ Authentification (Auth)
- ✅ Base de données (Firestore)
- ✅ Stockage de fichiers (Storage)
- ✅ Analytics

## 📦 Installation

Firebase est déjà configuré. Les fichiers clés sont :

```
lib/firebase.ts          # Configuration Firebase
hooks/useFirebase.ts     # Hook personnalisé
.env.local              # Variables d'environnement
```

## 🔑 Variables d'environnement

Les variables Firebase sont stockées dans `.env.local` :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCOtudanK46pl0ioOHcO3_T9fk419c5lzg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=rapidoss.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=rapidoss
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=rapidoss.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=410314367811
NEXT_PUBLIC_FIREBASE_APP_ID=1:410314367811:web:ad91c270b8b7e9f74e85f6
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-Z4ZE87R4YD
```

## 🚀 Utilisation

### Importer Firebase

```typescript
import { auth, db, storage } from '@/lib/firebase';
```

### Utiliser le hook

```typescript
import { useFirebase } from '@/hooks/useFirebase';

export default function MyComponent() {
  const { isInitialized, auth, db } = useFirebase();
  
  if (!isInitialized) return <div>Chargement...</div>;
  
  // Utiliser auth, db, storage...
}
```

## 🔐 Authentification

### Créer un utilisateur

```typescript
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### Se connecter

```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';

const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### Écouter l'authentification

```typescript
import { onAuthStateChanged } from 'firebase/auth';

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('Utilisateur connecté:', user.email);
    } else {
      console.log('Utilisateur déconnecté');
    }
  });
  
  return unsubscribe;
}, []);
```

## 📊 Firestore (Base de données)

### Ajouter un document

```typescript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const addOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), orderData);
    return docRef.id;
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### Lire des documents

```typescript
import { collection, getDocs, query, where } from 'firebase/firestore';

const getOrders = async (userId: string) => {
  try {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### Écouter les changements en temps réel

```typescript
import { onSnapshot } from 'firebase/firestore';

useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setOrders(orders);
  });
  
  return unsubscribe;
}, []);
```

## 📁 Storage (Stockage de fichiers)

### Uploader un fichier

```typescript
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const uploadFile = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return snapshot.ref.fullPath;
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### Télécharger un fichier

```typescript
import { ref, getBytes } from 'firebase/storage';

const downloadFile = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    const bytes = await getBytes(storageRef);
    return bytes;
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

## 📈 Analytics

Analytics est automatiquement initialisé et envoie des événements.

### Envoyer un événement personnalisé

```typescript
import { logEvent } from 'firebase/analytics';
import { analytics } from '@/lib/firebase';

logEvent(analytics, 'order_created', {
  order_id: '12345',
  amount: 5000,
  currency: 'FC'
});
```

## 🔒 Sécurité

### Règles Firestore (à configurer dans Firebase Console)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Utilisateurs
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Commandes
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.userId || request.auth.uid == resource.data.driverId;
      allow create: if request.auth.uid == request.resource.data.userId;
      allow update: if request.auth.uid == resource.data.userId || request.auth.uid == resource.data.driverId;
    }
  }
}
```

## 🚀 Déploiement sur Vercel

1. Allez dans Vercel Dashboard
2. Allez dans Settings > Environment Variables
3. Ajoutez les variables Firebase :
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

4. Redéployez l'application

## 📚 Documentation

- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Firebase Storage](https://firebase.google.com/docs/storage)

## 🆘 Troubleshooting

**Firebase n'est pas initialisé ?**
- Vérifiez que `.env.local` existe et contient les bonnes clés
- Vérifiez que vous êtes côté client (utilisez `'use client'`)

**Erreur d'authentification ?**
- Vérifiez les règles de sécurité dans Firebase Console
- Vérifiez que l'utilisateur existe

**Firestore ne retourne rien ?**
- Vérifiez que la collection existe
- Vérifiez les règles de sécurité
- Vérifiez la requête avec la console Firebase

---

Firebase est maintenant prêt à être utilisé ! 🎉
