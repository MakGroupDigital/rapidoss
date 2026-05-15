'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { RapidossLogo, IcoGoogle, IcoPackage, IcoBike, IcoChevronRight, IcoSparkle } from '@/components/Icons';
import { auth } from '@/lib/firebase';
import {
  getUserProfile,
  observeAuth,
  PENDING_ROLE_STORAGE_KEY,
  resolveGoogleRedirect,
  signInWithGoogle,
  type UserRole,
} from '@/lib/user-profile';

type Step = 'splash' | 'login' | 'role';

function getAuthErrorMessage(error: unknown) {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return error instanceof Error ? error.message : "Connexion Google impossible pour l'instant.";
  }

  const code = String(error.code);

  if (code === 'auth/unauthorized-domain') {
    return "Domaine non autorisé dans Firebase Auth. Ajoutez ce domaine dans Firebase Console > Authentication > Settings > Authorized domains.";
  }

  if (code === 'auth/popup-closed-by-user') {
    return 'Fenêtre Google fermée avant la fin de la connexion.';
  }

  if (code === 'auth/popup-blocked') {
    return 'Popup Google bloquée par le navigateur. Autorisez les popups ou réessayez.';
  }

  if (code === 'auth/operation-not-allowed') {
    return 'Google Sign-In n’est pas activé dans Firebase Authentication.';
  }

  if (code === 'auth/network-request-failed') {
    return 'Connexion réseau impossible. Vérifiez internet puis réessayez.';
  }

  return `${error instanceof Error ? error.message : 'Connexion Google impossible.'} (${code})`;
}

export default function Onboarding() {
  const [step, setStep] = useState<Step>('splash');
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => setStep('login'), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = observeAuth((user) => {
      if (!user) {
        return;
      }

      void (async () => {
        try {
          const { profile, isOffline } = await getUserProfile(user.uid, user);
          const pendingRole = window.sessionStorage.getItem(PENDING_ROLE_STORAGE_KEY) as UserRole | null;

          if (profile.onboardingCompleted && profile.role) {
            window.sessionStorage.removeItem(PENDING_ROLE_STORAGE_KEY);
            router.replace(profile.role === 'client' ? '/client' : '/driver');
            return;
          }

          if (pendingRole === 'client' || pendingRole === 'driver') {
            router.replace(`/complete-profile?role=${pendingRole}`);
            return;
          }

          if (isOffline) {
            setStep('role');
            return;
          }

          // Utilisateur connecté mais profil incomplet non chargé : envoyer vers le choix de rôle
          setStep('role');
        } catch (err) {
          console.error('[Auth] Error fetching profile:', err);
          setError("Impossible de vérifier votre profil pour l'instant.");
        }
      })();
    });

    return unsubscribe;
  }, [router]);

  useEffect(() => {
    const syncRedirectResult = async () => {
      const redirectResult = await resolveGoogleRedirect();

      if (!redirectResult?.user) {
        // Fallback: si la session est déjà active, continuer le flux
        if (typeof window !== 'undefined' && auth.currentUser) {
          setStep('role');
        }
        return;
      }

      const { profile, isOffline } = await getUserProfile(redirectResult.user.uid, redirectResult.user);
      const pendingRole = window.sessionStorage.getItem(PENDING_ROLE_STORAGE_KEY) as UserRole | null;

      if (profile.onboardingCompleted && profile.role) {
        window.sessionStorage.removeItem(PENDING_ROLE_STORAGE_KEY);
        router.replace(profile.role === 'client' ? '/client' : '/driver');
        return;
      }

      if (pendingRole === 'client' || pendingRole === 'driver') {
        router.replace(`/complete-profile?role=${pendingRole}`);
        return;
      }

      if (isOffline) {
        setError('Connexion Google réussie. Firestore est indisponible, vous pouvez continuer et finaliser le profil.');
      }

      setStep('role');
    };

    void syncRedirectResult();
  }, [router]);

  const handleGoogleLogin = async () => {
    setIsBusy(true);
    setError('');

    try {
      await signInWithGoogle();
      return;
    } catch (err) {
      console.error('[Auth] Google sign-in error:', err);
      setError(getAuthErrorMessage(err));
    } finally {
      setIsBusy(false);
    }
  };

  const handleRoleSelection = (role: UserRole) => {
    window.sessionStorage.setItem(PENDING_ROLE_STORAGE_KEY, role);
    router.push(`/complete-profile?role=${role}`);
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#121212] px-6">
      <div className="pointer-events-none absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#29BA1F]/8 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-56 w-56 rounded-full bg-[#0B2928]/60 blur-2xl" />

      <AnimatePresence mode="wait">
        {step === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center gap-5"
          >
            <motion.div
              animate={{ filter: ['drop-shadow(0 0 12px #29BA1F60)', 'drop-shadow(0 0 28px #29BA1F90)', 'drop-shadow(0 0 12px #29BA1F60)'] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <RapidossLogo size={88} />
            </motion.div>
            <div className="text-center">
              <h1 className="text-4xl font-black tracking-tight text-white">Rapidoss</h1>
              <p className="mt-1 text-sm text-[#525252]">Logistique à la demande</p>
            </div>
            <div className="mt-2 h-0.5 w-32 overflow-hidden rounded-full bg-[#1a1a1a]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.2, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-[#29BA1F] to-[#098C04]"
              />
            </div>
          </motion.div>
        )}

        {step === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
            className="flex w-full max-w-sm flex-col items-center"
          >
            <RapidossLogo size={64} />
            <h1 className="mt-5 text-3xl font-black tracking-tight text-white">Rapidoss</h1>
            <p className="mt-2 text-center text-sm text-[#525252]">
              La livraison à la demande,
              <br />
              simple et instantanée.
            </p>

            <div className="mt-6 flex items-center gap-2 rounded-full border border-[#29BA1F]/25 bg-[#0B2928] px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#29BA1F]" />
              <span className="text-xs font-semibold text-[#29BA1F]">24 livreurs actifs à Kinshasa</span>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleGoogleLogin}
              disabled={isBusy}
              className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 font-bold text-[#121212] shadow-lg shadow-black/30 transition hover:bg-gray-50 disabled:cursor-wait disabled:opacity-70"
            >
              <IcoGoogle size={20} />
              {isBusy ? 'Connexion en cours...' : 'Continuer avec Google'}
            </motion.button>

            {error ? <p className="mt-4 text-center text-xs text-red-400">{error}</p> : null}

            <p className="mt-5 text-center text-[11px] text-[#525252]">
              En continuant, vous acceptez nos conditions d&apos;utilisation
            </p>
          </motion.div>
        )}

        {step === 'role' && (
          <motion.div
            key="role"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
            className="flex w-full max-w-sm flex-col items-center"
          >
            <RapidossLogo size={52} />
            <h2 className="mt-5 text-center text-2xl font-black text-white">Choisissez votre profil</h2>
            <p className="mt-1 text-center text-sm text-[#525252]">Comment souhaitez-vous utiliser Rapidoss ?</p>

            <div className="mt-8 w-full space-y-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleRoleSelection('client')}
                className="w-full rounded-2xl bg-gradient-to-r from-[#29BA1F] to-[#098C04] p-5 text-left shadow-lg shadow-[#29BA1F]/25 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <IcoPackage size={22} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-black text-white">Je suis Client</p>
                    <p className="mt-0.5 text-xs text-white/70">Commander une livraison</p>
                  </div>
                  <IcoChevronRight size={18} className="text-white/60" />
                </div>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleRoleSelection('driver')}
                className="w-full rounded-2xl border border-[#29BA1F]/25 bg-[#1a1a1a] p-5 text-left transition hover:border-[#29BA1F]/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[#29BA1F]/20 bg-[#0B2928]">
                    <IcoBike size={22} className="text-[#29BA1F]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-black text-white">Je suis Livreur</p>
                    <p className="mt-0.5 text-xs text-[#525252]">Accepter des courses</p>
                  </div>
                  <IcoChevronRight size={18} className="text-[#525252]" />
                </div>
              </motion.button>
            </div>

            <div className="mt-8 flex items-center gap-2 text-[11px] text-[#525252]">
              <IcoSparkle size={12} className="text-[#29BA1F]" />
              Disponible 24h/24 · 7j/7 à Kinshasa
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
