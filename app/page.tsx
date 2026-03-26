'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { RapidossLogo, IcoGoogle, IcoPackage, IcoBike, IcoChevronRight, IcoSparkle } from '@/components/Icons';

export default function Onboarding() {
  const [step, setStep] = useState<'splash' | 'login' | 'role'>('splash');
  const router = useRouter();

  useEffect(() => {
    if (step === 'splash') {
      const t = setTimeout(() => setStep('login'), 2600);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#121212] overflow-hidden relative px-6">

      {/* Orbes décoratifs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#29BA1F]/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full bg-[#0B2928]/60 blur-2xl pointer-events-none" />

      <AnimatePresence mode="wait">

        {/* ── SPLASH ── */}
        {step === 'splash' && (
          <motion.div key="splash"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center gap-5">
            <motion.div
              animate={{ filter: ['drop-shadow(0 0 12px #29BA1F60)', 'drop-shadow(0 0 28px #29BA1F90)', 'drop-shadow(0 0 12px #29BA1F60)'] }}
              transition={{ repeat: Infinity, duration: 2 }}>
              <RapidossLogo size={88} />
            </motion.div>
            <div className="text-center">
              <h1 className="text-4xl font-black tracking-tight text-white">Rapidoss</h1>
              <p className="mt-1 text-sm text-[#525252]">Logistique à la demande</p>
            </div>
            {/* Barre de chargement */}
            <div className="w-32 h-0.5 bg-[#1a1a1a] rounded-full overflow-hidden mt-2">
              <motion.div initial={{ width: 0 }} animate={{ width: '100%' }}
                transition={{ duration: 2.2, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-[#29BA1F] to-[#098C04]" />
            </div>
          </motion.div>
        )}

        {/* ── LOGIN ── */}
        {step === 'login' && (
          <motion.div key="login"
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
            className="flex flex-col items-center w-full max-w-sm">

            <RapidossLogo size={64} />
            <h1 className="mt-5 text-3xl font-black text-white tracking-tight">Rapidoss</h1>
            <p className="mt-2 text-sm text-[#525252] text-center">La livraison à la demande,<br />simple et instantanée.</p>

            {/* Pill statut */}
            <div className="mt-6 flex items-center gap-2 rounded-full bg-[#0B2928] border border-[#29BA1F]/25 px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-[#29BA1F] animate-pulse" />
              <span className="text-xs font-semibold text-[#29BA1F]">24 livreurs actifs à Kinshasa</span>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep('role')}
              className="mt-10 w-full flex items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 font-bold text-[#121212] shadow-lg shadow-black/30 transition hover:bg-gray-50">
              <IcoGoogle size={20} />
              Continuer avec Google
            </motion.button>

            <p className="mt-5 text-[11px] text-[#525252] text-center">
              En continuant, vous acceptez nos conditions d'utilisation
            </p>
          </motion.div>
        )}

        {/* ── ROLE ── */}
        {step === 'role' && (
          <motion.div key="role"
            initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
            className="flex flex-col items-center w-full max-w-sm">

            <RapidossLogo size={52} />
            <h2 className="mt-5 text-2xl font-black text-white text-center">Choisissez votre profil</h2>
            <p className="mt-1 text-sm text-[#525252] text-center">Comment souhaitez-vous utiliser Rapidoss ?</p>

            <div className="mt-8 w-full space-y-3">
              {/* Client */}
              <motion.button whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/client')}
                className="w-full flex items-center gap-4 rounded-2xl bg-gradient-to-r from-[#29BA1F] to-[#098C04] p-5 text-left shadow-lg shadow-[#29BA1F]/25 transition">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <IcoPackage size={22} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-white text-base">Je suis Client</p>
                  <p className="text-xs text-white/70 mt-0.5">Commander une livraison</p>
                </div>
                <IcoChevronRight size={18} className="text-white/60" />
              </motion.button>

              {/* Livreur */}
              <motion.button whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/driver')}
                className="w-full flex items-center gap-4 rounded-2xl bg-[#1a1a1a] border border-[#29BA1F]/25 p-5 text-left transition hover:border-[#29BA1F]/50">
                <div className="w-12 h-12 rounded-xl bg-[#0B2928] border border-[#29BA1F]/20 flex items-center justify-center flex-shrink-0">
                  <IcoBike size={22} className="text-[#29BA1F]" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-white text-base">Je suis Livreur</p>
                  <p className="text-xs text-[#525252] mt-0.5">Accepter des courses</p>
                </div>
                <IcoChevronRight size={18} className="text-[#525252]" />
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
