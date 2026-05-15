'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUserProfile } from '@/hooks/useCurrentUserProfile';
import type { UserRole } from '@/lib/user-profile';

export function useProtectedRoute(expectedRole: UserRole) {
  const router = useRouter();
  const { isLoading, user, profile } = useCurrentUserProfile();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      router.replace('/');
      return;
    }

    if (!profile) {
      // Profil pas encore chargé: ne pas casser la navigation, attendre la synchro Firestore
      return;
    }

    if (!profile.onboardingCompleted) {
      if (profile.role) {
        router.replace(`/complete-profile?role=${profile.role}`);
      }
      return;
    }

    if (profile.role !== expectedRole) {
      router.replace(profile.role === 'client' ? '/client' : '/driver');
    }
  }, [expectedRole, isLoading, profile, router, user]);

  const isAuthorized =
    Boolean(user) &&
    Boolean(profile?.onboardingCompleted) &&
    profile?.role === expectedRole;

  return {
    isLoading,
    isAuthorized,
    profile,
    user,
  };
}
