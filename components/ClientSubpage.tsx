'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import BottomNav from '@/components/BottomNav';
import { IcoArrowLeft, IcoSparkle } from '@/components/Icons';

interface ClientSubpageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  stats?: Array<{ label: string; value: string }>;
  children: React.ReactNode;
}

/* Pill glassmorphism — même recette que la navbar */
const pillStyle = {
  background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(18,18,18,0.98) 100%)',
  border: '1px solid rgba(41,186,31,0.15)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
  backdropFilter: 'blur(20px)',
};

export default function ClientSubpage({
  title, description, icon, badge = 'Rapidoss', stats = [], children,
}: ClientSubpageProps) {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#121212] pb-28">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#29BA1F22,transparent_35%),linear-gradient(180deg,#0B2928_0%,#0B0B0B_65%)] pointer-events-none" />

      {/* Header pill flottant */}
      <div className="relative z-20 px-4 pt-4 pb-2">
        <div className="mx-auto max-w-md flex items-center gap-3 rounded-2xl px-4 py-3" style={pillStyle}>
          <motion.button whileTap={{ scale:0.9 }} onClick={() => router.push('/client')}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#29BA1F] flex-shrink-0"
            style={{ background:'rgba(11,41,40,0.8)', border:'1px solid rgba(41,186,31,0.25)' }}>
            <IcoArrowLeft size={16} />
          </motion.button>

          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background:'linear-gradient(145deg,#29BA1F,#098C04)', boxShadow:'0 3px 12px rgba(41,186,31,0.35)' }}>
            {icon}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#29BA1F]">{badge}</p>
            <p className="text-sm font-black text-white leading-tight truncate">{title}</p>
          </div>
        </div>

        {stats.length > 0 && (
          <div className="mx-auto max-w-md mt-3 grid grid-cols-3 gap-2">
            {stats.map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35, ease: 'easeOut' }}
                className="rounded-2xl p-3"
                style={pillStyle}>
                <p className="text-[10px] uppercase tracking-wider text-[#525252]">{s.label}</p>
                <p className="mt-1 text-base font-black text-white">{s.value}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <section className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-3 px-4 pt-2">
        {children}
      </section>

      <BottomNav role="client" />
    </main>
  );
}
