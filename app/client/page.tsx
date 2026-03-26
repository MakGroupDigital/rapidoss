'use client';

import { Suspense, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  IcoArrowLeft, IcoCash, IcoBike, IcoCheck, IcoChevronRight,
  IcoClock, IcoCard, IcoPin, IcoMessage, IcoNavigation,
  IcoPackage, IcoPhone, IcoPlus, IcoShield, IcoSparkle, IcoStar,
  IcoTrend, IcoUser, IcoZap,
  IcoNearMe, IcoHomePin, IcoOfficePin, IcoMarketPin, IcoOrderCTA,
} from '@/components/Icons';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

type Screen = 'home' | 'order' | 'payment' | 'tracking';
type PackageType = 'small' | 'medium';
type PaymentMethod = 'mobile' | 'cash';

const suggestions = [
  { label: 'Proche de moi',  sub: 'Position actuelle', Icon: IcoNearMe   },
  { label: 'Ma maison',      sub: 'Ngaliema',           Icon: IcoHomePin  },
  { label: 'Mon bureau',     sub: 'Gombe',              Icon: IcoOfficePin},
  { label: 'Marché',         sub: 'Marché Central',     Icon: IcoMarketPin},
];

const trackingSteps = [
  { label: 'Commande confirmée',       icon: IcoCheck },
  { label: 'Livreur assigné',          icon: IcoUser },
  { label: 'Récupération en approche', icon: IcoNavigation },
  { label: 'Livraison en cours',       icon: IcoBike },
];

const routePreview: Array<[number, number]> = [
  [-4.3276, 15.3136], [-4.3326, 15.3186], [-4.3376, 15.3236],
];

const fy = (i = 0) => ({
  initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.07, duration: 0.38, ease: 'easeOut' as const },
});

/* Pill glassmorphism — même recette que la navbar */
const pillStyle = {
  background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(18,18,18,0.98) 100%)',
  border: '1px solid rgba(41,186,31,0.15)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
  backdropFilter: 'blur(20px)',
};

const pillActiveBorder = {
  border: '1px solid rgba(41,186,31,0.3)',
  background: 'linear-gradient(135deg, rgba(11,41,40,0.9) 0%, rgba(9,140,4,0.08) 100%)',
};

export default function ClientApp() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [screen,  setScreen]  = useState<Screen>('home');
  const [pkgType, setPkgType] = useState<PackageType>('small');
  const [payment, setPayment] = useState<PaymentMethod>('mobile');
  const [order,   setOrder]   = useState({ depart:'', transit:'', destination:'', poids:'1', instructions:'' });
  const [markers, setMarkers] = useState<Array<{position:[number,number];label:string;type?:'pickup'|'dropoff'|'driver'}>>([
    { position:[-4.3276,15.3136], label:'Votre position', type:'driver' },
  ]);

  const weightPrice = Number(order.poids || 1) * 500;
  const total = 1000 + 2500 + weightPrice + (pkgType === 'medium' ? 1000 : 0);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen bg-[#121212] overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ══════════ HOME ══════════ */}
        {screen === 'home' && (
          <motion.div key="home" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="relative h-screen overflow-hidden">

            {/* Carte plein écran */}
            <div className="absolute inset-0 z-0">
              {mounted
                ? <div className="h-full w-full"><Map markers={markers} className="w-full h-full" /></div>
                : <div className="h-full w-full bg-[#0B2928]" />}
              <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/75 via-[#121212]/10 to-[#121212]/85" />
            </div>

            {/* Orbe vert */}
            <div className="absolute top-16 right-0 w-72 h-72 rounded-full bg-[#29BA1F]/6 blur-3xl pointer-events-none" />

            {/* ── Layout principal ── */}
            <div className="relative z-20 flex h-screen flex-col">

              {/* ── Header pill (haut) ── */}
              <motion.div {...fy(0)} className="flex items-center justify-between gap-3 px-4 pt-12">
                <motion.button whileTap={{ scale:0.9 }} onClick={() => router.push('/')}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-white flex-shrink-0"
                  style={pillStyle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="16" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                </motion.button>

                <motion.div animate={{ opacity:[0.75,1,0.75] }} transition={{ repeat:Infinity, duration:3 }}
                  className="flex items-center gap-2 rounded-full px-4 py-2" style={pillStyle}>
                  <motion.span animate={{ scale:[1,1.5,1], opacity:[1,0.5,1] }} transition={{ repeat:Infinity, duration:1.8 }}
                    className="w-1.5 h-1.5 rounded-full bg-[#29BA1F] block"
                    style={{ boxShadow:'0 0 6px rgba(41,186,31,0.9)' }} />
                  <span className="text-[11px] font-bold text-[#29BA1F]">24 livreurs actifs</span>
                </motion.div>

                <motion.button whileTap={{ scale:0.9 }}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-[#525252] flex-shrink-0"
                  style={pillStyle}>
                  <IcoUser size={17} />
                </motion.button>
              </motion.div>

              {/* ── Spacer + titre ── */}
              <motion.div {...fy(1)} className="px-5 mt-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#29BA1F]/70">Rapidoss · Kinshasa</p>
                <h1 className="mt-1 text-[1.85rem] font-black leading-[1.1] text-white">
                  Où livrer<br />
                  <span className="bg-gradient-to-r from-[#29BA1F] to-[#098C04] bg-clip-text text-transparent">
                    aujourd'hui ?
                  </span>
                </h1>
              </motion.div>

              {/* ── Spacer flexible ── */}
              <div className="flex-1" />

              {/* ══ ZONE BASSE FLOTTANTE ══ */}
              <div className="px-4 pb-32 space-y-3">

                {/* ── Pill champs départ / livraison ── */}
                <motion.div {...fy(2)} className="rounded-3xl overflow-hidden" style={pillStyle}>
                  {/* Ligne déco */}
                  <div className="h-px bg-gradient-to-r from-transparent via-[#29BA1F]/25 to-transparent" />

                  {/* Départ */}
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background:'linear-gradient(145deg,#29BA1F,#098C04)', boxShadow:'0 2px 10px rgba(41,186,31,0.4)' }}>
                      <IcoNavigation size={13} className="text-white" />
                    </div>
                    <input
                      type="text"
                      placeholder="Point de départ"
                      value={order.depart}
                      onChange={e=>setOrder(p=>({...p,depart:e.target.value}))}
                      className="flex-1 bg-transparent text-sm text-white placeholder-[#525252]/60 outline-none"
                    />
                    <span className="text-[10px] text-[#525252]/50 flex-shrink-0">~18 min</span>
                  </div>

                  {/* Séparateur avec dots */}
                  <div className="flex items-center gap-1.5 px-4 py-0.5">
                    <div className="w-8 flex justify-center">
                      <div className="flex flex-col gap-0.5">
                        {[0,1,2].map(i=><div key={i} className="w-1 h-1 rounded-full bg-[#525252]/30" />)}
                      </div>
                    </div>
                    <div className="flex-1 h-px bg-[#525252]/10" />
                  </div>

                  {/* Livraison */}
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background:'rgba(9,140,4,0.2)', border:'1px solid rgba(9,140,4,0.4)' }}>
                      <IcoPin size={13} className="text-[#29BA1F]" />
                    </div>
                    <input
                      type="text"
                      placeholder="Point de livraison"
                      value={order.destination}
                      onChange={e=>setOrder(p=>({...p,destination:e.target.value}))}
                      className="flex-1 bg-transparent text-sm text-white placeholder-[#525252]/60 outline-none"
                    />
                    <span className="text-[10px] text-[#525252]/50 flex-shrink-0">5.2 km</span>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-[#525252]/10 to-transparent" />
                </motion.div>

                {/* ── Bouton CTA compact — pill séparé ── */}
                <motion.div {...fy(3)} className="flex justify-center">
                  <motion.button
                    whileTap={{ scale:0.93 }}
                    onClick={() => setScreen('order')}
                    className="flex items-center gap-3 rounded-2xl px-5 py-3"
                    style={{
                      background: 'linear-gradient(145deg, #29BA1F 0%, #098C04 100%)',
                      boxShadow: '0 4px 24px rgba(41,186,31,0.45), 0 0 0 1px rgba(41,186,31,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
                    }}
                  >
                    {/* Icône CTA personnalisée */}
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(4px)' }}>
                      <IcoOrderCTA size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black text-white leading-tight">Commander</p>
                      <p className="text-[10px] text-white/60 leading-tight">Livraison instantanée</p>
                    </div>
                    <IcoChevronRight size={14} className="text-white/60 ml-1" />
                  </motion.button>
                </motion.div>

                {/* ── Suggestions — centrées ── */}
                <motion.div {...fy(4)} className="flex justify-center gap-2 px-2">
                  <div className="flex flex-wrap justify-center gap-2 max-w-md">
                    {suggestions.map((s, i) => {
                      const Icon = s.Icon;
                      return (
                        <motion.button key={s.label} whileTap={{ scale:0.88 }}
                          onClick={() => { setOrder(p=>({...p,depart:s.label})); setScreen('order'); }}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 flex-shrink-0"
                          style={pillStyle}>
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background:'rgba(11,41,40,0.9)', border:'1px solid rgba(41,186,31,0.18)' }}>
                            <Icon size={12} className="text-[#29BA1F]" />
                          </div>
                          <p className="text-[10px] font-semibold text-white/80 whitespace-nowrap">{s.label}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

              </div>
            </div>

            <BottomNav role="client" />
          </motion.div>
        )}

        {/* ══════════ ORDER ══════════ */}
        {screen === 'order' && (
          <motion.main key="order"
            initial={{ x:'100%', opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:'-100%', opacity:0 }}
            transition={{ type:'spring', damping:28, stiffness:240 }}
            className="min-h-screen bg-[#121212] pb-32">

            {/* Header pill flottant */}
            <div className="sticky top-0 z-20 px-4 pt-4 pb-2"
              style={{ background:'linear-gradient(to bottom, #121212 60%, transparent)' }}>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={pillStyle}>
                <motion.button whileTap={{ scale:0.9 }} onClick={() => setScreen('home')}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#29BA1F] flex-shrink-0"
                  style={{ background:'rgba(11,41,40,0.8)', border:'1px solid rgba(41,186,31,0.25)' }}>
                  <IcoArrowLeft size={16} />
                </motion.button>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#29BA1F]">Étape 1 / 3</p>
                  <p className="text-sm font-black text-white leading-tight">Détails de la course</p>
                </div>
                <div className="rounded-full px-2.5 py-1 text-[9px] font-bold text-[#29BA1F]"
                  style={{ background:'rgba(11,41,40,0.8)', border:'1px solid rgba(41,186,31,0.25)' }}>
                  Live
                </div>
              </div>
              {/* Progress */}
              <div className="mt-2 h-0.5 rounded-full bg-[#1a1a1a] overflow-hidden mx-1">
                <motion.div initial={{ width:0 }} animate={{ width:'33%' }} transition={{ duration:0.6, ease:'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-[#29BA1F] to-[#098C04]" />
              </div>
            </div>

            <section className="mx-auto flex max-w-md flex-col gap-3 px-4 pt-2">

              {/* Itinéraire */}
              <motion.div {...fy(0)} className="rounded-3xl p-5" style={pillStyle}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#525252]">Itinéraire</p>
                    <p className="text-sm font-black text-white mt-0.5">Paramètres de livraison</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background:'linear-gradient(145deg,#29BA1F,#098C04)', boxShadow:'0 3px 12px rgba(41,186,31,0.35)' }}>
                    <IcoNavigation size={14} className="text-white" />
                  </div>
                </div>
                <div className="relative space-y-2.5">
                  <div className="absolute left-[18px] top-7 bottom-7 w-px bg-gradient-to-b from-[#29BA1F]/60 via-[#098C04]/30 to-[#525252]/20" />
                  <LocField icon={<IcoNavigation size={13}/>} dot="bg-[#29BA1F]"
                    placeholder="Point de départ" value={order.depart} onChange={v=>setOrder(p=>({...p,depart:v}))} />
                  <LocField icon={<IcoPlus size={13}/>} dot="bg-[#525252]/50"
                    placeholder="Transit (optionnel)" value={order.transit} onChange={v=>setOrder(p=>({...p,transit:v}))} />
                  <LocField icon={<IcoPin size={13}/>} dot="bg-[#098C04]"
                    placeholder="Destination" value={order.destination} onChange={v=>setOrder(p=>({...p,destination:v}))} />
                </div>
              </motion.div>

              {/* Colis */}
              <motion.div {...fy(1)} className="rounded-3xl p-5" style={pillStyle}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#525252]">Colis</p>
                    <p className="text-sm font-black text-white mt-0.5">Format & consignes</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background:'rgba(82,82,82,0.2)', border:'1px solid rgba(82,82,82,0.3)' }}>
                    <IcoPackage size={14} className="text-[#525252]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {([
                    { key:'small',  label:'Document',  sub:'Léger',   icon:'📄' },
                    { key:'medium', label:'Carton',     sub:'Volume',  icon:'📦' },
                  ] as const).map(opt => (
                    <motion.button key={opt.key} whileTap={{ scale:0.95 }}
                      onClick={() => setPkgType(opt.key)}
                      className="rounded-2xl p-4 text-left transition-all"
                      style={pkgType===opt.key ? pillActiveBorder : { background:'rgba(18,18,18,0.8)', border:'1px solid rgba(82,82,82,0.2)' }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5"
                        style={pkgType===opt.key
                          ? { background:'rgba(11,41,40,0.9)', border:'1px solid rgba(41,186,31,0.3)' }
                          : { background:'rgba(26,26,26,0.8)', border:'1px solid rgba(82,82,82,0.2)' }}>
                        <IcoPackage size={14} className={pkgType===opt.key ? 'text-[#29BA1F]' : 'text-[#525252]'} />
                      </div>
                      <p className={`text-xs font-bold ${pkgType===opt.key?'text-white':'text-[#525252]'}`}>{opt.label}</p>
                      <p className={`text-[10px] mt-0.5 ${pkgType===opt.key?'text-[#29BA1F]/60':'text-[#525252]/50'}`}>{opt.sub}</p>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-[1fr_auto] items-end gap-2.5">
                  <label className="block">
                    <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-widest text-[#525252]">Poids (kg)</span>
                    <input type="number" min="1" value={order.poids}
                      onChange={e=>setOrder(p=>({...p,poids:e.target.value}))}
                      className="w-full rounded-2xl px-4 py-3 text-sm text-white outline-none transition"
                      style={{ background:'rgba(18,18,18,0.9)', border:'1px solid rgba(82,82,82,0.25)' }}
                      onFocus={e=>(e.target.style.borderColor='rgba(41,186,31,0.5)')}
                      onBlur={e=>(e.target.style.borderColor='rgba(82,82,82,0.25)')} />
                  </label>
                  <div className="rounded-2xl px-4 py-3 text-right" style={pillActiveBorder}>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#29BA1F]">+</p>
                    <p className="text-base font-black text-white">{weightPrice}<span className="text-[10px] text-[#525252] ml-0.5">FC</span></p>
                  </div>
                </div>

                <label className="mt-3 block">
                  <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-widest text-[#525252]">Instructions</span>
                  <textarea value={order.instructions}
                    onChange={e=>setOrder(p=>({...p,instructions:e.target.value}))}
                    placeholder="Ex: appeler avant d'arriver..."
                    className="h-20 w-full resize-none rounded-2xl px-4 py-3 text-sm text-white placeholder-[#525252]/50 outline-none transition"
                    style={{ background:'rgba(18,18,18,0.9)', border:'1px solid rgba(82,82,82,0.25)' }} />
                </label>
              </motion.div>

              {/* Shield pill */}
              <motion.div {...fy(2)} className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
                style={{ background:'rgba(11,41,40,0.6)', border:'1px solid rgba(41,186,31,0.18)' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background:'linear-gradient(145deg,#29BA1F,#098C04)', boxShadow:'0 2px 10px rgba(41,186,31,0.3)' }}>
                  <IcoShield size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Protection de la course</p>
                  <p className="text-[10px] text-[#525252] mt-0.5">Suivi temps réel · Livreur vérifié</p>
                </div>
              </motion.div>
            </section>

            {/* Footer pill flottant */}
            <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-5"
              style={{ background:'linear-gradient(to top, #121212 60%, transparent)' }}>
              <div className="flex w-full max-w-md items-center gap-3 rounded-2xl px-4 py-3" style={pillStyle}>
                <div className="flex-shrink-0">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#525252]">Estimation</p>
                  <p className="text-xl font-black text-white leading-tight">{total}<span className="text-xs text-[#525252] ml-1">FC</span></p>
                </div>
                <motion.button whileTap={{ scale:0.97 }} onClick={() => {
                  setMarkers([
                    { position:[-4.3276,15.3136], label:'Départ',     type:'pickup'  },
                    { position:[-4.3376,15.3236], label:'Destination', type:'dropoff' },
                  ]);
                  setScreen('payment');
                }} className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white"
                  style={{ background:'linear-gradient(145deg,#29BA1F,#098C04)', boxShadow:'0 4px 16px rgba(41,186,31,0.35)' }}>
                  <IcoZap size={14} /> Continuer <IcoChevronRight size={13} />
                </motion.button>
              </div>
            </div>
          </motion.main>
        )}

        {/* ══════════ PAYMENT ══════════ */}
        {screen === 'payment' && (
          <motion.main key="payment"
            initial={{ x:'100%', opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:'-100%', opacity:0 }}
            transition={{ type:'spring', damping:28, stiffness:240 }}
            className="min-h-screen bg-[#121212] pb-32">

            <div className="sticky top-0 z-20 px-4 pt-4 pb-2"
              style={{ background:'linear-gradient(to bottom, #121212 60%, transparent)' }}>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={pillStyle}>
                <motion.button whileTap={{ scale:0.9 }} onClick={() => setScreen('order')}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#29BA1F] flex-shrink-0"
                  style={{ background:'rgba(11,41,40,0.8)', border:'1px solid rgba(41,186,31,0.25)' }}>
                  <IcoArrowLeft size={16} />
                </motion.button>
                <div className="flex-1">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#29BA1F]">Étape 2 / 3</p>
                  <p className="text-sm font-black text-white leading-tight">Paiement & confirmation</p>
                </div>
              </div>
              <div className="mt-2 h-0.5 rounded-full bg-[#1a1a1a] overflow-hidden mx-1">
                <motion.div initial={{ width:'33%' }} animate={{ width:'66%' }} transition={{ duration:0.6, ease:'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-[#29BA1F] to-[#098C04]" />
              </div>
            </div>

            <section className="mx-auto flex max-w-md flex-col gap-3 px-4 pt-2">

              {/* Mini carte */}
              <motion.div {...fy(0)} className="overflow-hidden rounded-3xl" style={pillStyle}>
                <div className="h-40">
                  <Suspense fallback={<div className="h-full w-full bg-[#0B2928] animate-pulse" />}>
                    <Map markers={markers} route={routePreview} />
                  </Suspense>
                </div>
                <div className="grid grid-cols-2 divide-x" style={{ borderTop:'1px solid rgba(82,82,82,0.2)', borderColor:'rgba(82,82,82,0.15)' }}>
                  <div className="p-3.5">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#525252]">Départ</p>
                    <p className="mt-1 text-xs font-bold text-white">{order.depart || 'Position actuelle'}</p>
                  </div>
                  <div className="p-3.5">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#525252]">Destination</p>
                    <p className="mt-1 text-xs font-bold text-white">{order.destination || 'Adresse client'}</p>
                  </div>
                </div>
              </motion.div>

              {/* Prix */}
              <motion.div {...fy(1)} className="rounded-3xl p-5" style={pillStyle}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-black text-white">Détail du prix</p>
                  <span className="rounded-full px-2.5 py-1 text-[10px] font-bold text-[#29BA1F]"
                    style={{ background:'rgba(11,41,40,0.8)', border:'1px solid rgba(41,186,31,0.25)' }}>5.2 km</span>
                </div>
                <div className="space-y-2.5">
                  <PriceRow label="Tarif de base" value="1 000 FC" />
                  <PriceRow label="Distance"      value="2 500 FC" />
                  <PriceRow label={`Poids (${order.poids||1} kg)`} value={`${weightPrice} FC`} />
                  {pkgType==='medium' && <PriceRow label="Volume supplémentaire" value="1 000 FC" />}
                </div>
                <div className="mt-4 rounded-2xl px-4 py-4 flex items-center justify-between" style={pillActiveBorder}>
                  <span className="text-xs text-[#525252]">Total à payer</span>
                  <span className="text-xl font-black text-white">{total}<span className="text-xs text-[#525252] ml-1">FC</span></span>
                </div>
              </motion.div>

              {/* Paiement */}
              <motion.div {...fy(2)} className="rounded-3xl p-5" style={pillStyle}>
                <p className="text-sm font-black text-white mb-3">Moyen de paiement</p>
                <div className="space-y-2.5">
                  <PayOption active={payment==='mobile'} title="Payer maintenant"
                    sub="Mobile Money · Carte · Wallet" icon={<IcoCard size={16}/>}
                    onClick={() => setPayment('mobile')} />
                  <PayOption active={payment==='cash'} title="Payer à la récupération"
                    sub="Espèces remises au livreur" icon={<IcoCash size={16}/>}
                    onClick={() => setPayment('cash')} />
                </div>
              </motion.div>
            </section>

            <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-5"
              style={{ background:'linear-gradient(to top, #121212 60%, transparent)' }}>
              <div className="flex w-full max-w-md items-center gap-3 rounded-2xl px-4 py-3" style={pillStyle}>
                <div className="flex-shrink-0">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#525252]">Prêt</p>
                  <p className="text-xs font-bold text-white">{payment==='mobile'?'Paiement immédiat':'Espèces'}</p>
                </div>
                <motion.button whileTap={{ scale:0.97 }} onClick={() => setScreen('tracking')}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white"
                  style={{ background:'linear-gradient(145deg,#29BA1F,#098C04)', boxShadow:'0 4px 16px rgba(41,186,31,0.35)' }}>
                  <IcoZap size={14} /> Commander <IcoChevronRight size={13} />
                </motion.button>
              </div>
            </div>
          </motion.main>
        )}

        {/* ══════════ TRACKING ══════════ */}
        {screen === 'tracking' && (
          <motion.main key="tracking" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="relative h-screen overflow-hidden">

            <div className="absolute inset-0 z-0">
              <Suspense fallback={<div className="h-full w-full bg-[#0B2928]" />}>
                <Map markers={[...markers,{position:[-4.33,15.315],label:'Livreur',type:'driver'}]}
                  route={[[-4.33,15.315],[-4.3276,15.3136]]} />
              </Suspense>
              <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/50 via-transparent to-[#121212]/95" />
            </div>

            <div className="relative z-10 flex h-screen flex-col px-4 pt-12 pb-6">

              {/* Header pill */}
              <motion.div initial={{ y:-20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.1 }}
                className="flex items-center justify-between gap-3">
                <motion.button whileTap={{ scale:0.9 }} onClick={() => setScreen('home')}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                  style={pillStyle}>
                  <IcoArrowLeft size={16} />
                </motion.button>
                <motion.div animate={{ opacity:[0.8,1,0.8] }} transition={{ repeat:Infinity, duration:2.5 }}
                  className="flex items-center gap-2 rounded-full px-4 py-2.5"
                  style={pillStyle}>
                  <IcoClock size={13} className="text-[#29BA1F]" />
                  <span className="text-sm font-bold text-white">15 min restants</span>
                </motion.div>
              </motion.div>

              {/* Bottom sheet pill */}
              <motion.div initial={{ y:80, opacity:0 }} animate={{ y:0, opacity:1 }}
                transition={{ delay:0.2, type:'spring', damping:26 }}
                className="mt-auto rounded-3xl p-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(26,26,26,0.98) 0%, rgba(18,18,18,1) 100%)',
                  border: '1px solid rgba(41,186,31,0.25)',
                  boxShadow: '0 -20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(41,186,31,0.08)',
                  backdropFilter: 'blur(24px)',
                }}>

                {/* Handle */}
                <div className="mx-auto w-10 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#29BA1F]/40 to-transparent mb-4" />

                {/* Status */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#29BA1F]">Suivi actif</p>
                    <h2 className="mt-1 text-lg font-black text-white">Livreur en route</h2>
                    <p className="mt-0.5 text-xs text-[#525252]">Approche du point de départ</p>
                  </div>
                  <motion.div animate={{ scale:[1,1.08,1] }} transition={{ repeat:Infinity, duration:2 }}
                    className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background:'linear-gradient(145deg,#29BA1F,#098C04)', boxShadow:'0 4px 16px rgba(41,186,31,0.4)' }}>
                    <IcoBike size={18} className="text-white" />
                  </motion.div>
                </div>

                {/* Livreur pill */}
                <div className="rounded-2xl p-4 mb-3" style={pillStyle}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background:'linear-gradient(145deg,#29BA1F,#098C04)', boxShadow:'0 3px 12px rgba(41,186,31,0.35)' }}>
                      <IcoUser size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-sm">Didier K.</span>
                        <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-amber-400"
                          style={{ background:'rgba(26,26,26,0.8)', border:'1px solid rgba(82,82,82,0.25)' }}>
                          <IcoStar size={9} filled /> 4.9
                        </span>
                      </div>
                      <p className="text-[10px] text-[#525252] mt-0.5">Honda PCX · AB-123-CD</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <motion.button whileTap={{ scale:0.95 }}
                      className="flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-bold text-white"
                      style={{ background:'rgba(18,18,18,0.9)', border:'1px solid rgba(82,82,82,0.25)' }}>
                      <IcoMessage size={13}/> Message
                    </motion.button>
                    <motion.button whileTap={{ scale:0.95 }}
                      className="flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-bold text-white"
                      style={{ background:'linear-gradient(145deg,#29BA1F,#098C04)', boxShadow:'0 3px 10px rgba(41,186,31,0.3)' }}>
                      <IcoPhone size={13}/> Appeler
                    </motion.button>
                  </div>
                </div>

                {/* Progression pill */}
                <div className="rounded-2xl p-4" style={{ background:'rgba(18,18,18,0.8)', border:'1px solid rgba(82,82,82,0.15)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-black text-white">Progression</p>
                    <span className="text-[10px] font-bold text-[#29BA1F]">2 / 4</span>
                  </div>
                  <div className="space-y-2.5">
                    {trackingSteps.map((step, i) => {
                      const Icon = step.icon;
                      const done = i < 2;
                      return (
                        <motion.div key={step.label}
                          initial={{ x:-8, opacity:0 }} animate={{ x:0, opacity:1 }}
                          transition={{ delay:0.3+i*0.07 }}
                          className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                            style={done
                              ? { background:'linear-gradient(145deg,#29BA1F,#098C04)', boxShadow:'0 2px 8px rgba(41,186,31,0.35)' }
                              : { background:'rgba(26,26,26,0.8)', border:'1px solid rgba(82,82,82,0.25)' }}>
                            {done
                              ? <Icon size={11} className="text-white" />
                              : <span className="text-[9px] font-bold text-[#525252]">{i+1}</span>}
                          </div>
                          <p className={`text-xs font-semibold ${done?'text-white':'text-[#525252]'}`}>{step.label}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>

            <BottomNav role="client" />
          </motion.main>
        )}

      </AnimatePresence>
    </div>
  );
}

/* ── Sub-components ── */

function GlassInput({ icon, placeholder, value, onChange, accent }: {
  icon: React.ReactNode; placeholder: string; value: string;
  onChange: (v: string) => void; accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all"
      style={accent
        ? { background:'rgba(11,41,40,0.7)', border:'1px solid rgba(41,186,31,0.25)' }
        : { background:'rgba(18,18,18,0.8)', border:'1px solid rgba(82,82,82,0.2)' }}>
      <span className={accent ? 'text-[#29BA1F]' : 'text-[#525252]'}>{icon}</span>
      <input type="text" placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)}
        className="flex-1 bg-transparent text-sm text-white placeholder-[#525252]/60 outline-none" />
    </div>
  );
}

function LocField({ icon, dot, placeholder, value, onChange }: {
  icon: React.ReactNode; dot: string; placeholder: string;
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="relative z-10 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${dot === 'bg-[#29BA1F]' ? 'text-white' : dot === 'bg-[#098C04]' ? 'text-white' : 'text-[#525252]'}`}
        style={dot === 'bg-[#29BA1F]'
          ? { background:'linear-gradient(145deg,#29BA1F,#098C04)', boxShadow:'0 2px 8px rgba(41,186,31,0.3)' }
          : dot === 'bg-[#098C04]'
          ? { background:'rgba(9,140,4,0.3)', border:'1px solid rgba(9,140,4,0.4)' }
          : { background:'rgba(26,26,26,0.8)', border:'1px solid rgba(82,82,82,0.25)' }}>
        {icon}
      </div>
      <input type="text" placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)}
        className="flex-1 rounded-2xl px-4 py-3 text-sm text-white placeholder-[#525252]/50 outline-none transition"
        style={{ background:'rgba(18,18,18,0.8)', border:'1px solid rgba(82,82,82,0.2)' }}
        onFocus={e=>(e.target.style.borderColor='rgba(41,186,31,0.4)')}
        onBlur={e=>(e.target.style.borderColor='rgba(82,82,82,0.2)')} />
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-[#525252]">{label}</span>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}

function PayOption({ active, title, sub, icon, onClick }: {
  active: boolean; title: string; sub: string;
  icon: React.ReactNode; onClick: () => void;
}) {
  return (
    <motion.button whileTap={{ scale:0.97 }} onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl p-4 text-left transition-all"
      style={active ? pillActiveBorder : { background:'rgba(18,18,18,0.8)', border:'1px solid rgba(82,82,82,0.2)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={active
          ? { background:'rgba(11,41,40,0.9)', border:'1px solid rgba(41,186,31,0.3)' }
          : { background:'rgba(26,26,26,0.8)', border:'1px solid rgba(82,82,82,0.2)' }}>
        <span className={active ? 'text-[#29BA1F]' : 'text-[#525252]'}>{icon}</span>
      </div>
      <div className="flex-1">
        <p className={`text-xs font-bold ${active?'text-white':'text-[#525252]'}`}>{title}</p>
        <p className={`text-[10px] mt-0.5 ${active?'text-[#29BA1F]/60':'text-[#525252]/50'}`}>{sub}</p>
      </div>
      {active && (
        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background:'linear-gradient(145deg,#29BA1F,#098C04)' }}>
          <IcoCheck size={11} className="text-white" />
        </div>
      )}
    </motion.button>
  );
}
