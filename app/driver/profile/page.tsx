'use client';

import BottomNav from '@/components/BottomNav';
import { IcoUser, IcoBike, IcoShield, IcoPhone, IcoLogout } from '@/components/Icons';

const driverProfile = {
  name: 'Jean Mukendi',
  phone: '+243 812 345 678',
  vehicle: 'Moto Yamaha',
  license: 'DRV-2024-1234',
  rating: 4.8,
  trips: 342,
  since: 'Janvier 2024',
};

export default function DriverProfilePage() {
  return (
    <main className="min-h-screen bg-[#121212] pb-28 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#29BA1F22,transparent_35%),linear-gradient(180deg,#0B2928_0%,#0B0B0B_65%)] pointer-events-none" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#29BA1F]/80">Livreur</p>
            <h1 className="text-3xl font-black">Mon profil</h1>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#29BA1F]/15 text-[#29BA1F] border border-[#29BA1F]/25">
            <IcoUser size={24} />
          </div>
        </div>

        {/* Carte profil */}
        <div
          className="rounded-3xl p-6 backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(18,18,18,0.98) 100%)',
            border: '1px solid rgba(41,186,31,0.18)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(41,186,31,0.08)',
          }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#29BA1F]/15 text-[#29BA1F] border-2 border-[#29BA1F]/30">
              <IcoUser size={32} />
            </div>
            <div>
              <p className="text-2xl font-bold">{driverProfile.name}</p>
              <p className="text-sm text-white/60">Membre depuis {driverProfile.since}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl bg-[#29BA1F]/10 p-3 border border-[#29BA1F]/20">
              <p className="text-xs text-white/60 mb-1">Note moyenne</p>
              <p className="text-2xl font-bold text-[#29BA1F]">{driverProfile.rating}</p>
            </div>
            <div className="rounded-xl bg-[#29BA1F]/10 p-3 border border-[#29BA1F]/20">
              <p className="text-xs text-white/60 mb-1">Courses totales</p>
              <p className="text-2xl font-bold text-[#29BA1F]">{driverProfile.trips}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <IcoPhone size={20} />
              <div>
                <p className="text-xs text-white/60">Téléphone</p>
                <p className="text-sm font-semibold">{driverProfile.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <IcoBike size={20} />
              <div>
                <p className="text-xs text-white/60">Véhicule</p>
                <p className="text-sm font-semibold">{driverProfile.vehicle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <IcoShield size={20} />
              <div>
                <p className="text-xs text-white/60">Licence</p>
                <p className="text-sm font-semibold">{driverProfile.license}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            className="w-full rounded-2xl p-4 backdrop-blur-xl flex items-center justify-between"
            style={{
              background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(18,18,18,0.98) 100%)',
              border: '1px solid rgba(41,186,31,0.18)',
            }}
          >
            <span className="font-semibold">Modifier le profil</span>
            <span className="text-[#29BA1F]">→</span>
          </button>

          <button
            className="w-full rounded-2xl p-4 backdrop-blur-xl flex items-center justify-center gap-2 text-red-400"
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
