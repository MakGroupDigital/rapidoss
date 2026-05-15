'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import ClientSubpage from '@/components/ClientSubpage';
import { IcoHistory, IcoCheck, IcoWallet, IcoPin, IcoStar } from '@/components/Icons';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { subscribeToUserOrders, type DeliveryOrder } from '@/lib/orders';
import OrderDocumentCard from '@/components/OrderDocumentCard';

const fy = (i = 0) => ({
  initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' as const },
});

export default function ClientHistoryPage() {
  const { isLoading, isAuthorized, profile } = useProtectedRoute('client');
  const [historyItems, setHistoryItems] = useState<DeliveryOrder[]>([]);

  useEffect(() => {
    if (!profile?.uid) {
      return;
    }

    const unsubscribe = subscribeToUserOrders(profile.uid, (userOrders) => {
      setHistoryItems(userOrders.filter((order) => order.status === 'completed'));
    });

    return unsubscribe;
  }, [profile?.uid]);

  if (isLoading || !isAuthorized) {
    return <div className="min-h-screen bg-[#121212]" />;
  }

  return (
    <ClientSubpage
      title="Historique"
      description="Vos livraisons terminées"
      icon={<IcoHistory size={18} className="text-white" />}
      badge="Courses terminées"
      stats={[
        { label: 'Ce mois',       value: String(historyItems.length).padStart(2, '0') },
        { label: 'Dépensé',       value: `${historyItems.reduce((sum, item) => sum + item.price, 0)} FC` },
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

      {historyItems.length === 0 ? (
        <motion.div {...fy(1)} className="rounded-3xl bg-[#1a1a1a] border border-[#525252]/20 p-5 text-center">
          <p className="text-sm font-bold text-white">Aucun historique</p>
          <p className="mt-1 text-xs text-[#525252]">Les courses terminées apparaîtront ici.</p>
        </motion.div>
      ) : null}

      {historyItems.map((item, i) => (
        <motion.article key={item.id} {...fy(i + 1)}
          className="rounded-3xl bg-[#1a1a1a] border border-[#525252]/20 p-4 hover:border-[#29BA1F]/25 transition-colors">

          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#525252]">{item.id.slice(0, 6).toUpperCase()}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <IcoPin size={12} className="text-[#29BA1F]" />
                <p className="text-sm font-bold text-white">{item.departure} → {item.destination}</p>
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
                  className={j < 5 ? 'text-amber-400' : 'text-[#525252]'}
                  filled={j < 5} />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#525252]">Commande terminée</span>
              <div className="flex items-center gap-1.5 rounded-xl bg-[#0B2928] border border-[#29BA1F]/20 px-3 py-1.5">
                <IcoWallet size={12} className="text-[#29BA1F]" />
                <span className="text-xs font-black text-[#29BA1F]">{item.price} FC</span>
              </div>
            </div>
          </div>
          <OrderDocumentCard order={item} />
        </motion.article>
      ))}
    </ClientSubpage>
  );
}
