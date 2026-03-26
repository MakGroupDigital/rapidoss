'use client';

import BottomNav from '@/components/BottomNav';
import { IcoWallet, IcoZap, IcoStar, IcoCard, IcoCash, IcoArrowUp } from '@/components/Icons';
import { motion } from 'motion/react';

const wallet = {
  balance: '342,500 FC',
  cardNumber: '4532 **** **** 8901',
  holder: 'Jean Mukendi',
  expiry: '12/26',
  trips: 23,
  rating: 4.8,
};

const recentTransactions = [
  { id: 'TRX-001', date: '26 Mars', type: 'Gain', amount: '+12,500 FC', trips: 5 },
  { id: 'TRX-002', date: '25 Mars', type: 'Retrait', amount: '-50,000 FC', trips: null },
  { id: 'TRX-003', date: '25 Mars', type: 'Gain', amount: '+18,200 FC', trips: 7 },
  { id: 'TRX-004', date: '24 Mars', type: 'Gain', amount: '+15,800 FC', trips: 6 },
];

export default function DriverEarningsPage() {
  return (
    <main className="min-h-screen bg-[#121212] pb-28 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#29BA1F22,transparent_35%),linear-gradient(180deg,#0B2928_0%,#0B0B0B_65%)] pointer-events-none" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#29BA1F]/80">Portefeuille</p>
            <h1 className="text-3xl font-black">Rapidoss Card</h1>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#29BA1F]/15 text-[#29BA1F] border border-[#29BA1F]/25">
            <IcoWallet size={24} />
          </div>
        </div>

        {/* Carte Rapidoss - Design Hexagonal Innovant */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="relative w-full max-w-md mx-auto"
          style={{ perspective: '1500px', transformStyle: 'preserve-3d' }}
        >
          {/* Glow animé */}
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute inset-0 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(41,186,31,0.4) 0%, transparent 70%)',
            }}
          />

          {/* Carte principale avec clip-path hexagonal */}
          <div
            className="relative overflow-hidden"
            style={{
              clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)',
              aspectRatio: '1.6/1',
            }}
          >
            {/* Background avec mesh gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 20% 30%, rgba(41,186,31,0.3) 0%, transparent 50%),
                  radial-gradient(circle at 80% 70%, rgba(9,140,4,0.3) 0%, transparent 50%),
                  linear-gradient(135deg, #0B2928 0%, #121212 50%, #0B2928 100%)
                `,
              }}
            />

            {/* Grille hexagonale animée */}
            <svg className="absolute inset-0 w-full h-full opacity-10" style={{ mixBlendMode: 'overlay' }}>
              <defs>
                <pattern id="hexagons" x="0" y="0" width="50" height="43.4" patternUnits="userSpaceOnUse">
                  <polygon points="25,0 50,14.43 50,28.87 25,43.3 0,28.87 0,14.43" fill="none" stroke="#29BA1F" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexagons)" />
            </svg>

            {/* Particules flottantes */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#29BA1F]"
                style={{
                  left: `${15 + i * 10}%`,
                  top: `${20 + (i % 3) * 20}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2 + i * 0.3,
                  delay: i * 0.2,
                }}
              />
            ))}

            {/* Contenu de la carte */}
            <div className="relative h-full p-6 flex flex-col justify-between">
              {/* Header avec logo hexagonal */}
              <div className="flex items-start justify-between">
                <div>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-[10px] uppercase tracking-[0.25em] text-[#29BA1F] mb-2 font-bold"
                  >
                    Rapidoss Wallet
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="text-4xl font-black text-white"
                    style={{ textShadow: '0 0 20px rgba(41,186,31,0.5)' }}
                  >
                    {wallet.balance}
                  </motion.p>
                </div>

                {/* Logo hexagonal avec effet néon */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                  className="relative"
                >
                  <div
                    className="w-14 h-14 flex items-center justify-center"
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                      background: 'linear-gradient(135deg, rgba(41,186,31,0.3) 0%, rgba(9,140,4,0.5) 100%)',
                      boxShadow: '0 0 20px rgba(41,186,31,0.6), inset 0 0 10px rgba(41,186,31,0.3)',
                    }}
                  >
                    <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}>
                      <IcoZap size={24} className="text-[#29BA1F]" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Stats avec barres de progression */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IcoZap size={14} className="text-[#29BA1F]" />
                    <span className="text-xs text-white/70">Courses</span>
                  </div>
                  <span className="text-sm font-bold text-white">{wallet.trips}</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="h-full bg-gradient-to-r from-[#098C04] to-[#29BA1F]"
                    style={{ boxShadow: '0 0 10px rgba(41,186,31,0.8)' }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IcoStar size={14} className="text-[#29BA1F]" />
                    <span className="text-xs text-white/70">Note</span>
                  </div>
                  <span className="text-sm font-bold text-white">{wallet.rating}/5</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '96%' }}
                    transition={{ delay: 0.7, duration: 1 }}
                    className="h-full bg-gradient-to-r from-[#098C04] to-[#29BA1F]"
                    style={{ boxShadow: '0 0 10px rgba(41,186,31,0.8)' }}
                  />
                </div>
              </div>

              {/* Footer avec infos carte */}
              <div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-base font-mono tracking-[0.2em] mb-3 text-white/90"
                  style={{ textShadow: '0 0 10px rgba(41,186,31,0.3)' }}
                >
                  {wallet.cardNumber}
                </motion.p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#29BA1F]/80 mb-1">Titulaire</p>
                    <p className="text-xs font-bold text-white/90">{wallet.holder}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-wider text-[#29BA1F]/80 mb-1">Expire</p>
                    <p className="text-xs font-bold text-white/90">{wallet.expiry}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bordure lumineuse animée */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)',
                border: '1px solid rgba(41,186,31,0.5)',
                boxShadow: 'inset 0 0 20px rgba(41,186,31,0.2), 0 0 30px rgba(41,186,31,0.3)',
              }}
              animate={{
                boxShadow: [
                  'inset 0 0 20px rgba(41,186,31,0.2), 0 0 30px rgba(41,186,31,0.3)',
                  'inset 0 0 30px rgba(41,186,31,0.4), 0 0 40px rgba(41,186,31,0.5)',
                  'inset 0 0 20px rgba(41,186,31,0.2), 0 0 30px rgba(41,186,31,0.3)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </motion.div>

        {/* Actions rapides - Design innovant */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="relative rounded-2xl p-5 backdrop-blur-xl overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(18,18,18,0.98) 100%)',
              border: '1px solid rgba(41,186,31,0.18)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            {/* Effet hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: 'radial-gradient(circle at center, rgba(41,186,31,0.15) 0%, transparent 70%)',
              }}
            />

            {/* Icône avec effet néon */}
            <div className="relative flex flex-col items-center gap-3">
              <div
                className="relative flex h-14 w-14 items-center justify-center"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  background: 'linear-gradient(135deg, rgba(41,186,31,0.2) 0%, rgba(9,140,4,0.3) 100%)',
                  boxShadow: '0 0 20px rgba(41,186,31,0.4)',
                }}
              >
                <IcoArrowUp size={24} className="text-[#29BA1F]" />
              </div>
              <div className="text-center">
                <span className="text-sm font-bold text-white block">Retirer</span>
                <span className="text-[10px] text-white/50">Vers compte bancaire</span>
              </div>
            </div>

            {/* Particules décoratives */}
            <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-[#29BA1F] opacity-60" />
            <div className="absolute bottom-3 left-3 w-1 h-1 rounded-full bg-[#29BA1F] opacity-40" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="relative rounded-2xl p-5 backdrop-blur-xl overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(18,18,18,0.98) 100%)',
              border: '1px solid rgba(41,186,31,0.18)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            {/* Effet hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: 'radial-gradient(circle at center, rgba(41,186,31,0.15) 0%, transparent 70%)',
              }}
            />

            {/* Icône avec effet néon */}
            <div className="relative flex flex-col items-center gap-3">
              <div
                className="relative flex h-14 w-14 items-center justify-center"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  background: 'linear-gradient(135deg, rgba(41,186,31,0.2) 0%, rgba(9,140,4,0.3) 100%)',
                  boxShadow: '0 0 20px rgba(41,186,31,0.4)',
                }}
              >
                <IcoCard size={24} className="text-[#29BA1F]" />
              </div>
              <div className="text-center">
                <span className="text-sm font-bold text-white block">Historique</span>
                <span className="text-[10px] text-white/50">Toutes les transactions</span>
              </div>
            </div>

            {/* Particules décoratives */}
            <div className="absolute top-3 left-2 w-1 h-1 rounded-full bg-[#29BA1F] opacity-60" />
            <div className="absolute bottom-2 right-3 w-1 h-1 rounded-full bg-[#29BA1F] opacity-40" />
          </motion.button>
        </div>

        {/* Transactions récentes */}
        <div>
          <p className="text-xs uppercase tracking-widest text-[#29BA1F]/80 mb-4">Transactions récentes</p>
          <div className="space-y-2">
            {recentTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl p-4 backdrop-blur-xl flex items-center justify-between"
                style={{
                  background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(18,18,18,0.98) 100%)',
                  border: '1px solid rgba(41,186,31,0.18)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    transaction.type === 'Gain' ? 'bg-[#29BA1F]/15 text-[#29BA1F]' : 'bg-white/10 text-white/60'
                  }`}>
                    {transaction.type === 'Gain' ? <IcoZap size={20} /> : <IcoCash size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{transaction.type}</p>
                    <p className="text-xs text-white/60">
                      {transaction.date}
                      {transaction.trips && ` • ${transaction.trips} courses`}
                    </p>
                  </div>
                </div>
                <p className={`text-lg font-bold ${
                  transaction.type === 'Gain' ? 'text-[#29BA1F]' : 'text-white/60'
                }`}>
                  {transaction.amount}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BottomNav role="driver" />
    </main>
  );
}
