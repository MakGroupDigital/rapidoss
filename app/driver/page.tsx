'use client';

import { motion } from 'motion/react';
import { Bike, Clock3, MapPin, Power, ShieldCheck, Wallet } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const offers = [
  { id: 'OFF-2001', pickup: 'Gombe', dropoff: 'Lingwala', price: '3,500 FC', eta: '8 min' },
  { id: 'OFF-2002', pickup: 'Limete', dropoff: 'Bandalungwa', price: '5,000 FC', eta: '12 min' },
  { id: 'OFF-2003', pickup: 'Ngaliema', dropoff: 'Kintambo', price: '4,200 FC', eta: '10 min' },
];

export default function DriverPage() {
  return (
    <main className="min-h-screen bg-[#121212] pb-28 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#29BA1F22,transparent_35%),linear-gradient(180deg,#0B2928_0%,#0B0B0B_65%)] pointer-events-none" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#29BA1F]/80">Mode livreur</p>
            <h1 className="text-3xl font-black">Tableau de bord</h1>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#29BA1F]/15 text-[#29BA1F] border border-[#29BA1F]/25">
            <Bike size={24} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Statut" value="En ligne" icon={<Power size={18} />} accent="#29BA1F" />
          <StatCard title="Gains du jour" value="12,500 FC" icon={<Wallet size={18} />} accent="#FACC15" />
          <StatCard title="Courses" value="5 en attente" icon={<ShieldCheck size={18} />} accent="#38BDF8" />
        </div>

        {/* Offres */}
        <div className="rounded-3xl bg-[#0f1717] border border-[#29BA1F]/15 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#29BA1F]/10">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#29BA1F]/80">Offres disponibles</p>
              <h2 className="text-xl font-bold text-white">Choisis ta prochaine course</h2>
            </div>
            <div className="rounded-full bg-[#29BA1F]/15 px-3 py-1 text-xs font-semibold text-[#29BA1F]">
              Mise à jour en temps réel
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {offers.map((offer, idx) => (
              <motion.article
                key={offer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.25, ease: 'easeOut' }}
                className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#29BA1F]/15 text-[#29BA1F] flex items-center justify-center border border-[#29BA1F]/25">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">{offer.id}</p>
                    <p className="text-lg font-semibold text-white">
                      {offer.pickup} → {offer.dropoff}
                    </p>
                    <p className="text-sm text-white/50">ETA client: {offer.eta}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#29BA1F]/15 px-4 py-2 text-sm font-bold text-[#29BA1F] border border-[#29BA1F]/30">
                    {offer.price}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    className="rounded-2xl bg-white text-[#0B2928] px-4 py-3 text-sm font-bold shadow-lg shadow-black/25"
                  >
                    Accepter
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <BottomNav role="driver" />
    </main>
  );
}

function StatCard({ title, value, icon, accent }: { title: string; value: string; icon: React.ReactNode; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm shadow-[0_14px_40px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22`, color: accent }}>
          {icon}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/60">{title}</p>
          <p className="text-lg font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
