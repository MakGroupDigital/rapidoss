/**
 * Kinshasa Locations Database
 * Comprehensive list of streets, avenues, neighborhoods, and landmarks in Kinshasa
 */

export interface KinshasaLocation {
  name: string;
  type: 'avenue' | 'rue' | 'boulevard' | 'quartier' | 'landmark' | 'commune';
  lat: number;
  lng: number;
  aliases?: string[];
}

export const kinshasaLocations: KinshasaLocation[] = [
  // Communes
  { name: 'Bandalungwa', type: 'commune', lat: -4.3432, lng: 15.2784, aliases: ['bandal', 'bandalungwa', 'band'] },
  { name: 'Barumbu', type: 'commune', lat: -4.3207, lng: 15.3164, aliases: ['barumbu'] },
  { name: 'Bumbu', type: 'commune', lat: -4.3838, lng: 15.2898, aliases: ['bumbu'] },
  { name: 'Gombe', type: 'commune', lat: -4.3059, lng: 15.3122, aliases: ['gombe', 'gouvernement', 'centre ville'] },
  { name: 'Kalamu', type: 'commune', lat: -4.3487, lng: 15.3083, aliases: ['kalamu', 'matonge'] },
  { name: 'Kasa-Vubu', type: 'commune', lat: -4.3427, lng: 15.2922, aliases: ['kasavubu', 'kasa vubu', 'kasa'] },
  { name: 'Kimbanseke', type: 'commune', lat: -4.4333, lng: 15.4167, aliases: ['kimbanseke', 'kimban'] },
  { name: 'Kinshasa', type: 'commune', lat: -4.3297, lng: 15.3181, aliases: ['kin', 'commune de kinshasa'] },
  { name: 'Kintambo', type: 'commune', lat: -4.3279, lng: 15.2674, aliases: ['kintambo'] },
  { name: 'Kisenso', type: 'commune', lat: -4.4142, lng: 15.3365, aliases: ['kisenso'] },
  { name: 'Lemba', type: 'commune', lat: -4.4013, lng: 15.3369, aliases: ['lemba', 'unikin'] },
  { name: 'Limete', type: 'commune', lat: -4.3538, lng: 15.3414, aliases: ['limete', 'industriel'] },
  { name: 'Lingwala', type: 'commune', lat: -4.3226, lng: 15.2999, aliases: ['lingwala', 'ling'] },
  { name: 'Makala', type: 'commune', lat: -4.3888, lng: 15.3132, aliases: ['makala'] },
  { name: 'Maluku', type: 'commune', lat: -4.0500, lng: 15.6500, aliases: ['maluku'] },
  { name: 'Masina', type: 'commune', lat: -4.3837, lng: 15.3914, aliases: ['masina', 'sans fil'] },
  { name: 'Matete', type: 'commune', lat: -4.3865, lng: 15.3449, aliases: ['matete'] },
  { name: 'Mont Ngafula', type: 'commune', lat: -4.4226, lng: 15.2528, aliases: ['mont ngafula', 'mont-ngafula', 'ngafula'] },
  { name: 'Ndjili', type: 'commune', lat: -4.3952, lng: 15.3729, aliases: ['ndjili', "n'djili", 'aeroport'] },
  { name: 'Ngaba', type: 'commune', lat: -4.3759, lng: 15.3261, aliases: ['ngaba'] },
  { name: 'Ngaliema', type: 'commune', lat: -4.3554, lng: 15.2358, aliases: ['ngaliema', 'nga', 'ngal'] },
  { name: 'Ngiri-Ngiri', type: 'commune', lat: -4.3566, lng: 15.2967, aliases: ['ngiri ngiri', 'ngiri-ngiri'] },
  { name: 'Nsele', type: 'commune', lat: -4.3214, lng: 15.5166, aliases: ['nsele', 'nsele valley'] },
  { name: 'Selembao', type: 'commune', lat: -4.3814, lng: 15.2679, aliases: ['selembao'] },

  // Avenues principales
  { name: 'Avenue de la Paix', type: 'avenue', lat: -4.3276, lng: 15.3136, aliases: ['paix', 'av paix'] },
  { name: 'Avenue Kasavubu', type: 'avenue', lat: -4.3326, lng: 15.3186, aliases: ['kasavubu', 'av kasavubu'] },
  { name: 'Avenue Mobutu', type: 'avenue', lat: -4.3376, lng: 15.3236, aliases: ['mobutu', 'av mobutu'] },
  { name: 'Avenue Lumumba', type: 'avenue', lat: -4.3426, lng: 15.3286, aliases: ['lumumba', 'av lumumba'] },
  { name: 'Avenue Kasa-Vubu', type: 'avenue', lat: -4.3476, lng: 15.3336, aliases: ['kasa-vubu', 'av kasa'] },
  { name: 'Avenue Wagenia', type: 'avenue', lat: -4.3526, lng: 15.3386, aliases: ['wagenia', 'av wagenia'] },
  { name: 'Avenue Tombalbaye', type: 'avenue', lat: -4.3576, lng: 15.3436, aliases: ['tombalbaye', 'av tombalbaye'] },
  { name: 'Avenue Foch', type: 'avenue', lat: -4.3626, lng: 15.3486, aliases: ['foch', 'av foch'] },
  { name: 'Avenue Batetela', type: 'avenue', lat: -4.3676, lng: 15.3536, aliases: ['batetela', 'av batetela'] },
  { name: 'Avenue Kilo', type: 'avenue', lat: -4.3726, lng: 15.3586, aliases: ['kilo', 'av kilo'] },

  // Boulevards
  { name: 'Boulevard du 30 Juin', type: 'boulevard', lat: -4.3276, lng: 15.3136, aliases: ['30 juin', 'bd 30 juin'] },
  { name: 'Boulevard Lumumba', type: 'boulevard', lat: -4.3326, lng: 15.3186, aliases: ['bd lumumba'] },
  { name: 'Boulevard Kasavubu', type: 'boulevard', lat: -4.3376, lng: 15.3236, aliases: ['bd kasavubu'] },
  { name: 'Boulevard Mobutu', type: 'boulevard', lat: -4.3426, lng: 15.3286, aliases: ['bd mobutu'] },

  // Rues principales
  { name: 'Rue de la Paix', type: 'rue', lat: -4.3276, lng: 15.3136, aliases: ['rue paix'] },
  { name: 'Rue Kasavubu', type: 'rue', lat: -4.3326, lng: 15.3186, aliases: ['rue kasavubu'] },
  { name: 'Rue Mobutu', type: 'rue', lat: -4.3376, lng: 15.3236, aliases: ['rue mobutu'] },
  { name: 'Rue Lumumba', type: 'rue', lat: -4.3426, lng: 15.3286, aliases: ['rue lumumba'] },
  { name: 'Rue Tombalbaye', type: 'rue', lat: -4.3476, lng: 15.3336, aliases: ['rue tombalbaye'] },

  // Landmarks & Points of Interest
  { name: 'Marché Central', type: 'landmark', lat: -4.3276, lng: 15.3136, aliases: ['marché', 'mag', 'central', 'marche'] },
  { name: 'Gare Centrale', type: 'landmark', lat: -4.3326, lng: 15.3186, aliases: ['gare', 'gare centrale'] },
  { name: 'Hôpital Général', type: 'landmark', lat: -4.3376, lng: 15.3236, aliases: ['hôpital', 'hopital', 'hôp', 'hop'] },
  { name: 'Université de Kinshasa', type: 'landmark', lat: -4.3426, lng: 15.3286, aliases: ['université', 'universite', 'unikin', 'uni'] },
  { name: 'Palais de la Nation', type: 'landmark', lat: -4.3476, lng: 15.3336, aliases: ['palais', 'nation'] },
  { name: 'Cathédrale Métropolitaine', type: 'landmark', lat: -4.3526, lng: 15.3386, aliases: ['cathédrale', 'cathedrale', 'église', 'eglise'] },
  { name: 'Stade des Martyrs', type: 'landmark', lat: -4.3576, lng: 15.3436, aliases: ['stade', 'martyrs', 'stadium'] },
  { name: 'Musée National', type: 'landmark', lat: -4.3626, lng: 15.3486, aliases: ['musée', 'musee', 'museum'] },
  { name: 'Aéroport N\'Djili', type: 'landmark', lat: -4.3726, lng: 15.3586, aliases: ['aéroport', 'airport', 'ndjili'] },
  { name: 'Port Autonome', type: 'landmark', lat: -4.3776, lng: 15.3636, aliases: ['port', 'port autonome'] },

  // Quartiers/Neighborhoods
  { name: 'Quartier Industriel', type: 'quartier', lat: -4.3276, lng: 15.3136, aliases: ['industriel', 'industrie'] },
  { name: 'Quartier Résidentiel', type: 'quartier', lat: -4.3326, lng: 15.3186, aliases: ['résidentiel', 'residential'] },
  { name: 'Quartier Commerçant', type: 'quartier', lat: -4.3376, lng: 15.3236, aliases: ['commerçant', 'commercant', 'commerce'] },
  { name: 'Quartier Administratif', type: 'quartier', lat: -4.3426, lng: 15.3286, aliases: ['administratif', 'admin'] },

  // Neighborhoods with common names
  { name: 'Matonge', type: 'quartier', lat: -4.3487, lng: 15.3077, aliases: ['matonge', 'victoire'] },
  { name: 'Binza', type: 'quartier', lat: -4.3699, lng: 15.2355, aliases: ['binza', 'binza ozone', 'binza pigeon'] },
  { name: 'Ma Campagne', type: 'quartier', lat: -4.3587, lng: 15.2504, aliases: ['ma campagne', 'macampagne'] },
  { name: 'Cité Verte', type: 'quartier', lat: -4.3860, lng: 15.2474, aliases: ['cite verte', 'cité verte'] },
  { name: 'Kingabwa', type: 'quartier', lat: -4.3308, lng: 15.3614, aliases: ['kingabwa'] },
  { name: 'Mombele', type: 'quartier', lat: -4.3656, lng: 15.3585, aliases: ['mombele'] },
  { name: 'Righini', type: 'quartier', lat: -4.3956, lng: 15.3209, aliases: ['righini'] },
  { name: 'Livulu', type: 'quartier', lat: -4.4091, lng: 15.3169, aliases: ['livulu'] },
  { name: 'Masanga Mbila', type: 'quartier', lat: -4.4085, lng: 15.3489, aliases: ['masanga mbila'] },
  { name: 'Yolo', type: 'quartier', lat: -4.3602, lng: 15.3122, aliases: ['yolo', 'yolo nord', 'yolo sud'] },
  { name: 'Proche de moi', type: 'landmark', lat: -4.3276, lng: 15.3136, aliases: ['proche', 'position actuelle', 'ici', 'current'] },
];

function normalizeLocationText(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

/**
 * Search for locations in Kinshasa
 * Supports fuzzy matching and partial text matching
 */
export function searchLocations(query: string, limit: number = 5): KinshasaLocation[] {
  if (!query || query.length < 1) {
    return [];
  }

  const lowerQuery = normalizeLocationText(query);

  // Filter locations based on name or aliases
  const matches = kinshasaLocations.filter(location => {
    const nameMatch = normalizeLocationText(location.name).includes(lowerQuery);
    const aliasMatch = location.aliases?.some(alias => normalizeLocationText(alias).includes(lowerQuery));
    return nameMatch || aliasMatch;
  });

  // Sort by relevance (exact matches first, then partial matches)
  matches.sort((a, b) => {
    const aExact = normalizeLocationText(a.name) === lowerQuery;
    const bExact = normalizeLocationText(b.name) === lowerQuery;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    // Then by name length (shorter = more relevant)
    return a.name.length - b.name.length;
  });

  return matches.slice(0, limit);
}

/**
 * Get current user location (mock - in real app, use geolocation API)
 */
export async function getCurrentLocation(): Promise<KinshasaLocation | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }

    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Find nearest location
        let nearest: KinshasaLocation | null = null;
        let minDistance = Infinity;

        kinshasaLocations.forEach(loc => {
          const distance = Math.sqrt(
            Math.pow(loc.lat - latitude, 2) + Math.pow(loc.lng - longitude, 2)
          );
          if (distance < minDistance) {
            minDistance = distance;
            nearest = loc;
          }
        });

        resolve(nearest);
      },
      () => resolve(null),
      { timeout: 5000 }
    );
  });
}

/**
 * Format location for display
 */
export function formatLocation(location: KinshasaLocation): string {
  return `${location.name} (${location.type})`;
}

/**
 * Get location coordinates
 */
export function getLocationCoordinates(location: KinshasaLocation): [number, number] {
  return [location.lat, location.lng];
}
