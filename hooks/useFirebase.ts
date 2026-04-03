import { useEffect, useState } from 'react';
import { app, auth, db, storage } from '@/lib/firebase';

export function useFirebase() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Firebase est initialisé côté client
    if (typeof window !== 'undefined') {
      setIsInitialized(true);
    }
  }, []);

  return {
    isInitialized,
    app,
    auth,
    db,
    storage,
  };
}
