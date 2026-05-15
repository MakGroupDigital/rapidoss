/**
 * Kinshasa geocoding helpers.
 * Uses OpenStreetMap-backed public services for address lookup.
 */

export interface GeocodeResult {
  name: string;
  address: string;
  lat: number;
  lng: number;
  placeId: string;
  types: string[];
  source?: 'nominatim' | 'overpass';
}

const KINSHASA_BOUNDS = {
  south: -4.5,
  west: 15.0,
  north: -4.2,
  east: 15.5,
};

/**
 * Legacy Nominatim-only search kept for compatibility.
 * New autocomplete code uses searchKinshasaAddresses below.
 */
export async function searchAddresses(query: string, limit: number = 6): Promise<GeocodeResult[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    // Using Nominatim (OpenStreetMap) - completely free, no API key needed
    const searchQuery = `${query}, Kinshasa, Democratic Republic of the Congo`;
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.append('q', searchQuery);
    url.searchParams.append('format', 'json');
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('bounded', '1');
    url.searchParams.append('viewbox', `${KINSHASA_BOUNDS.west},${KINSHASA_BOUNDS.north},${KINSHASA_BOUNDS.east},${KINSHASA_BOUNDS.south}`);

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'Rapidoss-App/1.0',
      },
    });

    if (!response.ok) {
      console.error('Nominatim API error:', response.status);
      return [];
    }

    const data = await response.json();

    return data.map((result: any) => ({
      name: result.name || result.display_name.split(',')[0],
      address: result.display_name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      placeId: result.place_id,
      types: result.type ? [result.type] : [],
    }));
  } catch (error) {
    console.error('Error searching addresses:', error);
    return [];
  }
}

type NominatimResult = {
  place_id: number | string;
  display_name: string;
  name?: string;
  lat: string;
  lon: string;
  type?: string;
  class?: string;
  address?: Record<string, string | undefined>;
};

type OverpassElement = {
  id: number;
  type: 'node' | 'way' | 'relation';
  lat?: number;
  lon?: number;
  center?: {
    lat?: number;
    lon?: number;
  };
  tags?: Record<string, string | undefined>;
};

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const PERSISTED_SEARCH_CACHE_KEY = 'rapidoss:kinshasa-address-cache';
const MAX_PERSISTED_SEARCHES = 80;
const searchCache = new Map<string, GeocodeResult[]>();

function escapeOverpassRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeSearchKey(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function formatNominatimName(result: NominatimResult) {
  return (
    result.name ||
    result.address?.road ||
    result.address?.neighbourhood ||
    result.address?.suburb ||
    result.address?.city_district ||
    result.display_name.split(',')[0]
  );
}

function mapNominatimResult(result: NominatimResult): GeocodeResult {
  const type = result.type || result.class || 'adresse';

  return {
    name: formatNominatimName(result),
    address: result.display_name,
    lat: Number(result.lat),
    lng: Number(result.lon),
    placeId: `nominatim:${result.place_id}`,
    types: [type],
    source: 'nominatim',
  };
}

function formatOverpassName(tags: Record<string, string | undefined>) {
  const houseNumber = tags['addr:housenumber'];
  const street = tags['addr:street'];

  if (houseNumber && street) {
    return `${houseNumber}, ${street}`;
  }

  return tags.name || street || tags['addr:place'] || tags.ref || 'Adresse Kinshasa';
}

function formatOverpassAddress(tags: Record<string, string | undefined>) {
  return [
    tags['addr:housenumber'],
    tags['addr:street'] || tags.name || tags['addr:place'],
    tags['addr:suburb'] || tags['addr:quarter'] || tags['addr:neighbourhood'],
    tags['addr:city'] || 'Kinshasa',
  ].filter(Boolean).join(', ');
}

function getOverpassTypes(tags: Record<string, string | undefined>) {
  if (tags.highway) return [tags.highway, 'rue'];
  if (tags['addr:housenumber']) return ['numero', 'adresse'];
  if (tags.place) return [tags.place, 'quartier'];
  if (tags.boundary) return [tags.boundary, 'commune'];
  if (tags.amenity) return [tags.amenity, 'lieu'];
  return ['adresse'];
}

function mapOverpassElement(element: OverpassElement): GeocodeResult | null {
  const lat = element.lat ?? element.center?.lat;
  const lng = element.lon ?? element.center?.lon;
  const tags = element.tags ?? {};

  if (lat === undefined || lng === undefined) {
    return null;
  }

  return {
    name: formatOverpassName(tags),
    address: formatOverpassAddress(tags),
    lat,
    lng,
    placeId: `overpass:${element.type}:${element.id}`,
    types: getOverpassTypes(tags),
    source: 'overpass',
  };
}

function dedupeGeocodeResults(results: GeocodeResult[]) {
  const seen = new Set<string>();

  return results.filter((result) => {
    const key = normalizeSearchKey(`${result.name} ${result.address}`);
    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function readPersistedSearchCache() {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    return JSON.parse(window.localStorage.getItem(PERSISTED_SEARCH_CACHE_KEY) || '{}') as Record<string, GeocodeResult[]>;
  } catch {
    return {};
  }
}

function writePersistedSearchCache(cache: Record<string, GeocodeResult[]>) {
  if (typeof window === 'undefined') {
    return;
  }

  const entries = Object.entries(cache).slice(-MAX_PERSISTED_SEARCHES);
  window.localStorage.setItem(PERSISTED_SEARCH_CACHE_KEY, JSON.stringify(Object.fromEntries(entries)));
}

function getPersistedSearchResults(cacheKey: string) {
  const cachedResults = readPersistedSearchCache()[cacheKey];

  if (!cachedResults) {
    return null;
  }

  searchCache.set(cacheKey, cachedResults);
  return cachedResults;
}

function persistSearchResults(cacheKey: string, results: GeocodeResult[]) {
  const cache = readPersistedSearchCache();
  cache[cacheKey] = results;
  writePersistedSearchCache(cache);
}

async function searchNominatimKinshasa(query: string, limit: number): Promise<GeocodeResult[]> {
  const searchQuery = `${query}, Kinshasa, Democratic Republic of the Congo`;
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.append('q', searchQuery);
  url.searchParams.append('format', 'jsonv2');
  url.searchParams.append('addressdetails', '1');
  url.searchParams.append('namedetails', '1');
  url.searchParams.append('limit', String(limit));
  url.searchParams.append('bounded', '1');
  url.searchParams.append('countrycodes', 'cd');
  url.searchParams.append('accept-language', 'fr');
  url.searchParams.append('viewbox', `${KINSHASA_BOUNDS.west},${KINSHASA_BOUNDS.north},${KINSHASA_BOUNDS.east},${KINSHASA_BOUNDS.south}`);

  const response = await fetch(url.toString());

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as NominatimResult[];
  return data.map(mapNominatimResult);
}

async function searchOverpassKinshasa(query: string, limit: number): Promise<GeocodeResult[]> {
  const pattern = escapeOverpassRegex(query.trim());

  if (!pattern) {
    return [];
  }

  const bbox = `${KINSHASA_BOUNDS.south},${KINSHASA_BOUNDS.west},${KINSHASA_BOUNDS.north},${KINSHASA_BOUNDS.east}`;
  const overpassQuery = `
    [out:json][timeout:8];
    (
      nwr["name"~"${pattern}",i](${bbox});
      nwr["addr:street"~"${pattern}",i](${bbox});
      nwr["addr:housenumber"~"${pattern}",i](${bbox});
      nwr["addr:place"~"${pattern}",i](${bbox});
      nwr["highway"]["name"~"${pattern}",i](${bbox});
      nwr["place"~"city|town|suburb|quarter|neighbourhood"]["name"~"${pattern}",i](${bbox});
      nwr["boundary"="administrative"]["name"~"${pattern}",i](${bbox});
    );
    out center tags ${limit};
  `;

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: new URLSearchParams({ data: overpassQuery }),
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as { elements?: OverpassElement[] };
  return (data.elements ?? [])
    .map(mapOverpassElement)
    .filter((result): result is GeocodeResult => Boolean(result));
}

/**
 * Search Kinshasa addresses with two free OpenStreetMap services:
 * - Nominatim for geocoded address/place search.
 * - Overpass for OSM objects such as roads, avenues, neighbourhoods and house numbers.
 */
export async function searchKinshasaAddresses(query: string, limit: number = 12): Promise<GeocodeResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const cacheKey = `${normalizeSearchKey(query)}:${limit}`;
  const cachedResults = searchCache.get(cacheKey) ?? getPersistedSearchResults(cacheKey);

  if (cachedResults) {
    return cachedResults;
  }

  const [nominatimResults, overpassResults] = await Promise.allSettled([
    searchNominatimKinshasa(query, limit),
    searchOverpassKinshasa(query, limit),
  ]);

  const results = dedupeGeocodeResults([
    ...(nominatimResults.status === 'fulfilled' ? nominatimResults.value : []),
    ...(overpassResults.status === 'fulfilled' ? overpassResults.value : []),
  ]).slice(0, limit);

  searchCache.set(cacheKey, results);
  persistSearchResults(cacheKey, results);
  return results;
}

/**
 * Reverse geocode coordinates to get address
 * Free using Nominatim
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult | null> {
  try {
    const url = new URL('https://nominatim.openstreetmap.org/reverse');
    url.searchParams.append('format', 'json');
    url.searchParams.append('lat', lat.toString());
    url.searchParams.append('lon', lng.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'Rapidoss-App/1.0',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      name: data.name || data.address?.road || data.address?.suburb || 'Unknown Location',
      address: data.display_name,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
      placeId: data.place_id,
      types: data.type ? [data.type] : [],
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}

/**
 * Calculate distance between two coordinates (in km)
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Estimate delivery price based on distance
 * Using OpenStreetMap data
 */
export function estimatePrice(distanceKm: number): {
  basePrice: number;
  distancePrice: number;
  total: number;
} {
  const basePrice = 1000; // FC
  const pricePerKm = 500; // FC per km
  const distancePrice = Math.ceil(distanceKm * pricePerKm);
  const total = basePrice + distancePrice;

  return {
    basePrice,
    distancePrice,
    total,
  };
}

/**
 * Estimate delivery time based on distance
 */
export function estimateTime(distanceKm: number): {
  minutes: number;
  formatted: string;
} {
  const avgSpeedKmPerMin = 0.5; // ~30 km/h in city
  const minutes = Math.ceil(distanceKm / avgSpeedKmPerMin) + 5; // +5 min buffer

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  let formatted = '';
  if (hours > 0) {
    formatted = `${hours}h ${mins}m`;
  } else {
    formatted = `${mins} min`;
  }

  return { minutes, formatted };
}
