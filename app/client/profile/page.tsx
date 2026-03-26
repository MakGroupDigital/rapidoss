'use client';

import { motion } from 'motion/react';
import ClientSubpage from '@/components/ClientSubpage';
import { IcoUser, IcoPhone, IcoPin, IcoShield, IcoStar, IcoCheck, IcoHistory } from '@/components/Icons';

const profileRows = [
  { icon: IcoUser,    label: 'Nom',      value: 'Client Rapidoss'     },
  { icon: IcoPhone,   label: 'Téléphone', value: '+243 900 000 000'   },
  { icon: IcoPin,     label: 'Adresse',   value: 'Kinshasa, RDC'      },
  { icon: IcoHistory, label: 'Courses',   value: '18 livraisons'      },
];

const fy = (i = 0) => ({
  initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' as const },
});

export default function ClientProfilePage() {
  return (
    <ClientSubpage
      title="Profil"
      description="Vos informations personnelles"
      icon={<IcoUser size={18} className="text-white" />}
      badge="Compte vérifié"
      stats={[
        { label: 'Statut',  value: 'Actif' },
        { label: 'Courses', value: '18'    },
        { label: 'Note',    value: '4.9'   },
      ]}
    >
      {/* Avatar card */}
      <motion.div {...fy(0)} className="rounded-3xl bg-[#1a1a1a] border border-[#525252]/20 p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#29BA1F] to-[#098C04] flex items-center justify-center shadow-lg shadow-[#29BA1F]/30 flex-shrink-0">
            <IcoUser size={28} className="text-white" strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white truncate">Client Rapidoss</h2>
              <div className="flex items-center gap-1 rounded-full bg-[#0B2928] border border-[#29BA1F]/25 px-2 py-0.5 flex-shrink-0">
                <IcoStar size={10} className="text-amber-400" filled />
                <span className="text-[10px] font-bold text-amber-400">4.9</span>
              </div>
            </div>
            <p className="text-xs text-[#525252] mt-0.5">Compte principal · Kinshasa</p>
            <div className="mt-2 flex items-center gap-1.5">
              <IcoCheck size={12} className="text-[#29BA1F]" />
              <span className="text-[10px] font-bold text-[#29BA1F]">Profil vérifié</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sécurité */}
      <motion.div {...fy(1)} className="rounded-2xl bg-[#0B2928] border border-[#29BA1F]/20 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#29BA1F] to-[#098C04] flex items-center justify-center shadow-md shadow-[#29BA1F]/25 flex-shrink-0">
            <IcoShield size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Sécurité du compte</p>
            <p className="text-xs text-[#525252] mt-0.5">Numéro vérifié · Profil prêt pour les courses</p>
          </div>
        </div>
      </motion.div>

      {/* Infos */}
      <div className="space-y-2">
        {profileRows.map(({ icon: Icon, label, value }, i) => (
          <motion.div key={label} {...fy(i + 2)}
            className="flex items-center gap-3 rounded-2xl bg-[#1a1a1a] border border-[#525252]/20 p-4 hover:border-[#29BA1F]/25 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#0B2928] border border-[#29BA1F]/20 flex items-center justify-center flex-shrink-0">
              <Icon size={16} className="text-[#29BA1F]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#525252]">{label}</p>
              <p className="text-sm font-bold text-white mt-0.5">{value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </ClientSubpage>
  );
}
