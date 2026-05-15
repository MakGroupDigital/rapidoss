'use client';

export const DELIVERY_PRICING = {
  basePrice: 1000,
  pricePerKm: 650,
  pricePerKg: 500,
  sizeSurcharges: {
    small: 0,
    medium: 1000,
    large: 2500,
  },
} as const;

export type PackageSize = keyof typeof DELIVERY_PRICING.sizeSurcharges;

export type DeliveryPrice = {
  basePrice: number;
  distancePrice: number;
  weightPrice: number;
  sizePrice: number;
  total: number;
};

export function calculateDeliveryPrice(input: {
  distanceKm: number;
  weightKg: number;
  packageSize: PackageSize;
}): DeliveryPrice {
  const normalizedDistance = Number.isFinite(input.distanceKm) && input.distanceKm > 0 ? input.distanceKm : 0;
  const normalizedWeight = Number.isFinite(input.weightKg) && input.weightKg > 0 ? input.weightKg : 1;
  const distancePrice = Math.ceil(normalizedDistance * DELIVERY_PRICING.pricePerKm);
  const weightPrice = Math.ceil(normalizedWeight * DELIVERY_PRICING.pricePerKg);
  const sizePrice = DELIVERY_PRICING.sizeSurcharges[input.packageSize];

  return {
    basePrice: DELIVERY_PRICING.basePrice,
    distancePrice,
    weightPrice,
    sizePrice,
    total: DELIVERY_PRICING.basePrice + distancePrice + weightPrice + sizePrice,
  };
}
