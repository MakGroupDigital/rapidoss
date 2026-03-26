/**
 * Rapidoss Custom Icon Set
 * Charte : #121212 · #525252 · #0B2928 · #098C04 · #29BA1F · #FFFFFF
 * Tous les icônes sont des SVG inline personnalisés — aucune lib externe.
 */

type IconProps = { size?: number; className?: string; strokeWidth?: number };
const d = (size = 22, cls = '', sw = 1.8) => ({
  width: size, height: size, viewBox: '0 0 24 24',
  fill: 'none', stroke: 'currentColor', strokeWidth: sw,
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  className: cls,
});

/* ── Navigation ── */
export const IcoHome = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1V10.5z" />
    <path d="M9 22V12h6v10" />
  </svg>
);

export const IcoMap = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </svg>
);

export const IcoHistory = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12,7 12,12 15,15" />
    <path d="M3.5 8.5A9 9 0 013 12" strokeDasharray="2 2" />
  </svg>
);

export const IcoUser = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

export const IcoWallet = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <rect x="2" y="6" width="20" height="14" rx="3" />
    <path d="M2 10h20" />
    <circle cx="17" cy="15" r="1.5" fill="currentColor" stroke="none" />
    <path d="M6 6V4a2 2 0 012-2h8a2 2 0 012 2v2" />
  </svg>
);

export const IcoPackage = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
    <polyline points="2,7 12,12 22,7" />
    <line x1="12" y1="12" x2="12" y2="22" />
    <line x1="7" y1="4.5" x2="17" y2="9.5" />
  </svg>
);

/* ── Actions ── */
export const IcoZap = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H13L13 2z" />
  </svg>
);

export const IcoArrowLeft = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <path d="M19 12H5" />
    <path d="M11 6l-6 6 6 6" />
  </svg>
);

export const IcoChevronRight = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const IcoMenu = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <line x1="3" y1="7" x2="21" y2="7" />
    <line x1="3" y1="12" x2="16" y2="12" />
    <line x1="3" y1="17" x2="21" y2="17" />
  </svg>
);

export const IcoPlus = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <line x1="12" y1="4" x2="12" y2="20" />
    <line x1="4" y1="12" x2="20" y2="12" />
  </svg>
);

export const IcoArrowUp = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <path d="M12 19V5" />
    <path d="M5 12l7-7 7 7" />
  </svg>
);

/* ── Livraison ── */
export const IcoPin = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <circle cx="12" cy="9" r="4" />
    <path d="M12 2C7.6 2 4 5.6 4 9c0 5.4 8 13 8 13s8-7.6 8-13c0-3.4-2.6-7-8-7z" />
    <circle cx="12" cy="9" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export const IcoNavigation = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <polygon points="12,2 22,12 12,10 2,12" />
    <line x1="12" y1="10" x2="12" y2="22" />
  </svg>
);

export const IcoBike = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <circle cx="6" cy="16" r="3.5" />
    <circle cx="18" cy="16" r="3.5" />
    <path d="M6 16l4-8h4l2 4" />
    <path d="M14 8h3l1 4" />
    <circle cx="14" cy="7" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IcoShield = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <path d="M12 2L4 6v6c0 5 3.6 9.7 8 11 4.4-1.3 8-6 8-11V6L12 2z" />
    <polyline points="8,12 11,15 16,9" />
  </svg>
);

export const IcoClock = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12,7 12,12 15.5,14.5" />
  </svg>
);

export const IcoStar = ({ size = 22, className = '', strokeWidth = 1.8, filled = false }: IconProps & { filled?: boolean }) => (
  <svg {...d(size, className, strokeWidth)}>
    <polygon
      points="12,2 15.1,8.3 22,9.3 17,14.1 18.2,21 12,17.8 5.8,21 7,14.1 2,9.3 8.9,8.3"
      fill={filled ? 'currentColor' : 'none'}
    />
  </svg>
);

export const IcoTrend = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <polyline points="3,17 8,12 12,15 17,8 21,11" />
    <polyline points="17,8 21,8 21,12" />
  </svg>
);

/* ── Communication ── */
export const IcoPhone = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <path d="M6.6 10.8a15.2 15.2 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.6 3.6 1 1 0 01-.25 1L6.6 10.8z" />
  </svg>
);

export const IcoMessage = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
    <line x1="8" y1="9" x2="16" y2="9" />
    <line x1="8" y1="13" x2="13" y2="13" />
  </svg>
);

/* ── Paiement ── */
export const IcoCard = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <rect x="2" y="5" width="20" height="14" rx="3" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="6" y1="15" x2="10" y2="15" />
    <line x1="14" y1="15" x2="18" y2="15" />
  </svg>
);

export const IcoCash = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <rect x="2" y="7" width="20" height="12" rx="2" />
    <circle cx="12" cy="13" r="3" />
    <line x1="6" y1="7" x2="6" y2="19" />
    <line x1="18" y1="7" x2="18" y2="19" />
  </svg>
);

/* ── Status ── */
export const IcoCheck = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="8,12 11,15 16,9" />
  </svg>
);

export const IcoPower = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <path d="M12 2v6" />
    <path d="M6.3 5.3A8 8 0 1017.7 5.3" />
  </svg>
);

export const IcoSparkle = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
    <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" />
    <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" />
  </svg>
);

export const IcoLogout = ({ size = 22, className = '', strokeWidth = 1.8 }: IconProps) => (
  <svg {...d(size, className, strokeWidth)}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

/* ── Logo Rapidoss ── */
export const RapidossLogo = ({ size = 40, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Hexagone fond */}
    <path d="M24 3L43 13.5V34.5L24 45L5 34.5V13.5L24 3Z" fill="#0B2928" stroke="#29BA1F" strokeWidth="1.5" />
    {/* Éclair stylisé */}
    <path d="M27 8L16 25h9l-4 15 11-17h-9L27 8z" fill="#29BA1F" />
    {/* Point lumineux */}
    <circle cx="27" cy="8" r="2" fill="#29BA1F" opacity="0.6" />
  </svg>
);

/* ── Nav icons spéciaux (version filled pour état actif) ── */

export const IcoNavHome = ({ size = 24, active = false }: { size?: number; active?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    {active ? (
      <>
        <path d="M14 3L3 12.5V25H10.5V18H17.5V25H25V12.5L14 3Z" fill="#29BA1F" />
        <rect x="11" y="18" width="6" height="7" rx="1.5" fill="#0B2928" />
        <path d="M14 3L3 12.5" stroke="#29BA1F" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ) : (
      <>
        <path d="M14 3L3 12.5V25H10.5V18H17.5V25H25V12.5L14 3Z" stroke="#525252" strokeWidth="1.6" strokeLinejoin="round" />
        <rect x="11" y="18" width="6" height="7" rx="1.5" stroke="#525252" strokeWidth="1.4" />
      </>
    )}
  </svg>
);

export const IcoNavOrders = ({ size = 24, active = false }: { size?: number; active?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    {active ? (
      <>
        <rect x="4" y="4" width="20" height="20" rx="4" fill="#0B2928" stroke="#29BA1F" strokeWidth="1.5" />
        <circle cx="14" cy="11" r="3.5" fill="#29BA1F" />
        <path d="M7 21c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="#29BA1F" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ) : (
      <>
        <rect x="4" y="4" width="20" height="20" rx="4" stroke="#525252" strokeWidth="1.5" />
        <circle cx="14" cy="11" r="3.5" stroke="#525252" strokeWidth="1.5" />
        <path d="M7 21c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" />
      </>
    )}
  </svg>
);

export const IcoNavHistory = ({ size = 24, active = false }: { size?: number; active?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    {active ? (
      <>
        <circle cx="14" cy="14" r="10" fill="#0B2928" stroke="#29BA1F" strokeWidth="1.5" />
        <polyline points="14,8 14,14 18,17" stroke="#29BA1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 9A10 10 0 014 14" stroke="#29BA1F" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
        <circle cx="14" cy="14" r="1.5" fill="#29BA1F" />
      </>
    ) : (
      <>
        <circle cx="14" cy="14" r="10" stroke="#525252" strokeWidth="1.5" />
        <polyline points="14,8 14,14 18,17" stroke="#525252" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}
  </svg>
);

export const IcoNavProfile = ({ size = 24, active = false }: { size?: number; active?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    {active ? (
      <>
        <circle cx="14" cy="10" r="5" fill="#29BA1F" />
        <path d="M5 24c0-5 4-9 9-9s9 4 9 9" fill="#0B2928" stroke="#29BA1F" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="10" r="2" fill="#0B2928" />
      </>
    ) : (
      <>
        <circle cx="14" cy="10" r="5" stroke="#525252" strokeWidth="1.5" />
        <path d="M5 24c0-5 4-9 9-9s9 4 9 9" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" />
      </>
    )}
  </svg>
);

export const IcoNavDriver = ({ size = 24, active = false }: { size?: number; active?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    {active ? (
      <>
        <circle cx="8" cy="19" r="3.5" fill="#29BA1F" />
        <circle cx="20" cy="19" r="3.5" fill="#29BA1F" />
        <path d="M8 19l4-9h4l3 5" stroke="#29BA1F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 10h3.5l1.5 4" stroke="#29BA1F" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="16" cy="8.5" r="1.5" fill="#29BA1F" />
      </>
    ) : (
      <>
        <circle cx="8" cy="19" r="3.5" stroke="#525252" strokeWidth="1.5" />
        <circle cx="20" cy="19" r="3.5" stroke="#525252" strokeWidth="1.5" />
        <path d="M8 19l4-9h4l3 5" stroke="#525252" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 10h3.5l1.5 4" stroke="#525252" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="16" cy="8.5" r="1.5" fill="#525252" />
      </>
    )}
  </svg>
);

export const IcoNavWallet = ({ size = 24, active = false }: { size?: number; active?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    {active ? (
      <>
        <rect x="3" y="8" width="22" height="16" rx="3.5" fill="#0B2928" stroke="#29BA1F" strokeWidth="1.5" />
        <path d="M3 13h22" stroke="#29BA1F" strokeWidth="1.4" />
        <circle cx="19.5" cy="18.5" r="2" fill="#29BA1F" />
        <path d="M7 8V6a3 3 0 013-3h8a3 3 0 013 3v2" stroke="#29BA1F" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ) : (
      <>
        <rect x="3" y="8" width="22" height="16" rx="3.5" stroke="#525252" strokeWidth="1.5" />
        <path d="M3 13h22" stroke="#525252" strokeWidth="1.4" />
        <circle cx="19.5" cy="18.5" r="2" fill="#525252" />
        <path d="M7 8V6a3 3 0 013-3h8a3 3 0 013 3v2" stroke="#525252" strokeWidth="1.4" strokeLinecap="round" />
      </>
    )}
  </svg>
);

/* ── Bouton central CTA nav ── */
export const IcoNavCTA = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M16 4L6 17h8l-2 11 12-14h-8L16 4z" fill="white" />
    <circle cx="16" cy="4" r="2" fill="white" opacity="0.5" />
  </svg>
);

/* ── Suggestion icons ── */
export const IcoNearMe = ({ size = 22, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.4" />
    <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.6" />
    <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="2" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IcoHomePin = ({ size = 22, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L4 8v13h5v-6h6v6h5V8L12 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="12" cy="8" r="1.5" fill="currentColor" />
  </svg>
);

export const IcoOfficePin = ({ size = 22, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1.4" />
    <rect x="7" y="13" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="14" y="13" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="10.5" y="17" width="3" height="4" rx="0.5" fill="currentColor" />
  </svg>
);

export const IcoMarketPin = ({ size = 22, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 6h18l-2 7H5L3 6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="9" cy="19" r="2" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="17" cy="19" r="2" stroke="currentColor" strokeWidth="1.6" />
    <line x1="3" y1="6" x2="1" y2="2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/* ── Bouton commander compact ── */
export const IcoOrderCTA = ({ size = 22, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    {/* Éclair */}
    <path d="M18 4L9 18h7l-2 10 12-16h-7L18 4z" fill="white" />
    {/* Cercle de glow */}
    <circle cx="16" cy="16" r="14" stroke="white" strokeWidth="1" opacity="0.2" />
  </svg>
);

/* ── Google icon (onboarding) ── */
export const IcoGoogle = ({ size = 22, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
