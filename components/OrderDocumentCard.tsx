'use client';

import { type DeliveryOrder } from '@/lib/orders';

export default function OrderDocumentCard({ order }: { order: DeliveryOrder }) {
  if (!order.documentImageUrl) {
    return null;
  }

  const label = order.documentType === 'invoice' ? 'Facture' : 'Recu';
  const fileName = `${label.toLowerCase()}-${order.documentNumber ?? order.id}.jpg`;

  return (
    <div className="mt-3 rounded-2xl border border-[#29BA1F]/20 bg-[#0B2928]/45 p-3">
      <div className="flex items-center gap-3">
        <div
          aria-label={`${label} ${order.documentNumber ?? order.id}`}
          className="h-20 w-14 flex-shrink-0 rounded-lg border border-white/10 bg-cover bg-top"
          style={{ backgroundImage: `url(${order.documentImageUrl})` }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#29BA1F]">{label} JPG</p>
          <p className="mt-1 truncate text-xs font-bold text-white">{order.documentNumber}</p>
          <p className="mt-0.5 text-[11px] text-[#525252]">QR code inclus</p>
          <div className="mt-2 flex gap-2">
            <a
              href={order.documentImageUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-[#29BA1F]/25 bg-[#121212] px-3 py-1.5 text-[10px] font-bold text-[#29BA1F]"
            >
              Voir
            </a>
            <a
              href={order.documentImageUrl}
              download={fileName}
              className="rounded-lg bg-gradient-to-r from-[#29BA1F] to-[#098C04] px-3 py-1.5 text-[10px] font-bold text-white"
            >
              JPG
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
