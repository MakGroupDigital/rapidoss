import { useState } from 'react';
import { app, auth, db, storage } from '@/lib/firebase';

export function useFirebase() {
  const [isInitialized] = useState(typeof window !== 'undefined');

  return {
    isInitialized,
    app,
    auth,
    db,
    storage,
  };
}
