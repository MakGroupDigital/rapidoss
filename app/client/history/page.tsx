'use client';

import { motion } from 'motion/react';
import ClientSubpage from '@/components/ClientSubpage';
import { IcoHistory, IcoCheck, IcoWallet, IcoPin, IcoStar } from '@/components/Icons';

const historyItems = [
  { id: 'CMD-1038', route: 'Ngaliema → Gombe',  amount: '4 500 FC', date: '24 mars 2026', rating: 5 },
  { id: 'CMD-1032', route: 'Masina → Limete',    amount: '6 000 FC', date: '21 mars 2026', rating: 5 },
  { id: 'CMD-1028', route: 'Gombe → Kintambo',   amount: '3 200 FC', date: '18 mars 2026', rating: 4 },
];

const fy = (i = 0) => ({
  initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' as const },
});

export default function ClientHistoryPage() {
  return (
    <ClientSubpage
      title="Historique"
      description="Vos livraisons terminées"
      icon={<IcoHistory size={18} className="text-white" />}
      badge="Courses terminées"
      stats={[
        { label: 'Ce mois',       value: '08'   },
        { label: 'Dépensé',       value: '42k FC' },
        { label: 'Réussite',      value: '100%' },
      ]}
    >
      {/* Résumé */}
      <motion.div {...fy(0)} className="rounded-2xl bg-[#0B2928] border border-[#29BA1F]/20 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#29BA1F] to-[#098C04] flex items-center justify-center shadow-md shadow-[#29BA1F]/25 flex-shrink-0">
            <IcoWallet size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Récapitulatif fiable</p>
            <p className="text-xs text-[#525252] mt-0.5">Montants, dates et trajets de toutes vos livraisons.</p>
          </div>
        </div>
      </motion.div>

      {/* Items */}
      {historyItems.map((item, i) => (
        <motion.article key={item.id} {...fy(i + 1)}
          className="rounded-3xl bg-[#1a1a1a] border border-[#525252]/20 p-4 hover:border-[#29BA1F]/25 transition-colors">

          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#525252]">{item.id}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <IcoPin size={12} className="text-[#29BA1F]" />
                <p className="text-sm font-bold text-white">{item.route}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0B2928] border border-[#29BA1F]/25 flex items-center justify-center flex-shrink-0">
              <IcoCheck size={14} className="text-[#29BA1F]" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, j) => (
                <IcoStar key={j} size={11}
                  className={j < item.rating ? 'text-amber-400' : 'text-[#525252]'}
                  filled={j < item.rating} />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#525252]">{item.date}</span>
              <div className="flex items-center gap-1.5 rounded-xl bg-[#0B2928] border border-[#29BA1F]/20 px-3 py-1.5">
                <IcoWallet size={12} className="text-[#29BA1F]" />
                <span className="text-xs font-black text-[#29BA1F]">{item.amount}</span>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </ClientSubpage>
  );
}
