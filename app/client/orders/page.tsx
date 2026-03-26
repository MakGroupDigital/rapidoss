'use client';

import { motion } from 'motion/react';
import ClientSubpage from '@/components/ClientSubpage';
import { IcoPackage, IcoShield, IcoPin, IcoUser, IcoClock, IcoNavigation } from '@/components/Icons';

const orders = [
  { id: 'CMD-1042', status: 'En cours',       route: 'Gombe → Limete',          eta: '12 min',          courier: 'Didier K.',  vehicle: 'Moto Honda' },
  { id: 'CMD-1041', status: 'Prise en charge', route: 'Kintambo → Bandalungwa',  eta: 'Livreur affecté', courier: 'Sarah M.',   vehicle: 'Scooter Yamaha' },
];

const fy = (i = 0) => ({
  initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' as const },
});

export default function ClientOrdersPage() {
  return (
    <ClientSubpage
      title="Courses actives"
      description="Suivez vos commandes en temps réel"
      icon={<IcoPackage size={18} className="text-white" />}
      badge="Suivi en direct"
      stats={[
        { label: 'Actives',  value: '02'     },
        { label: 'ETA moy.', value: '14 min' },
        { label: 'Support',  value: '24/7'   },
      ]}
    >
      {/* Info banner */}
      <motion.div {...fy(0)} className="rounded-2xl bg-[#0B2928] border border-[#29BA1F]/20 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#29BA1F] to-[#098C04] flex items-center justify-center shadow-md shadow-[#29BA1F]/25 flex-shrink-0">
            <IcoShield size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Suivi en direct</p>
            <p className="text-xs text-[#525252] mt-0.5">Statut, ETA et livreur assigné pour chaque course.</p>
          </div>
        </div>
      </motion.div>

      {/* Orders */}
      {orders.map((order, i) => (
        <motion.article key={order.id} {...fy(i + 1)}
          className="rounded-3xl bg-[#1a1a1a] border border-[#525252]/20 p-4 hover:border-[#29BA1F]/25 transition-colors">

          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#525252]">{order.id}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <IcoNavigation size={12} className="text-[#29BA1F]" />
                <p className="text-sm font-bold text-white">{order.route}</p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold flex-shrink-0 ${
              order.status === 'En cours'
                ? 'bg-[#0B2928] border border-[#29BA1F]/30 text-[#29BA1F]'
                : 'bg-[#121212] border border-[#525252]/30 text-[#525252]'
            }`}>
              {order.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-[#121212] border border-[#525252]/15 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#525252] mb-1.5">Livreur</p>
              <div className="flex items-center gap-1.5">
                <IcoUser size={13} className="text-[#29BA1F]" />
                <p className="text-sm font-bold text-white">{order.courier}</p>
              </div>
              <p className="text-[11px] text-[#525252] mt-0.5">{order.vehicle}</p>
            </div>
            <div className="rounded-2xl bg-[#0B2928] border border-[#29BA1F]/15 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#29BA1F]/60 mb-1.5">ETA</p>
              <div className="flex items-center gap-1.5">
                <IcoClock size={13} className="text-[#29BA1F]" />
                <p className="text-sm font-bold text-white">{order.eta}</p>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </ClientSubpage>
  );
}
