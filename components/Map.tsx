'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{ position: [number, number]; label: string; type?: 'pickup' | 'dropoff' | 'driver' }>;
  route?: Array<[number, number]>;
  className?: string;
}

export default function Map({
  center = [-4.3276, 15.3136],
  zoom = 13,
  markers = [],
  route = [],
  className = 'w-full h-full',
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Init carte une seule fois
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;
    if (mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      className: 'map-tiles-dark',
    }).addTo(mapRef.current);

    // Forcer Leaflet à recalculer la taille après montage
    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 100);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mise à jour markers et route
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Supprimer anciens markers/polylines
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    markers.forEach(({ position, label, type }) => {
      let iconHtml = '';

      if (type === 'pickup') {
        iconHtml = `<div style="background:linear-gradient(135deg,#29BA1F,#098C04);width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #121212;box-shadow:0 4px 14px rgba(41,186,31,0.5);display:flex;align-items:center;justify-content:center;"><div style="width:11px;height:11px;background:white;border-radius:50%;transform:rotate(45deg);"></div></div>`;
      } else if (type === 'dropoff') {
        iconHtml = `<div style="background:linear-gradient(135deg,#098C04,#0B2928);width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #121212;box-shadow:0 4px 14px rgba(9,140,4,0.5);display:flex;align-items:center;justify-content:center;"><div style="width:11px;height:11px;background:#29BA1F;border-radius:50%;transform:rotate(45deg);"></div></div>`;
      } else {
        iconHtml = `<div style="background:linear-gradient(135deg,#29BA1F,#098C04);width:46px;height:46px;border-radius:50%;border:3px solid #121212;box-shadow:0 4px 18px rgba(41,186,31,0.55);display:flex;align-items:center;justify-content:center;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg></div>`;
      }

      const icon = L.divIcon({
        className: 'custom-marker-blue',
        html: iconHtml,
        iconSize: [48, 48],
        iconAnchor: [24, 48],
      });

      L.marker(position, { icon })
        .bindPopup(`<div style="font-family:system-ui;padding:4px;color:#29BA1F;font-weight:bold;">${label}</div>`, {
          className: 'custom-popup-blue',
          closeButton: false,
        })
        .addTo(map);
    });

    if (route.length > 0) {
      L.polyline(route, { color: '#29BA1F', weight: 7, opacity: 0.18, lineCap: 'round', lineJoin: 'round' }).addTo(map);
      L.polyline(route, { color: '#29BA1F', weight: 4, opacity: 0.9,  lineCap: 'round', lineJoin: 'round' }).addTo(map);
      L.polyline(route, { color: '#ffffff', weight: 1.5, opacity: 0.5, lineCap: 'round', lineJoin: 'round', dashArray: '8, 10' }).addTo(map);

      const bounds = L.latLngBounds([...route, ...markers.map((m) => m.position)]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => m.position));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, route]);

  return (
    <div className="relative w-full h-full min-h-[inherit]">
      <div ref={mapContainerRef} className={`${className} min-h-[inherit]`} style={{ minHeight: 'inherit' }} />
      <div className="absolute inset-0 bg-[#005bff]/5 pointer-events-none mix-blend-multiply" />
    </div>
  );
}
