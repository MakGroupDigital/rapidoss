'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Driver, VehicleType } from '@/lib/drivers';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{ position: [number, number]; label: string; type?: 'pickup' | 'dropoff' | 'driver'; driver?: Driver }>;
  route?: Array<[number, number]>;
  className?: string;
  onMarkerClick?: (marker: { position: [number, number]; label: string; type?: 'pickup' | 'dropoff' | 'driver'; driver?: Driver }) => void;
}

function getVehicleSvg(vehicle: VehicleType = 'moto') {
  const icons: Record<VehicleType, string> = {
    moto: '<path d="M5 17h2.2a3 3 0 1 0 5.6 0h2.4a3 3 0 1 0 2.8-4h-2.5l-2.2-3.5h-2.5l1.7 3.5H9.2l-1-2H5.8l1.6 3.2A3 3 0 0 0 5 17Z"/><path d="M7 17a1 1 0 1 0 2 0 1 1 0 0 0-2 0Zm9 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/>',
    voiture: '<path d="M5 16h14l-1.4-4.2A2 2 0 0 0 15.7 10H8.3a2 2 0 0 0-1.9 1.8L5 16Z"/><path d="M4 16h16v3H4v-3Z"/><path d="M7 19a1.4 1.4 0 1 0 0-2.8A1.4 1.4 0 0 0 7 19Zm10 0a1.4 1.4 0 1 0 0-2.8A1.4 1.4 0 0 0 17 19Z"/>',
    camion: '<path d="M3 9h10v8H3V9Zm10 3h4l3 3v2h-7v-5Z"/><path d="M6 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>',
    velo: '<path d="M6 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M8 14h4l2-5h-3m1 5 4-3m-6-2h-2"/>',
    tricycle: '<path d="M5 17a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm13 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M7.5 14H13l2-4h-4l-1.5-2H7"/><path d="M13 14h5"/>',
  };

  return icons[vehicle];
}

function getDriverMarkerHtml(driver?: Driver) {
  const vehicle = driver?.vehicle ?? 'moto';
  const vehicleSvg = getVehicleSvg(vehicle);
  const driverName = driver?.name ?? 'Livreur';
  const driverRating = driver?.rating?.toFixed(1) ?? '4.8';

  return `
    <div style="position:relative;width:82px;height:72px;cursor:pointer;">
      <div style="position:absolute;inset:11px;border-radius:999px;background:rgba(41,186,31,0.2);filter:blur(10px);"></div>
      <div style="position:absolute;left:17px;top:4px;width:48px;height:48px;border-radius:18px;background:linear-gradient(145deg,#29BA1F 0%,#098C04 100%);border:3px solid #121212;box-shadow:0 8px 24px rgba(0,0,0,0.45),0 0 22px rgba(41,186,31,0.55);display:flex;align-items:center;justify-content:center;">
        <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${vehicleSvg}</svg>
      </div>
      <div style="position:absolute;left:50%;top:45px;transform:translateX(-50%);display:flex;align-items:center;gap:3px;border-radius:999px;background:#121212;border:1px solid rgba(41,186,31,0.35);padding:2px 6px;color:#fff;font:800 8px system-ui;letter-spacing:.01em;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,.45);max-width:82px;">
        <span style="display:block;max-width:48px;overflow:hidden;text-overflow:ellipsis;">${driverName}</span>
        <span style="color:#fbbf24;font-size:8px;line-height:1;">★</span>
        <span style="color:#fbbf24;font-size:8px;line-height:1;">${driverRating}</span>
      </div>
    </div>
  `;
}

export default function Map({
  center = [-4.3276, 15.3136],
  zoom = 13,
  markers = [],
  route = [],
  className = 'w-full h-full',
  onMarkerClick,
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerClickRef = useRef<MapProps['onMarkerClick']>(onMarkerClick);

  useEffect(() => {
    markerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

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

    markers.forEach(({ position, label, type, driver }) => {
      let iconHtml = '';
      const markerPayload = { position, label, type, driver };

      if (type === 'pickup') {
        iconHtml = `<div style="background:linear-gradient(135deg,#29BA1F,#098C04);width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #121212;box-shadow:0 4px 14px rgba(41,186,31,0.5);display:flex;align-items:center;justify-content:center;"><div style="width:11px;height:11px;background:white;border-radius:50%;transform:rotate(45deg);"></div></div>`;
      } else if (type === 'dropoff') {
        iconHtml = `<div style="background:linear-gradient(135deg,#098C04,#0B2928);width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #121212;box-shadow:0 4px 14px rgba(9,140,4,0.5);display:flex;align-items:center;justify-content:center;"><div style="width:11px;height:11px;background:#29BA1F;border-radius:50%;transform:rotate(45deg);"></div></div>`;
      } else {
        iconHtml = getDriverMarkerHtml(driver);
      }

      const icon = L.divIcon({
        className: type === 'driver' ? 'rapidoss-driver-marker' : 'custom-marker-blue',
        html: iconHtml,
        iconSize: type === 'driver' ? [82, 72] : [48, 48],
        iconAnchor: type === 'driver' ? [41, 60] : [24, 48],
      });

      const marker = L.marker(position, {
        icon,
        interactive: true,
        bubblingMouseEvents: false,
        keyboard: true,
        title: label,
      }).addTo(map);

      if (type !== 'driver') {
        marker.bindPopup(`<div style="font-family:system-ui;padding:4px;color:#29BA1F;font-weight:bold;">${label}</div>`, {
          className: 'custom-popup-blue',
          closeButton: false,
        });
      }

      if (type === 'driver' && driver) {
        const selectDriver = () => {
          markerClickRef.current?.(markerPayload);
        };

        marker.on('click', selectDriver);
        marker.on('keypress', selectDriver);
        marker.on('add', () => {
          const element = marker.getElement();

          if (!element) {
            return;
          }

          element.setAttribute('role', 'button');
          element.setAttribute('tabindex', '0');
          element.style.pointerEvents = 'auto';
          element.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            selectDriver();
          };
          element.ontouchend = (event) => {
            event.preventDefault();
            event.stopPropagation();
            selectDriver();
          };
        });
      }
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
