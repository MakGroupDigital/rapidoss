'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import ClientSubpage from '@/components/ClientSubpage';
import { IcoUser, IcoPhone, IcoPin, IcoShield, IcoStar, IcoCheck, IcoHistory, IcoLogout } from '@/components/Icons';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { logout } from '@/lib/user-profile';

const fy = (i = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' as const },
});

export default function ClientProfilePage() {
  const router = useRouter();
  const { isLoading, isAuthorized, profile } = useProtectedRoute('client');

  if (isLoading || !isAuthorized) {
    return <div className="min-h-screen bg-[#121212]" />;
  }

  const fullName = profile?.fullName ?? 'Client Rapidoss';
  const phone = profile?.phone || '+243 900 000 000';
  const location = profile?.locationLabel || 'Kinshasa, RDC';
  const photoURL = profile?.photoURL ?? '';

  const profileRows = [
    { icon: IcoUser, label: 'Nom', value: fullName },
    { icon: IcoPhone, label: 'Téléphone', value: phone },
    { icon: IcoPin, label: 'Adresse', value: location },
    { icon: IcoHistory, label: 'Compte', value: profile?.onboardingCompleted ? 'Profil complété' : 'À finaliser' },
  ];

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <ClientSubpage
      title="Profil"
      description="Vos informations personnelles"
      icon={<IcoUser size={18} className="text-white" />}
      badge="Compte vérifié"
      stats={[
        { label: 'Statut', value: profile?.onboardingCompleted ? 'Actif' : 'Incomplet' },
        { label: 'Rôle', value: 'Client' },
        { label: 'Note', value: '4.9' },
      ]}
    >
      <motion.div {...fy(0)} className="rounded-3xl border border-[#525252]/20 bg-[#1a1a1a] p-5">
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29BA1F] to-[#098C04] bg-cover bg-center shadow-lg shadow-[#29BA1F]/30"
            style={{ backgroundImage: photoURL ? `url(${photoURL})` : undefined }}
          >
            {!photoURL ? <IcoUser size={28} className="text-white" strokeWidth={1.8} /> : null}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-base font-black text-white">{fullName}</h2>
              <div className="flex flex-shrink-0 items-center gap-1 rounded-full border border-[#29BA1F]/25 bg-[#0B2928] px-2 py-0.5">
                <IcoStar size={10} className="text-amber-400" filled />
                <span className="text-[10px] font-bold text-amber-400">4.9</span>
              </div>
            </div>
            <p className="mt-0.5 text-xs text-[#525252]">Compte principal · {location}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <IcoCheck size={12} className="text-[#29BA1F]" />
              <span className="text-[10px] font-bold text-[#29BA1F]">
                {profile?.onboardingCompleted ? 'Profil vérifié' : 'Profil en attente'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div {...fy(1)} className="rounded-2xl border border-[#29BA1F]/20 bg-[#0B2928] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#29BA1F] to-[#098C04] shadow-md shadow-[#29BA1F]/25">
            <IcoShield size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Sécurité du compte</p>
            <p className="mt-0.5 text-xs text-[#525252]">Google connecté · Numéro enregistré · Position autorisée</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-2">
        {profileRows.map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            {...fy(i + 2)}
            className="flex items-center gap-3 rounded-2xl border border-[#525252]/20 bg-[#1a1a1a] p-4 transition-colors hover:border-[#29BA1F]/25"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#29BA1F]/20 bg-[#0B2928]">
              <Icon size={16} className="text-[#29BA1F]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#525252]">{label}</p>
              <p className="mt-0.5 text-sm font-bold text-white">{value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        {...fy(profileRows.length + 2)}
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-[#1a1a1a] p-4 text-sm font-bold text-red-400 transition-colors hover:border-red-500/35"
      >
        <IcoLogout size={18} />
        Déconnexion
      </motion.button>
    </ClientSubpage>
  );
}
