'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { type User } from '@firebase/auth';
import { RapidossLogo, IcoChevronRight, IcoNavigation, IcoPhone, IcoPin } from '@/components/Icons';
import { auth } from '@/lib/firebase';
import { observeAuth, PENDING_ROLE_STORAGE_KEY, upsertUserProfile, type UserRole } from '@/lib/user-profile';

type GeoState = {
  lat: number;
  lng: number;
  label: string;
};

export default function CompleteProfileClient({ role }: { role: UserRole | null }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [authResolved, setAuthResolved] = useState(Boolean(auth.currentUser));
  const [phone, setPhone] = useState('');
  const [geo, setGeo] = useState<GeoState | null>(null);
  const [geoStatus, setGeoStatus] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const unsubscribe = observeAuth((currentUser) => {
      setUser(currentUser);
      setAuthResolved(true);
      if (!currentUser) {
        const pendingRole = window.sessionStorage.getItem(PENDING_ROLE_STORAGE_KEY);
        if (pendingRole === 'client' || pendingRole === 'driver') {
          return;
        }
        router.replace('/');
      }
    });

    return unsubscribe;
  }, [router]);

  useEffect(() => {
    if (!authResolved || user) {
      return;
    }

    const pendingRole = window.sessionStorage.getItem(PENDING_ROLE_STORAGE_KEY);

    if (pendingRole !== 'client' && pendingRole !== 'driver') {
      return;
    }

    const timeout = window.setTimeout(() => {
      setError('Session Google introuvable. Reconnectez-vous puis réessayez.');
      window.sessionStorage.removeItem(PENDING_ROLE_STORAGE_KEY);
      router.replace('/');
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [authResolved, router, user]);

  useEffect(() => {
    if (!role) {
      router.replace('/');
    }
  }, [role, router]);

  const handleRequestLocation = () => {
    setError('');
    setGeoStatus('Demande de permission en cours...');

    if (!navigator.geolocation) {
      setGeoStatus('');
      setError("La géolocalisation n'est pas disponible sur cet appareil.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const latitude = Number(coords.latitude.toFixed(6));
        const longitude = Number(coords.longitude.toFixed(6));
        setGeo({
          lat: latitude,
          lng: longitude,
          label: `${latitude}, ${longitude}`,
        });
        setGeoStatus('Position récupérée avec succès.');
      },
      () => {
        setGeoStatus('');
        setError("Impossible d'accéder à votre position.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const handleSubmit = () => {
    if (!user) {
      setError('Session expirée. Reconnectez-vous.');
      return;
    }

    if (!role) {
      setError('Type de compte invalide.');
      return;
    }

    if (!phone.trim()) {
      setError('Le numéro de téléphone est obligatoire.');
      return;
    }

    if (!geo) {
      setError('La position est obligatoire.');
      return;
    }

    setError('');
    setIsRedirecting(true);

    startTransition(async () => {
      try {
        await upsertUserProfile(user, {
          role,
          phone: phone.trim(),
          location: { lat: geo.lat, lng: geo.lng },
          locationLabel: geo.label,
        });
        window.sessionStorage.removeItem(PENDING_ROLE_STORAGE_KEY);
        
        const redirectPath = role === 'client' ? '/client' : '/driver';
        
        // Redirect after a longer delay to ensure state is updated
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push(redirectPath);
      } catch (err) {
        console.error('[Profile] Error saving profile:', err);
        setIsRedirecting(false);
        setError("Impossible d'enregistrer votre profil. Vérifiez votre connexion Firestore puis réessayez.");
      }
    });
  };

  if (!authResolved) {
    return <main className="min-h-screen bg-[#121212]" />;
  }

  return (
    <main className="min-h-screen bg-[#121212] px-6 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">
        <div className="rounded-[32px] border border-[#29BA1F]/20 bg-[#151515] p-6 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between gap-4">
            <RapidossLogo size={52} />
            <div className="rounded-full border border-[#29BA1F]/20 bg-[#0B2928] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#29BA1F]">
              {role === 'driver' ? 'Livreur' : role === 'client' ? 'Client' : 'Compte'}
            </div>
          </div>

          <h1 className="mt-6 text-3xl font-black">Finaliser votre compte</h1>
          <p className="mt-2 text-sm text-[#8b8b8b]">
            Nous avons récupéré votre compte Google. Ajoutez maintenant votre numéro et votre position avant
            d&apos;entrer dans votre espace.
          </p>

          <div className="mt-6 rounded-2xl border border-[#29BA1F]/15 bg-[#0B2928]/40 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#29BA1F]">Compte Google</p>
            <div className="mt-3 flex items-center gap-3">
              <div
                className="h-14 w-14 rounded-2xl border border-white/10 bg-[#1f1f1f] bg-cover bg-center"
                style={{ backgroundImage: user?.photoURL ? `url(${user.photoURL})` : undefined }}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">{user?.displayName ?? 'Utilisateur Rapidoss'}</p>
                <p className="truncate text-xs text-[#8b8b8b]">{user?.email ?? ''}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8b8b8b]">
                <IcoPhone size={14} className="text-[#29BA1F]" />
                Téléphone
              </span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+243 8XX XXX XXX"
                className="w-full rounded-2xl border border-white/8 bg-[#1b1b1b] px-4 py-4 text-sm text-white outline-none transition placeholder:text-[#5f5f5f] focus:border-[#29BA1F]/45"
              />
            </label>

            <div className="rounded-2xl border border-white/8 bg-[#1b1b1b] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8b8b8b]">
                    <IcoPin size={14} className="text-[#29BA1F]" />
                    Position
                  </p>
                  <p className="mt-2 text-sm text-white">
                    {geo ? geo.label : 'Autorisez la position pour personnaliser votre compte.'}
                  </p>
                  {geoStatus ? <p className="mt-1 text-xs text-[#29BA1F]">{geoStatus}</p> : null}
                </div>
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  className="flex shrink-0 items-center gap-2 rounded-2xl border border-[#29BA1F]/25 bg-[#0B2928] px-4 py-3 text-xs font-bold text-[#29BA1F]"
                >
                  <IcoNavigation size={14} />
                  Autoriser
                </button>
              </div>
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

          <button
            type="button"
            disabled={isPending || isRedirecting}
            onClick={handleSubmit}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#29BA1F] to-[#098C04] px-5 py-4 text-sm font-black text-white disabled:cursor-wait disabled:opacity-70"
          >
            {isRedirecting ? 'Redirection...' : isPending ? 'Enregistrement...' : 'Continuer vers mon tableau de bord'}
            <IcoChevronRight size={16} className="text-white" />
          </button>
        </div>
      </div>
    </main>
  );
}
