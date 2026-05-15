'use client';

import { useEffect, useState } from 'react';
import { type User } from '@firebase/auth';
import { observeAuth, subscribeToUserProfile, type UserProfile } from '@/lib/user-profile';

type AuthProfileState = {
  isLoading: boolean;
  user: User | null;
  profile: UserProfile | null;
};

export function useCurrentUserProfile(): AuthProfileState {
  const [state, setState] = useState<AuthProfileState>({
    isLoading: true,
    user: null,
    profile: null,
  });

  useEffect(() => {
    let profileUnsubscribe: (() => void) | undefined;

    const authUnsubscribe = observeAuth((user) => {
      profileUnsubscribe?.();

      if (!user) {
        setState({ isLoading: false, user: null, profile: null });
        return;
      }

      setState((current) => ({ ...current, isLoading: true, user }));

      profileUnsubscribe = subscribeToUserProfile(
        user.uid,
        (profile) => {
          setState({ isLoading: false, user, profile });
        },
        user,
      );
    });

    return () => {
      profileUnsubscribe?.();
      authUnsubscribe();
    };
  }, []);

  return state;
}
