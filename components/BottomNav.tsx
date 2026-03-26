'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  IcoNavHome, IcoNavOrders, IcoNavHistory, IcoNavProfile,
  IcoNavDriver, IcoNavWallet, IcoNavCTA,
} from '@/components/Icons';

/* ─── Config ─────────────────────────────────────────── */
interface NavItem {
  id: string;
  label: string;
  path: string;
  role: 'client' | 'driver';
  Icon: React.ComponentType<{ size?: number; active?: boolean }>;
  isCTA?: boolean;
}

const navItems: NavItem[] = [
  { id: 'c-home',    label: 'Accueil',    path: '/client',         role: 'client', Icon: IcoNavHome    },
  { id: 'c-orders',  label: 'Courses',    path: '/client/orders',  role: 'client', Icon: IcoNavOrders  },
  { id: 'c-cta',     label: '',           path: '/client',         role: 'client', Icon: IcoNavCTA, isCTA: true },
  { id: 'c-history', label: 'Historique', path: '/client/history', role: 'client', Icon: IcoNavHistory },
  { id: 'c-profile', label: 'Profil',     path: '/client/profile', role: 'client', Icon: IcoNavProfile },

  { id: 'd-home',    label: 'Accueil',    path: '/driver',          role: 'driver', Icon: IcoNavHome   },
  { id: 'd-cta',     label: '',           path: '/driver',          role: 'driver', Icon: IcoNavCTA, isCTA: true },
  { id: 'd-orders',  label: 'Courses',    path: '/driver/orders',   role: 'driver', Icon: IcoNavDriver },
  { id: 'd-wallet',  label: 'Gains',      path: '/driver/earnings', role: 'driver', Icon: IcoNavWallet },
  { id: 'd-profile', label: 'Profil',     path: '/driver/profile',  role: 'driver', Icon: IcoNavProfile},
];

/* ─── Component ──────────────────────────────────────── */
export default function BottomNav({ role }: { role: 'client' | 'driver' }) {
  const pathname = usePathname();
  const router   = useRouter();
  const items    = navItems.filter(i => i.role === role);

  return (
    /* Conteneur positionné */
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-5 px-4 pointer-events-none">

      {/* Halo de fond */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent pointer-events-none" />

      {/* Pill flottante */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 180, delay: 0.1 }}
        className="relative pointer-events-auto flex items-center gap-1 rounded-[2rem] px-2 py-2"
        style={{
          background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(18,18,18,0.98) 100%)',
          border: '1px solid rgba(41,186,31,0.18)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(41,186,31,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Ligne verte en haut */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#29BA1F]/50 to-transparent rounded-full" />

        {items.map((item) => {
          const isActive = !item.isCTA && (pathname === item.path || pathname?.startsWith(item.path + '/'));
          const { Icon } = item;

          /* ── Bouton CTA central ── */
          if (item.isCTA) {
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.88 }}
                onClick={() => router.push(item.path)}
                className="relative mx-1 flex items-center justify-center"
                style={{ width: 56, height: 56 }}
              >
                {/* Glow */}
                <motion.div
                  animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute inset-0 rounded-full bg-[#29BA1F]/25 blur-md"
                />
                {/* Bouton */}
                <div
                  className="relative z-10 flex items-center justify-center rounded-full"
                  style={{
                    width: 52, height: 52,
                    background: 'linear-gradient(145deg, #29BA1F 0%, #098C04 100%)',
                    boxShadow: '0 4px 20px rgba(41,186,31,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  <IcoNavCTA size={26} />
                </div>
              </motion.button>
            );
          }

          /* ── Item normal ── */
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.88 }}
              onClick={() => router.push(item.path)}
              className="relative flex flex-col items-center justify-center gap-0.5 rounded-[1.4rem] transition-all"
              style={{ width: 60, height: 56, padding: '6px 4px' }}
            >
              {/* Fond actif */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId={`pill-${role}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                    className="absolute inset-0 rounded-[1.4rem]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(11,41,40,0.9) 0%, rgba(9,140,4,0.12) 100%)',
                      border: '1px solid rgba(41,186,31,0.3)',
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Icône */}
              <div className="relative z-10">
                <Icon size={24} active={isActive} />
                {/* Point lumineux actif */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#29BA1F]"
                    style={{ boxShadow: '0 0 6px rgba(41,186,31,0.8)' }}
                  />
                )}
              </div>

              {/* Label */}
              {item.label && (
                <span
                  className="relative z-10 text-[9px] font-bold tracking-wide transition-colors leading-none"
                  style={{ color: isActive ? '#29BA1F' : '#525252' }}
                >
                  {item.label}
                </span>
              )}
            </motion.button>
          );
        })}

        {/* Reflet bas */}
        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-full" />
      </motion.nav>
    </div>
  );
}
