/**
 * Drivers Database & Types
 */

export type VehicleType = 'moto' | 'voiture' | 'camion' | 'velo' | 'tricycle';

export interface Driver {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  vehicle: VehicleType;
  plate: string;
  lat: number;
  lng: number;
  available: boolean;
  phone: string;
  avatar?: string;
}

// Mock drivers data - in production, fetch from Firestore
export const mockDrivers: Driver[] = [
  {
    id: 'drv_001',
    name: 'Didier K.',
    rating: 4.9,
    reviews: 247,
    vehicle: 'moto',
    plate: 'AB-123-CD',
    lat: -4.3097,
    lng: 15.3155,
    available: true,
    phone: '+243 123 456 789',
  },
  {
    id: 'drv_002',
    name: 'Jean M.',
    rating: 4.7,
    reviews: 189,
    vehicle: 'voiture',
    plate: 'XY-789-AB',
    lat: -4.3464,
    lng: 15.2808,
    available: true,
    phone: '+243 987 654 321',
  },
  {
    id: 'drv_003',
    name: 'Pierre L.',
    rating: 4.8,
    reviews: 312,
    vehicle: 'camion',
    plate: 'CD-456-EF',
    lat: -4.3677,
    lng: 15.3434,
    available: true,
    phone: '+243 555 666 777',
  },
  {
    id: 'drv_004',
    name: 'Marc T.',
    rating: 4.6,
    reviews: 156,
    vehicle: 'tricycle',
    plate: 'GH-789-IJ',
    lat: -4.3902,
    lng: 15.3494,
    available: true,
    phone: '+243 444 555 666',
  },
  {
    id: 'drv_005',
    name: 'Luc D.',
    rating: 4.9,
    reviews: 298,
    vehicle: 'velo',
    plate: 'KL-012-MN',
    lat: -4.3574,
    lng: 15.2389,
    available: true,
    phone: '+243 333 222 111',
  },
];

/**
 * Get drivers near a location (mock implementation)
 */
export function getDriversNearLocation(
  lat: number,
  lng: number,
  radiusKm: number = 50
): Driver[] {
  // Return all available drivers for now (mock data is all in Kinshasa)
  return mockDrivers.filter(driver => driver.available);
}

/**
 * Get vehicle icon class name
 */
export function getVehicleIcon(vehicle: VehicleType): string {
  const iconMap: Record<VehicleType, string> = {
    moto: 'IcoBike',
    voiture: 'IcoCar',
    camion: 'IcoTruck',
    velo: 'IcoBicycle',
    tricycle: 'IcoTricycle',
  };
  return iconMap[vehicle];
}
