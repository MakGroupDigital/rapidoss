'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import BottomNav from '@/components/BottomNav';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { subscribeToDriverOrders, type DeliveryOrder } from '@/lib/orders';
import {
  IcoBike, IcoPower, IcoWallet, IcoClock, IcoPin,
  IcoChevronRight, IcoTrend, IcoCheck, IcoNavigation,
} from '@/components/Icons';

const fy = (i = 0) => ({
  initial:    { opacity: 0, y: 18 },
  animate:    { opacity: 1, y: 0 },
  transition: { delay: i * 0.08, duration: 0.38, ease: 'easeOut' as const },
});

function formatAmount(amount: number) {
  return new Intl.NumberFormat('fr-CD').format(amount);
}

function getStatusLabel(status: DeliveryOrder['status']) {
  if (status === 'confirmed') return 'Confirmée';
  if (status === 'driver_assigned') return 'Assignée';
  if (status === 'picked_up') return 'En cours';
  return 'Terminée';
}

export default function DriverPage() {
  const { isLoading, isAuthorized, profile } = useProtectedRoute('driver');
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const userName = profile?.fullName?.split(' ')[0] ?? '';
  const activeOrders = orders.filter((order) => order.status !== 'completed');
  const completedOrders = orders.filter((order) => order.status === 'completed');
  const todayEarnings = completedOrders.reduce((sum, order) => sum + order.price, 0);
  const stats = [
    { label: 'Courses', value: String(completedOrders.length), icon: IcoCheck },
    { label: 'Gains', value: `${formatAmount(todayEarnings)} FC`, icon: IcoWallet },
    { label: 'Note', value: '4.9 ★', icon: IcoBike },
  ];

  useEffect(() => {
    if (!profile?.uid) {
      return;
    }

    return subscribeToDriverOrders(profile.uid, profile.fullName, setOrders);
  }, [profile?.fullName, profile?.uid]);

  if (isLoading || !isAuthorized) {
    return <div className="min-h-screen bg-[#121212]" />;
  }

  return (
    <main className="min-h-screen bg-[#121212] pb-28">
      <div className="mx-auto flex max-w-md flex-col px-5 pt-12 gap-4">

        {/* Header */}
        <motion.div {...fy(0)} className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#29BA1F]">
              {userName ? `Bienvenue, ${userName}` : 'Espace livreur'}
            </p>
            <h1 className="text-2xl font-black text-white">Tableau de bord</h1>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#29BA1F] to-[#098C04] flex items-center justify-center shadow-lg shadow-[#29BA1F]/30">
            <IcoBike size={22} className="text-white" strokeWidth={2} />
          </div>
        </motion.div>

        {/* Statut + gains */}
        <motion.div {...fy(1)} className="rounded-3xl bg-[#1a1a1a] border border-[#29BA1F]/15 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 rounded-full bg-[#0B2928] border border-[#29BA1F]/30 px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-[#29BA1F] animate-pulse" />
              <span className="text-xs font-bold text-[#29BA1F]">En ligne</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-[#121212] border border-[#525252]/25 px-3 py-1.5">
              <IcoClock size={12} className="text-[#525252]" />
              <span className="text-xs text-[#525252]">Depuis 2h30</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-2xl bg-[#121212] border border-[#525252]/20 p-3 text-center">
                  <Icon size={16} className="text-[#29BA1F] mx-auto mb-1" />
                  <p className="text-xs font-black text-white">{s.value}</p>
                  <p className="text-[10px] text-[#525252] mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Barre gains du jour */}
          <div className="mt-4 rounded-2xl bg-[#0B2928] border border-[#29BA1F]/20 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <IcoTrend size={14} className="text-[#29BA1F]" />
                <span className="text-xs font-bold text-[#29BA1F]">Gains aujourd&apos;hui</span>
              </div>
              <span className="text-lg font-black text-white">{formatAmount(todayEarnings)} FC</span>
            </div>
            <div className="h-1.5 bg-[#121212] rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((todayEarnings / 20000) * 100, 100)}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#29BA1F] to-[#098C04] rounded-full" />
            </div>
            <p className="text-[10px] text-[#525252] mt-1">Objectif : 20 000 FC</p>
          </div>
        </motion.div>

        {/* Offres */}
        <motion.div {...fy(2)}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-white">Offres disponibles</h2>
            <span className="rounded-full bg-[#0B2928] border border-[#29BA1F]/25 px-2.5 py-1 text-[10px] font-bold text-[#29BA1F]">
              {activeOrders.length} actives
            </span>
          </div>

          {activeOrders.length > 0 ? (
            <div className="space-y-3">
              {activeOrders.map((order, i) => (
                <motion.article key={order.id}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.35, ease: 'easeOut' }}
                  className="rounded-3xl bg-[#1a1a1a] border border-[#525252]/20 p-4 hover:border-[#29BA1F]/30 transition-colors">

                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#525252]">{order.id.slice(0, 6).toUpperCase()} · {getStatusLabel(order.status)}</span>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#29BA1F]" />
                        <span className="text-sm font-bold text-white">{order.departure}</span>
                      </div>
                      <IcoNavigation size={12} className="text-[#525252] rotate-90" />
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#098C04]" />
                        <span className="text-sm font-bold text-white">{order.destination}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#0B2928] border border-[#29BA1F]/25 px-3 py-2 text-right flex-shrink-0">
                    <p className="text-xs font-black text-[#29BA1F]">{formatAmount(order.price)} FC</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] text-[#525252]">
                    <span className="flex items-center gap-1">
                      <IcoPin size={11} className="text-[#525252]" /> {order.distanceKm.toFixed(1)} km
                    </span>
                    <span className="flex items-center gap-1">
                      <IcoClock size={11} className="text-[#525252]" /> {order.etaMinutes} min
                    </span>
                  </div>
                  <motion.button whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#29BA1F] to-[#098C04] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#29BA1F]/25">
                    Voir <IcoChevronRight size={12} />
                  </motion.button>
                </div>

                {/* Timer */}
                <div className="mt-3 flex items-center gap-2">
                  <IcoClock size={11} className="text-[#525252]" />
                  <div className="flex-1 h-1 bg-[#121212] rounded-full overflow-hidden">
                    <motion.div initial={{ width: '100%' }} animate={{ width: '0%' }}
                      transition={{ duration: 30, ease: 'linear' }}
                      className="h-full bg-gradient-to-r from-[#29BA1F] to-[#098C04]" />
                  </div>
                  <span className="text-[10px] text-[#525252]">30s</span>
                </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-[#1a1a1a] border border-[#525252]/20 p-5 text-center">
              <p className="text-sm font-bold text-white">Aucune course assignée</p>
              <p className="mt-1 text-xs text-[#525252]">Les commandes Firestore apparaîtront ici.</p>
            </div>
          )}
        </motion.div>

        {/* Bouton statut */}
        <motion.div {...fy(3)}>
          <motion.button whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#1a1a1a] border border-[#525252]/25 px-5 py-4 font-bold text-[#525252] transition hover:border-[#29BA1F]/30 hover:text-white">
            <IcoPower size={17} />
            Passer hors ligne
          </motion.button>
        </motion.div>

      </div>
      <BottomNav role="driver" />
    </main>
  );
}
