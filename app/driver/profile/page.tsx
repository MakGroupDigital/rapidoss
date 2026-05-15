'use client';

import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { IcoUser, IcoBike, IcoShield, IcoPhone, IcoLogout, IcoPin } from '@/components/Icons';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { logout } from '@/lib/user-profile';

export default function DriverProfilePage() {
  const router = useRouter();
  const { isLoading, isAuthorized, profile } = useProtectedRoute('driver');

  if (isLoading || !isAuthorized) {
    return <div className="min-h-screen bg-[#121212]" />;
  }

  const name = profile?.fullName ?? 'Livreur Rapidoss';
  const phone = profile?.phone ?? '+243 812 345 678';
  const since = profile?.onboardingCompleted ? 'Compte activé' : 'Configuration requise';
  const photoURL = profile?.photoURL ?? '';
  const location = profile?.locationLabel ?? 'Kinshasa, RDC';

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <main className="min-h-screen bg-[#121212] pb-28 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#29BA1F22,transparent_35%),linear-gradient(180deg,#0B2928_0%,#0B0B0B_65%)]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#29BA1F]/80">Livreur</p>
            <h1 className="text-3xl font-black">Mon profil</h1>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#29BA1F]/25 bg-[#29BA1F]/15 text-[#29BA1F]">
            <IcoUser size={24} />
          </div>
        </div>

        <div
          className="rounded-3xl p-6 backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(18,18,18,0.98) 100%)',
            border: '1px solid rgba(41,186,31,0.18)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(41,186,31,0.08)',
          }}
        >
          <div className="mb-6 flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#29BA1F]/30 bg-[#29BA1F]/15 bg-cover bg-center text-[#29BA1F]"
              style={{ backgroundImage: photoURL ? `url(${photoURL})` : undefined }}
            >
              {!photoURL ? <IcoUser size={32} /> : null}
            </div>
            <div>
              <p className="text-2xl font-bold">{name}</p>
              <p className="text-sm text-white/60">{since}</p>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#29BA1F]/20 bg-[#29BA1F]/10 p-3">
              <p className="mb-1 text-xs text-white/60">Statut</p>
              <p className="text-2xl font-bold text-[#29BA1F]">{profile?.onboardingCompleted ? 'OK' : '...'}</p>
            </div>
            <div className="rounded-xl border border-[#29BA1F]/20 bg-[#29BA1F]/10 p-3">
              <p className="mb-1 text-xs text-white/60">Rôle</p>
              <p className="text-2xl font-bold text-[#29BA1F]">Driver</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <IcoPhone size={20} />
              <div>
                <p className="text-xs text-white/60">Téléphone</p>
                <p className="text-sm font-semibold">{phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <IcoPin size={20} />
              <div>
                <p className="text-xs text-white/60">Position enregistrée</p>
                <p className="text-sm font-semibold">{location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <IcoShield size={20} />
              <div>
                <p className="text-xs text-white/60">Connexion</p>
                <p className="text-sm font-semibold">Google synchronisé</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <IcoBike size={20} />
              <div>
                <p className="text-xs text-white/60">Type de compte</p>
                <p className="text-sm font-semibold">Livreur Rapidoss</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            className="flex w-full items-center justify-between rounded-2xl p-4 backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(18,18,18,0.98) 100%)',
              border: '1px solid rgba(41,186,31,0.18)',
            }}
          >
            <span className="font-semibold">Compte synchronisé avec Firestore</span>
            <span className="text-[#29BA1F]">→</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl p-4 text-red-400 backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(18,18,18,0.98) 100%)',
              border: '1px solid rgba(239,68,68,0.18)',
            }}
          >
            <IcoLogout size={20} />
            <span className="font-semibold">Déconnexion</span>
          </button>
        </div>
      </section>

      <BottomNav role="driver" />
    </main>
  );
}
