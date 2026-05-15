'use client';

import QRCode from 'qrcode';
import type { PackageSize } from '@/lib/pricing';

export type OrderDocumentType = 'receipt' | 'invoice';

export type OrderDocumentInput = {
  documentType: OrderDocumentType;
  documentNumber: string;
  userName: string;
  driverName: string;
  departure: string;
  destination: string;
  paymentMethod: 'mobile' | 'cash';
  packageSize: PackageSize;
  weight: number;
  distanceKm: number;
  etaMinutes: number;
  basePrice: number;
  distancePrice: number;
  weightPrice: number;
  sizePrice: number;
  total: number;
};

const packageSizeLabels: Record<PackageSize, string> = {
  small: 'Petit',
  medium: 'Moyen',
  large: 'Grand',
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function formatAmount(amount: number) {
  return `${new Intl.NumberFormat('fr-CD').format(amount)} FC`;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number) {
  const value = text.length > 52 ? `${text.slice(0, 49)}...` : text;
  ctx.fillText(value, x, y, maxWidth);
}

export function createOrderDocumentNumber(type: OrderDocumentType) {
  const prefix = type === 'receipt' ? 'REC' : 'FAC';
  const date = new Date();
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('');
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();

  return `${prefix}-${stamp}-${suffix}`;
}

export async function generateOrderDocumentImage(input: OrderDocumentInput) {
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 1040;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas indisponible.');
  }

  const title = input.documentType === 'receipt' ? 'RECU DE PAIEMENT' : 'FACTURE ESPECES';
  const paymentLabel = input.paymentMethod === 'mobile' ? 'Mobile Money' : 'Especes';
  const qrPayload = JSON.stringify({
    app: 'Rapidoss',
    documentNumber: input.documentNumber,
    type: input.documentType,
    amount: input.total,
    payment: input.paymentMethod,
    departure: input.departure,
    destination: input.destination,
  });
  const qrDataUrl = await QRCode.toDataURL(qrPayload, {
    margin: 1,
    width: 180,
    color: {
      dark: '#121212',
      light: '#FFFFFF',
    },
  });
  const qrImage = await loadImage(qrDataUrl);

  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#0B2928');
  gradient.addColorStop(0.45, '#121212');
  gradient.addColorStop(1, '#098C04');
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;

  drawRoundedRect(ctx, 44, 44, 632, 952, 34);
  ctx.fillStyle = '#171717';
  ctx.fill();
  ctx.strokeStyle = 'rgba(41,186,31,0.42)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#29BA1F';
  ctx.font = '900 34px system-ui, sans-serif';
  ctx.fillText('Rapidoss', 78, 112);
  ctx.font = '800 12px system-ui, sans-serif';
  ctx.letterSpacing = '0px';
  ctx.fillText('LOGISTIQUE A LA DEMANDE', 80, 136);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 30px system-ui, sans-serif';
  ctx.fillText(title, 78, 196);
  ctx.fillStyle = '#8b8b8b';
  ctx.font = '700 15px system-ui, sans-serif';
  ctx.fillText(input.documentNumber, 78, 224);
  ctx.fillText(new Date().toLocaleString('fr-CD'), 78, 250);

  drawRoundedRect(ctx, 488, 82, 132, 132, 18);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.drawImage(qrImage, 500, 94, 108, 108);

  drawRoundedRect(ctx, 78, 292, 564, 116, 22);
  ctx.fillStyle = '#0B2928';
  ctx.fill();
  ctx.strokeStyle = 'rgba(41,186,31,0.25)';
  ctx.stroke();

  ctx.fillStyle = '#29BA1F';
  ctx.font = '800 13px system-ui, sans-serif';
  ctx.fillText('CLIENT', 104, 326);
  ctx.fillText('LIVREUR', 392, 326);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 18px system-ui, sans-serif';
  drawText(ctx, input.userName, 104, 354, 210);
  drawText(ctx, input.driverName, 392, 354, 210);
  ctx.fillStyle = '#8b8b8b';
  ctx.font = '700 13px system-ui, sans-serif';
  ctx.fillText(paymentLabel, 104, 380);
  ctx.fillText(`${input.etaMinutes} min`, 392, 380);

  ctx.fillStyle = '#29BA1F';
  ctx.font = '800 13px system-ui, sans-serif';
  ctx.fillText('ITINERAIRE', 78, 462);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 17px system-ui, sans-serif';
  drawText(ctx, `Depart: ${input.departure}`, 78, 494, 560);
  drawText(ctx, `Livraison: ${input.destination}`, 78, 526, 560);

  ctx.fillStyle = '#8b8b8b';
  ctx.font = '700 14px system-ui, sans-serif';
  ctx.fillText(`Distance: ${input.distanceKm.toFixed(1)} km`, 78, 562);
  ctx.fillText(`Colis: ${packageSizeLabels[input.packageSize]} · ${input.weight} kg`, 300, 562);

  const rows = [
    ['Base', input.basePrice],
    ['Distance', input.distancePrice],
    ['Poids', input.weightPrice],
    ['Taille colis', input.sizePrice],
  ] as const;

  let y = 634;
  rows.forEach(([label, amount]) => {
    ctx.fillStyle = '#8b8b8b';
    ctx.font = '700 16px system-ui, sans-serif';
    ctx.fillText(label, 86, y);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 16px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(formatAmount(amount), 626, y);
    ctx.textAlign = 'left';
    y += 44;
  });

  ctx.strokeStyle = 'rgba(41,186,31,0.24)';
  ctx.beginPath();
  ctx.moveTo(86, 806);
  ctx.lineTo(626, 806);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 22px system-ui, sans-serif';
  ctx.fillText('TOTAL', 86, 852);
  ctx.fillStyle = '#29BA1F';
  ctx.font = '900 34px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(formatAmount(input.total), 626, 852);
  ctx.textAlign = 'left';

  ctx.fillStyle = '#8b8b8b';
  ctx.font = '700 13px system-ui, sans-serif';
  ctx.fillText('Scannez le QR code pour verifier ce document Rapidoss.', 86, 932);
  ctx.fillText(input.documentType === 'receipt' ? 'Paiement confirme.' : 'Montant a regler en especes au livreur.', 86, 956);

  return canvas.toDataURL('image/jpeg', 0.86);
}
