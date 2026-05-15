'use client';

import { useEffect, useState } from 'react';
import BottomNav from '@/components/BottomNav';
import { IcoPackage, IcoPin, IcoNavigation, IcoClock, IcoPhone } from '@/components/Icons';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { subscribeToDriverOrders, type DeliveryOrder } from '@/lib/orders';

function getStatusLabel(status: DeliveryOrder['status']) {
  if (status === 'confirmed') return 'Confirmée';
  if (status === 'driver_assigned') return 'Assignée';
  if (status === 'picked_up') return 'En cours';
  return 'Terminée';
}

export default function DriverOrdersPage() {
  const { isLoading, isAuthorized, profile } = useProtectedRoute('driver');
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);

  useEffect(() => {
    if (!profile?.uid) {
      return;
    }

    return subscribeToDriverOrders(profile.uid, profile.fullName, (driverOrders) => {
      setOrders(driverOrders.filter((order) => order.status !== 'completed'));
    });
  }, [profile?.fullName, profile?.uid]);

  if (isLoading || !isAuthorized) {
    return <div className="min-h-screen bg-[#121212]" />;
  }

  return (
    <main className="min-h-screen bg-[#121212] pb-28 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#29BA1F22,transparent_35%),linear-gradient(180deg,#0B2928_0%,#0B0B0B_65%)] pointer-events-none" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#29BA1F]/80">Livreur</p>
            <h1 className="text-3xl font-black">Mes courses</h1>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#29BA1F]/15 text-[#29BA1F] border border-[#29BA1F]/25">
            <IcoPackage size={24} />
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-3xl p-6 backdrop-blur-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(18,18,18,0.98) 100%)',
                  border: '1px solid rgba(41,186,31,0.18)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(41,186,31,0.08)',
                }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-[#29BA1F]/80">{getStatusLabel(order.status)}</span>
                  <span className="text-xs font-bold text-white/60">{order.id.slice(0, 6).toUpperCase()}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#29BA1F]/15 text-[#29BA1F]">
                      <IcoPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Point de départ</p>
                      <p className="text-lg font-semibold">{order.departure}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#29BA1F]/15 text-[#29BA1F]">
                      <IcoNavigation size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Point de livraison</p>
                      <p className="text-lg font-semibold">{order.destination}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2">
                      <IcoClock size={16} />
                      <span className="text-sm text-white/80">{order.etaMinutes} min</span>
                    </div>
                    <span className="text-lg font-bold text-[#29BA1F]">{order.price} FC</span>
                  </div>

                  <a
                    href={`tel:${order.userPhone}`}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-bold"
                    style={{
                      background: 'linear-gradient(145deg, #29BA1F 0%, #098C04 100%)',
                      boxShadow: '0 4px 20px rgba(41,186,31,0.3)',
                    }}
                  >
                    <IcoPhone size={18} />
                    Contacter le client
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#29BA1F]/10">
              <IcoPackage size={40} />
            </div>
            <p className="mb-2 text-xl font-bold">Aucune course active</p>
            <p className="text-sm text-white/60">Les commandes assignées apparaîtront ici.</p>
          </div>
        )}
      </section>

      <BottomNav role="driver" />
    </main>
  );
}
