'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { searchKinshasaAddresses, type GeocodeResult } from '@/lib/google-geocoding';
import { searchLocations, getCurrentLocation, type KinshasaLocation } from '@/lib/kinshasa-locations';
import { IcoNavigation, IcoPin } from '@/components/Icons';

interface LocationAutocompleteProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (location: GeocodeResult | KinshasaLocation) => void;
  icon: React.ReactNode;
  accent?: boolean;
  suggestionsPlacement?: 'up' | 'down';
  isActive?: boolean;
  onFocus?: () => void;
}

export default function LocationAutocomplete({
  placeholder,
  value,
  onChange,
  onSelect,
  icon,
  accent = false,
  suggestionsPlacement = 'down',
  isActive = true,
  onFocus,
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<(GeocodeResult | KinshasaLocation)[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<KinshasaLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchSequenceRef = useRef(0);

  // Get current location on mount
  useEffect(() => {
    const loadCurrentLocation = async () => {
      setIsLoadingLocation(true);
      const location = await getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
      }
      setIsLoadingLocation(false);
    };

    loadCurrentLocation();
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current !== null) {
      clearTimeout(searchTimeoutRef.current);
    }

    const query = value.trim();
    const sequence = searchSequenceRef.current + 1;
    const timers: NodeJS.Timeout[] = [];
    searchSequenceRef.current = sequence;

    const setCurrentSuggestions = (items: Array<GeocodeResult | KinshasaLocation>, open: boolean, searching: boolean) => {
      if (searchSequenceRef.current !== sequence) {
        return;
      }

      setSuggestions(items);
      setIsOpen(open);
      setIsSearching(searching);
    };

    if (query.length === 0) {
      timers.push(setTimeout(() => {
        setCurrentSuggestions(currentLocation ? [currentLocation] : [], true, false);
      }, 0));
    } else if (query.length < 2) {
      const localResults = searchLocations(query, 8);
      timers.push(setTimeout(() => {
        setCurrentSuggestions(localResults, localResults.length > 0, false);
      }, 0));
    } else {
      const localResults = searchLocations(query, 8);

      timers.push(setTimeout(() => {
        setCurrentSuggestions(localResults, localResults.length > 0, true);
      }, 0));

      const remoteTimer = setTimeout(async () => {
        const remoteResults = await searchKinshasaAddresses(query, 14);

        if (searchSequenceRef.current !== sequence) {
          return;
        }

        const mergedResults = mergeSuggestions([...localResults, ...remoteResults]).slice(0, 14);
        setSuggestions(mergedResults);
        setIsOpen(mergedResults.length > 0);
        setIsSearching(false);
      }, 1100);
      searchTimeoutRef.current = remoteTimer;
      timers.push(remoteTimer);
    }

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [value, currentLocation]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (location: GeocodeResult | KinshasaLocation) => {
    const name = location.name;
    onChange(name);
    onSelect(location);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    onFocus?.();

    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const isGeocodeResult = (item: GeocodeResult | KinshasaLocation): item is GeocodeResult => {
    return 'placeId' in item;
  };

  const getTypeLabel = (item: GeocodeResult | KinshasaLocation) => {
    if (!isGeocodeResult(item)) {
      const labels: Record<KinshasaLocation['type'], string> = {
        avenue: 'Avenue',
        rue: 'Rue',
        boulevard: 'Boulevard',
        quartier: 'Quartier',
        landmark: 'Repère',
        commune: 'Commune',
      };

      return labels[item.type];
    }

    const primaryType = item.types[0] ?? 'adresse';
    const labels: Record<string, string> = {
      road: 'Rue',
      residential: 'Rue',
      primary: 'Avenue',
      secondary: 'Avenue',
      tertiary: 'Avenue',
      numero: 'Numéro',
      house: 'Numéro',
      address: 'Adresse',
      adresse: 'Adresse',
      neighbourhood: 'Quartier',
      suburb: 'Quartier',
      quarter: 'Quartier',
      administrative: 'Commune',
      place: 'Lieu',
    };

    return labels[primaryType] ?? primaryType;
  };

  const getSourceLabel = (item: GeocodeResult | KinshasaLocation) => {
    if (!isGeocodeResult(item)) {
      return 'Base Kinshasa';
    }

    return item.source === 'overpass' ? 'OpenStreetMap' : 'Nominatim';
  };
  const dropdownPositionClass =
    suggestionsPlacement === 'up'
      ? 'bottom-full mb-2'
      : 'top-full mt-2';
  const dropdownAnimation =
    suggestionsPlacement === 'up'
      ? { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 8 } }
      : { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };

  return (
    <div ref={containerRef} className="relative w-full z-40">
      {/* Input */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={
            accent
              ? {
                  background: 'linear-gradient(145deg,#29BA1F,#098C04)',
                  boxShadow: '0 2px 10px rgba(41,186,31,0.4)',
                }
              : {
                  background: 'rgba(9,140,4,0.2)',
                  border: '1px solid rgba(9,140,4,0.4)',
                }
          }
        >
          {icon}
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleInputFocus}
          className="flex-1 bg-transparent text-sm text-white placeholder-[#525252]/60 outline-none"
        />
        {(isLoadingLocation || isSearching) && (
          <div className="w-4 h-4 rounded-full border-2 border-[#29BA1F]/30 border-t-[#29BA1F] animate-spin" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isActive && isOpen && suggestions.length > 0 && (
          <motion.div
            initial={dropdownAnimation.initial}
            animate={dropdownAnimation.animate}
            exit={dropdownAnimation.exit}
            transition={{ duration: 0.2 }}
            className={`absolute left-0 right-0 ${dropdownPositionClass} bg-[#1a1a1a] border border-[#29BA1F]/20 rounded-2xl shadow-2xl shadow-black/50 z-[90] overflow-hidden`}
            style={{ pointerEvents: 'auto' }}
          >
            <div className="border-b border-[#525252]/10 px-4 py-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#29BA1F]">Suggestions Kinshasa</p>
              <p className="mt-0.5 text-[10px] text-[#525252]">Communes, quartiers, avenues, rues et numéros connus</p>
            </div>

            <div className="max-h-72 overflow-y-auto scrollbar-hide">
              {suggestions.map((location, index) => {
                const isGeocode = isGeocodeResult(location);
                const displayName = location.name;
                const displayType = getTypeLabel(location);
                const isCurrent = !isGeocode && location.name === currentLocation?.name;

                return (
                  <motion.button
                    key={`${displayName}-${index}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelect(location)}
                    className="w-full px-4 py-3 text-left hover:bg-[#0B2928] transition flex items-center gap-3 border-b border-[#525252]/10 last:border-b-0"
                  >
                    <div className="flex-shrink-0">
                      {isCurrent ? (
                        <IcoNavigation size={14} className="text-[#29BA1F]" />
                      ) : (
                        <IcoPin size={14} className="text-[#525252]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                        <span className="shrink-0 rounded-full border border-[#29BA1F]/20 bg-[#0B2928] px-2 py-0.5 text-[9px] font-bold text-[#29BA1F]">
                          {displayType}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-[#525252]">
                        {isGeocode ? location.address : `Kinshasa · ${getSourceLabel(location)}`}
                      </p>
                      {isGeocode ? (
                        <p className="mt-0.5 text-[10px] text-[#525252]/70">{getSourceLabel(location)}</p>
                      ) : null}
                    </div>
                    {isCurrent && (
                      <span className="text-xs font-bold text-[#29BA1F] flex-shrink-0">Actuelle</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function normalizeSuggestionKey(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function mergeSuggestions(items: Array<GeocodeResult | KinshasaLocation>) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = normalizeSuggestionKey(`${item.name} ${'address' in item ? item.address : item.type}`);
    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
