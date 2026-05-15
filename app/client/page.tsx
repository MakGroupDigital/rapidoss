'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  IcoCash, IcoCheck, IcoChevronRight, IcoCard, IcoPin, IcoNavigation,
  IcoPlus, IcoStar, IcoUser, IcoZap,
} from '@/components/Icons';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import OrderDocumentCard from '@/components/OrderDocumentCard';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import LocationAutocomplete from '@/components/LocationAutocomplete';
import { calculateDistance, estimateTime, type GeocodeResult } from '@/lib/google-geocoding';
import { type KinshasaLocation } from '@/lib/kinshasa-locations';
import { getDriversNearLocation, type Driver } from '@/lib/drivers';
import { createDeliveryOrder, subscribeToOrder, type DeliveryOrder, type OrderStatus } from '@/lib/orders';
import { calculateDeliveryPrice, type PackageSize } from '@/lib/pricing';
import { createOrderDocumentNumber, generateOrderDocumentImage, type OrderDocumentType } from '@/lib/order-document';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

type OrderStep = 'location' | 'details' | 'payment' | 'tracking';
type PaymentMethod = 'mobile' | 'cash';
type ActiveAddressField = 'depart' | 'destination' | null;

const packageSizeOptions: Array<{ value: PackageSize; label: string; hint: string }> = [
  { value: 'small', label: 'Petit', hint: 'Documents, clés' },
  { value: 'medium', label: 'Moyen', hint: 'Sac, boîte' },
  { value: 'large', label: 'Grand', hint: 'Gros colis' },
];

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
  const { isLoading, isAuthorized, profile } = useProtectedRoute('client');
  const [mounted, setMounted] = useState(false);
  
  // Location & drivers
  const [depart, setDepart] = useState('');
  const [destination, setDestination] = useState('');
  const [departCoords, setDepartCoords] = useState<[number, number] | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [activeAddressField, setActiveAddressField] = useState<ActiveAddressField>(null);
  
  // Order details
  const [orderStep, setOrderStep] = useState<OrderStep>('location');
  const [stops, setStops] = useState<string[]>([]);
  const [packageWeight, setPackageWeight] = useState('1');
  const [packageSize, setPackageSize] = useState<PackageSize>('small');
  const [instructions, setInstructions] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>('mobile');
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<DeliveryOrder | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const userName = profile?.fullName?.split(' ')[0] ?? '';
  const availableDrivers =
    departCoords && destinationCoords
      ? getDriversNearLocation(departCoords[0], departCoords[1], 10)
      : [];
  const markers: Array<{ position: [number, number]; label: string; type?: 'pickup' | 'dropoff' | 'driver'; driver?: Driver }> =
    departCoords && destinationCoords
      ? [
          { position: departCoords, label: 'Départ', type: 'pickup' },
          { position: destinationCoords, label: 'Destination', type: 'dropoff' },
          ...availableDrivers.map((driver) => ({
            position: [driver.lat, driver.lng] as [number, number],
            label: driver.name,
            type: 'driver' as const,
            driver,
          })),
        ]
      : [{ position: [-4.3276, 15.3136], label: 'Votre position', type: 'driver' }];
  const route: Array<[number, number]> =
    departCoords && destinationCoords
      ? selectedDriver
        ? [[selectedDriver.lat, selectedDriver.lng], departCoords, destinationCoords]
        : [departCoords, destinationCoords]
      : [];
  const deliveryDistance =
    departCoords && destinationCoords
      ? calculateDistance(departCoords[0], departCoords[1], destinationCoords[0], destinationCoords[1])
      : 0;
  const deliveryEta = estimateTime(deliveryDistance);
  const { basePrice, distancePrice, weightPrice, sizePrice, total } = calculateDeliveryPrice({
    distanceKm: deliveryDistance,
    weightKg: Number(packageWeight || 1),
    packageSize,
  });
  const trackingStatuses: OrderStatus[] = ['confirmed', 'driver_assigned', 'picked_up', 'completed'];
  const trackingStage = currentOrder ? Math.max(trackingStatuses.indexOf(currentOrder.status), 0) : 0;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!currentOrderId) {
      setCurrentOrder(null);
      return;
    }

    const unsubscribe = subscribeToOrder(currentOrderId, (order) => {
      setCurrentOrder(order);
    });

    return unsubscribe;
  }, [currentOrderId]);

  const handleLocationSelect = (location: GeocodeResult | KinshasaLocation, type: 'depart' | 'destination') => {
    const coords: [number, number] = [location.lat, location.lng];
    
    if (type === 'depart') {
      setDepart(location.name);
      setDepartCoords(coords);
    } else {
      setDestination(location.name);
      setDestinationCoords(coords);
    }

    setActiveAddressField(null);
  };

  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver);
    setOrderStep('details');
  };

  const handleBackToLocation = () => {
    setSelectedDriver(null);
    setOrderStep('location');
    setStops([]);
    setPackageWeight('1');
    setPackageSize('small');
    setInstructions('');
  };

  const handleGoToPayment = () => {
    if (!departCoords || !destinationCoords || !selectedDriver) {
      return;
    }

    setOrderStep('payment');
  };

  const handleConfirmOrder = () => {
    if (!selectedDriver || !departCoords || !destinationCoords || !profile) {
      return;
    }

    void (async () => {
      setIsSubmittingOrder(true);

      try {
        const documentType: OrderDocumentType = payment === 'mobile' ? 'receipt' : 'invoice';
        const documentNumber = createOrderDocumentNumber(documentType);
        const documentImageUrl = await generateOrderDocumentImage({
          documentType,
          documentNumber,
          userName: profile.fullName,
          driverName: selectedDriver.name,
          departure: depart,
          destination,
          paymentMethod: payment,
          packageSize,
          weight: Number(packageWeight || 1),
          distanceKm: Number(deliveryDistance.toFixed(2)),
          etaMinutes: deliveryEta.minutes,
          basePrice,
          distancePrice,
          weightPrice,
          sizePrice,
          total,
        });

        const orderId = await createDeliveryOrder({
          userId: profile.uid,
          userName: profile.fullName,
          userPhone: profile.phone,
          driverId: selectedDriver.id,
          driverName: selectedDriver.name,
          driverPhone: selectedDriver.phone,
          driverPlate: selectedDriver.plate,
          departure: depart,
          destination,
          departureCoords: { lat: departCoords[0], lng: departCoords[1] },
          destinationCoords: { lat: destinationCoords[0], lng: destinationCoords[1] },
          stops: stops.filter(Boolean),
          weight: Number(packageWeight || 1),
          packageSize,
          instructions,
          paymentMethod: payment,
          price: total,
          distanceKm: Number(deliveryDistance.toFixed(2)),
          etaMinutes: deliveryEta.minutes,
          documentType,
          documentNumber,
          documentImageUrl,
        });

        setCurrentOrderId(orderId);
        setOrderStep('tracking');
      } finally {
        setIsSubmittingOrder(false);
      }
    })();
  };

  const handleStartNewOrder = () => {
    setDepart('');
    setDestination('');
    setDepartCoords(null);
    setDestinationCoords(null);
    setSelectedDriver(null);
    setStops([]);
    setPackageWeight('1');
    setPackageSize('small');
    setInstructions('');
    setPayment('mobile');
    setCurrentOrderId(null);
    setCurrentOrder(null);
    setOrderStep('location');
  };

  if (isLoading || !isAuthorized) {
    return <div className="min-h-screen bg-[#121212]" />;
  }

  return (
    <div className="min-h-screen bg-[#121212] overflow-hidden">
      <div className="relative h-screen overflow-hidden">

        {/* Carte plein écran */}
        <div className="absolute inset-0 z-0">
          {mounted
            ? <div className="h-full w-full">
                <Map 
                  markers={markers} 
                  route={route}
                  className="w-full h-full"
                  onMarkerClick={(marker) => {
                    if (marker.driver) {
                      handleDriverSelect(marker.driver);
                    }
                  }}
                />
              </div>
            : <div className="h-full w-full bg-[#0B2928]" />}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#121212]/75 via-[#121212]/10 to-[#121212]/85" />
        </div>

        {/* Orbe vert */}
        <div className="absolute top-16 right-0 w-72 h-72 rounded-full bg-[#29BA1F]/6 blur-3xl pointer-events-none" />

        {/* Layout principal */}
        <div className="pointer-events-none relative z-20 flex h-screen flex-col">

          {/* Header */}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 pt-12">
            <motion.button whileTap={{ scale:0.9 }} onClick={() => router.push('/')}
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-white flex-shrink-0" style={pillStyle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="16" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </motion.button>

            <motion.div animate={{ opacity:[0.75,1,0.75] }} transition={{ repeat:Infinity, duration:3 }}
              className="flex items-center gap-2 rounded-full px-4 py-2" style={pillStyle}>
              <motion.span animate={{ scale:[1,1.5,1], opacity:[1,0.5,1] }} transition={{ repeat:Infinity, duration:1.8 }}
                className="w-1.5 h-1.5 rounded-full bg-[#29BA1F] block"
                style={{ boxShadow:'0 0 6px rgba(41,186,31,0.9)' }} />
              <span className="text-[11px] font-bold text-[#29BA1F]">{availableDrivers.length} livreurs actifs</span>
            </motion.div>

            <motion.button whileTap={{ scale:0.9 }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-[#525252] flex-shrink-0" style={pillStyle}>
              <IcoUser size={17} />
            </motion.button>
          </motion.div>

          {/* Titre */}
          {orderStep === 'location' && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="px-5 mt-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#29BA1F]/70">
                {userName ? `Bienvenue, ${userName}` : 'Rapidoss · Kinshasa'}
              </p>
              <h1 className="mt-1 text-[1.85rem] font-black leading-[1.1] text-white">
                Où livrer<br />
                <span className="bg-gradient-to-r from-[#29BA1F] to-[#098C04] bg-clip-text text-transparent">
                  aujourd&apos;hui ?
                </span>
              </h1>
            </motion.div>
          )}

          <div className="flex-1" />

          {/* Zone basse - Champs de localisation OU Détails de commande */}
          <div className="pointer-events-auto px-4 pb-32 space-y-3">

            {orderStep === 'location' && (
              <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                className="rounded-3xl overflow-visible" style={pillStyle}>
                <div className="h-px bg-gradient-to-r from-transparent via-[#29BA1F]/25 to-transparent" />

                <LocationAutocomplete
                  placeholder="Point de départ"
                  value={depart}
                  onChange={(value) => setDepart(value)}
                  onSelect={(location) => handleLocationSelect(location, 'depart')}
                  icon={<IcoNavigation size={13} className="text-white" />}
                  accent={true}
                  suggestionsPlacement="up"
                  isActive={activeAddressField === 'depart'}
                  onFocus={() => setActiveAddressField('depart')}
                />

                <div className="flex items-center gap-1.5 px-4 py-0.5">
                  <div className="w-8 flex justify-center">
                    <div className="flex flex-col gap-0.5">
                      {[0,1,2].map(i=><div key={i} className="w-1 h-1 rounded-full bg-[#525252]/30" />)}
                    </div>
                  </div>
                  <div className="flex-1 h-px bg-[#525252]/10" />
                </div>

                <LocationAutocomplete
                  placeholder="Point de livraison"
                  value={destination}
                  onChange={(value) => setDestination(value)}
                  onSelect={(location) => handleLocationSelect(location, 'destination')}
                  icon={<IcoPin size={13} className="text-[#29BA1F]" />}
                  accent={false}
                  suggestionsPlacement="up"
                  isActive={activeAddressField === 'destination'}
                  onFocus={() => setActiveAddressField('destination')}
                />

                <div className="h-px bg-gradient-to-r from-transparent via-[#525252]/10 to-transparent" />
              </motion.div>
            )}

            {/* Détails de commande - Affichage en bas */}
            {orderStep === 'details' && selectedDriver && (
              <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                className="rounded-3xl p-5 max-h-96 overflow-y-auto" style={pillStyle}>
                
                {/* Header avec retour */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#29BA1F]">Détails de la course</p>
                    <p className="text-sm font-black text-white mt-0.5">{selectedDriver.name}</p>
                  </div>
                  <motion.button whileTap={{ scale:0.9 }} onClick={handleBackToLocation}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-[#525252] flex-shrink-0"
                    style={{ background:'rgba(18,18,18,0.8)', border:'1px solid rgba(82,82,82,0.2)' }}>
                    ✕
                  </motion.button>
                </div>

                {/* Livreur */}
                <div className="rounded-2xl p-3 mb-3" style={{ background:'rgba(18,18,18,0.8)', border:'1px solid rgba(82,82,82,0.2)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background:'linear-gradient(145deg,#29BA1F,#098C04)', boxShadow:'0 2px 8px rgba(41,186,31,0.3)' }}>
                      <IcoUser size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-white text-xs">{selectedDriver.name}</span>
                        <span className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-amber-400"
                          style={{ background:'rgba(26,26,26,0.8)', border:'1px solid rgba(82,82,82,0.25)' }}>
                          <IcoStar size={8} filled /> {selectedDriver.rating}
                        </span>
                      </div>
                      <p className="text-[9px] text-[#525252] mt-0.5">{selectedDriver.plate}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-3 gap-2">
                  <div className="rounded-xl p-2" style={{ background:'rgba(11,41,40,0.45)', border:'1px solid rgba(41,186,31,0.18)' }}>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-[#29BA1F]/70">Distance</p>
                    <p className="mt-0.5 text-xs font-black text-white">{deliveryDistance.toFixed(1)} km</p>
                  </div>
                  <div className="rounded-xl p-2" style={{ background:'rgba(18,18,18,0.8)', border:'1px solid rgba(82,82,82,0.2)' }}>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-[#525252]">ETA</p>
                    <p className="mt-0.5 text-xs font-black text-white">{deliveryEta.formatted}</p>
                  </div>
                  <div className="rounded-xl p-2" style={pillActiveBorder}>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-[#29BA1F]/70">Prix</p>
                    <p className="mt-0.5 text-xs font-black text-[#29BA1F]">{total} FC</p>
                  </div>
                </div>

                {/* Itinéraire */}
                <div className="mb-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#525252] mb-2">Itinéraire</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 p-2 rounded-xl" style={{ background:'rgba(18,18,18,0.8)', border:'1px solid rgba(82,82,82,0.2)' }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background:'linear-gradient(145deg,#29BA1F,#098C04)' }}>
                        <IcoNavigation size={10} className="text-white" />
                      </div>
                      <span className="text-[9px] font-semibold text-white truncate">{depart}</span>
                    </div>

                    {stops.map((stop, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-xl" style={{ background:'rgba(18,18,18,0.8)', border:'1px solid rgba(82,82,82,0.2)' }}>
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background:'rgba(82,82,82,0.2)' }}>
                          <IcoPin size={10} className="text-[#525252]" />
                        </div>
                        <input type="text" placeholder={`Escale ${i + 1}`} value={stop}
                          onChange={(e) => {
                            const newStops = [...stops];
                            newStops[i] = e.target.value;
                            setStops(newStops);
                          }}
                          className="flex-1 bg-transparent text-[9px] text-white placeholder-[#525252]/50 outline-none" />
                        <motion.button whileTap={{ scale: 0.9 }}
                          onClick={() => setStops(stops.filter((_, idx) => idx !== i))}
                          className="text-[#525252] hover:text-red-500 text-xs">
                          ✕
                        </motion.button>
                      </div>
                    ))}

                    <motion.button whileTap={{ scale: 0.95 }}
                      onClick={() => setStops([...stops, ''])}
                      className="flex items-center gap-1 p-2 rounded-xl w-full text-left text-[9px]"
                      style={{ background:'rgba(11,41,40,0.4)', border:'1px dashed rgba(41,186,31,0.3)' }}>
                      <IcoPlus size={10} className="text-[#29BA1F]" />
                      <span className="font-semibold text-[#29BA1F]">Ajouter escale</span>
                    </motion.button>

                    <div className="flex items-center gap-2 p-2 rounded-xl" style={{ background:'rgba(18,18,18,0.8)', border:'1px solid rgba(82,82,82,0.2)' }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background:'rgba(9,140,4,0.3)' }}>
                        <IcoPin size={10} className="text-[#098C04]" />
                      </div>
                      <span className="text-[9px] font-semibold text-white truncate">{destination}</span>
                    </div>
                  </div>
                </div>

                {/* Colis */}
                <div className="mb-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#525252] mb-2">Colis</p>
                  <div className="mb-2 grid grid-cols-3 gap-1.5">
                    {packageSizeOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileTap={{ scale: 0.96 }}
                        type="button"
                        onClick={() => setPackageSize(option.value)}
                        className="rounded-xl p-2 text-left"
                        style={packageSize === option.value
                          ? pillActiveBorder
                          : { background:'rgba(18,18,18,0.8)', border:'1px solid rgba(82,82,82,0.2)' }}
                      >
                        <p className={`text-[10px] font-black ${packageSize === option.value ? 'text-white' : 'text-[#525252]'}`}>
                          {option.label}
                        </p>
                        <p className="mt-0.5 truncate text-[8px] text-[#525252]">{option.hint}</p>
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="number" min="1" value={packageWeight}
                      onChange={(e) => setPackageWeight(e.target.value)}
                      className="flex-1 rounded-lg px-2 py-2 text-xs text-white outline-none"
                      style={{ background:'rgba(18,18,18,0.9)', border:'1px solid rgba(82,82,82,0.25)' }}
                      placeholder="Poids (kg)" />
                    <div className="rounded-lg px-2 py-2 text-right" style={pillActiveBorder}>
                      <p className="text-[8px] font-bold text-[#29BA1F]">+{weightPrice} FC</p>
                    </div>
                  </div>
                  <div className="mt-2 rounded-xl p-2" style={{ background:'rgba(11,41,40,0.35)', border:'1px solid rgba(41,186,31,0.16)' }}>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#525252]">Base</span>
                      <span className="font-bold text-white">{basePrice} FC</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px]">
                      <span className="text-[#525252]">Distance ({deliveryDistance.toFixed(1)} km)</span>
                      <span className="font-bold text-white">{distancePrice} FC</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px]">
                      <span className="text-[#525252]">Taille</span>
                      <span className="font-bold text-white">{sizePrice} FC</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px]">
                      <span className="text-[#525252]">Poids</span>
                      <span className="font-bold text-white">{weightPrice} FC</span>
                    </div>
                  </div>
                  <textarea value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Instructions..."
                    className="w-full mt-2 resize-none rounded-lg px-2 py-2 text-xs text-white placeholder-[#525252]/50 outline-none"
                    style={{ background:'rgba(18,18,18,0.9)', border:'1px solid rgba(82,82,82,0.25)', height: '60px' }} />
                </div>

                {/* Paiement */}
                <div className="mb-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#525252] mb-2">Paiement</p>
                  <div className="space-y-1.5">
                    <motion.button whileTap={{ scale:0.97 }} onClick={() => setPayment('mobile')}
                      className="flex w-full items-center gap-2 rounded-lg p-2 text-left transition-all"
                      style={payment === 'mobile' ? pillActiveBorder : { background:'rgba(18,18,18,0.8)', border:'1px solid rgba(82,82,82,0.2)' }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={payment === 'mobile'
                          ? { background:'rgba(11,41,40,0.9)', border:'1px solid rgba(41,186,31,0.3)' }
                          : { background:'rgba(26,26,26,0.8)', border:'1px solid rgba(82,82,82,0.2)' }}>
                        <IcoCard size={10} className={payment === 'mobile' ? 'text-[#29BA1F]' : 'text-[#525252]'} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-[9px] font-bold ${payment === 'mobile' ? 'text-white' : 'text-[#525252]'}`}>Mobile Money</p>
                      </div>
                      {payment === 'mobile' && <IcoCheck size={10} className="text-[#29BA1F]" />}
                    </motion.button>

                    <motion.button whileTap={{ scale:0.97 }} onClick={() => setPayment('cash')}
                      className="flex w-full items-center gap-2 rounded-lg p-2 text-left transition-all"
                      style={payment === 'cash' ? pillActiveBorder : { background:'rgba(18,18,18,0.8)', border:'1px solid rgba(82,82,82,0.2)' }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={payment === 'cash'
                          ? { background:'rgba(11,41,40,0.9)', border:'1px solid rgba(41,186,31,0.3)' }
                          : { background:'rgba(26,26,26,0.8)', border:'1px solid rgba(82,82,82,0.2)' }}>
                        <IcoCash size={10} className={payment === 'cash' ? 'text-[#29BA1F]' : 'text-[#525252]'} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-[9px] font-bold ${payment === 'cash' ? 'text-white' : 'text-[#525252]'}`}>Espèces</p>
                      </div>
                      {payment === 'cash' && <IcoCheck size={10} className="text-[#29BA1F]" />}
                    </motion.button>
                  </div>
                </div>

                {/* Bouton Commander */}
                <motion.button whileTap={{ scale:0.97 }} onClick={handleGoToPayment}
                  className="w-full flex items-center justify-center gap-2 rounded-lg py-3 text-xs font-bold text-white"
                  style={{ background:'linear-gradient(145deg,#29BA1F,#098C04)', boxShadow:'0 4px 16px rgba(41,186,31,0.35)' }}>
                  <IcoZap size={12} /> Continuer vers paiement ({total} FC)
                </motion.button>
              </motion.div>
            )}

            {orderStep === 'payment' && selectedDriver && (
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-3xl p-5"
                style={pillStyle}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#29BA1F]">Confirmation</p>
                    <p className="mt-1 text-sm font-black text-white">Paiement et validation</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setOrderStep('details')}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-[#525252]"
                    style={{ background: 'rgba(18,18,18,0.8)', border: '1px solid rgba(82,82,82,0.2)' }}
                  >
                    ✕
                  </motion.button>
                </div>

                <div className="space-y-2">
                  <div className="rounded-2xl border border-[#525252]/20 bg-[#151515] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#525252]">Résumé</p>
                    <div className="mt-2 space-y-1 text-xs text-white">
                      <p>Départ: {depart}</p>
                      <p>Destination: {destination}</p>
                      <p>Livreur: {selectedDriver.name}</p>
                      <p>Distance: {deliveryDistance.toFixed(1)} km</p>
                      <p>ETA: {deliveryEta.formatted}</p>
                      <p>Colis: {packageSizeOptions.find((option) => option.value === packageSize)?.label} · {packageWeight || 1} kg</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#29BA1F]/20 bg-[#0B2928]/50 p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#525252]">Base</span>
                      <span className="font-bold text-white">{basePrice} FC</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-[#525252]">Distance</span>
                      <span className="font-bold text-white">{distancePrice} FC</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-[#525252]">Poids</span>
                      <span className="font-bold text-white">{weightPrice} FC</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-[#525252]">Taille</span>
                      <span className="font-bold text-white">{sizePrice} FC</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-[#29BA1F]/15 pt-3">
                      <span className="text-sm font-bold text-white">Total</span>
                      <span className="text-sm font-black text-[#29BA1F]">{total} FC</span>
                    </div>
                  </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleConfirmOrder}
                      disabled={isSubmittingOrder}
                      className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(145deg,#29BA1F,#098C04)', boxShadow: '0 4px 16px rgba(41,186,31,0.35)' }}
                    >
                      <IcoCheck size={12} /> {isSubmittingOrder ? 'Confirmation...' : 'Confirmer la commande'}
                    </motion.button>
                </div>
              </motion.div>
            )}

            {orderStep === 'tracking' && selectedDriver && (
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-3xl p-5"
                style={pillStyle}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#29BA1F]">Suivi</p>
                    <p className="mt-1 text-sm font-black text-white">
                      {currentOrder ? `Commande ${currentOrder.id.slice(0, 6).toUpperCase()}` : 'Commande confirmée'}
                    </p>
                  </div>
                  <span className="rounded-full border border-[#29BA1F]/25 bg-[#0B2928] px-2 py-1 text-[10px] font-bold text-[#29BA1F]">
                    {trackingStage === 3 ? 'Livré' : 'En cours'}
                  </span>
                </div>

                <div className="mb-4 rounded-2xl border border-[#525252]/20 bg-[#151515] p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#29BA1F] to-[#098C04]">
                      <IcoUser size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{currentOrder?.driverName ?? selectedDriver.name}</p>
                      <p className="text-[11px] text-[#525252]">
                        {currentOrder?.driverPhone ?? selectedDriver.phone} · {currentOrder?.driverPlate ?? selectedDriver.plate}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                      <IcoStar size={9} filled />
                      {selectedDriver.rating}
                    </span>
                  </div>
                </div>

                {currentOrder ? <OrderDocumentCard order={currentOrder} /> : null}

                <div className="space-y-2">
                  {['Commande confirmée', 'Livreur en route vers le départ', 'Colis récupéré', 'Livraison terminée'].map((label, index) => {
                    const isDone = index <= trackingStage;
                    return (
                      <div
                        key={label}
                        className="flex items-center gap-3 rounded-2xl border p-3"
                        style={{
                          background: isDone ? 'rgba(11,41,40,0.55)' : 'rgba(18,18,18,0.8)',
                          borderColor: isDone ? 'rgba(41,186,31,0.28)' : 'rgba(82,82,82,0.2)',
                        }}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#121212]">
                          <IcoCheck size={12} className={isDone ? 'text-[#29BA1F]' : 'text-[#525252]'} />
                        </div>
                        <p className={`text-xs font-semibold ${isDone ? 'text-white' : 'text-[#525252]'}`}>{label}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 space-y-2">
                  {trackingStage < 3 ? (
                    <div className="rounded-2xl border border-[#29BA1F]/15 bg-[#0B2928]/45 p-3">
                      <p className="text-xs font-bold text-white">Suivi automatique</p>
                      <p className="mt-1 text-[11px] text-[#525252]">Le statut sera mis à jour depuis le tableau de bord du livreur.</p>
                    </div>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleStartNewOrder}
                      className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(145deg,#29BA1F,#098C04)', boxShadow: '0 4px 16px rgba(41,186,31,0.35)' }}
                    >
                      <IcoZap size={12} /> Nouvelle commande
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}

          </div>
        </div>

        <BottomNav role="client" />
      </div>
    </div>
  );
}
