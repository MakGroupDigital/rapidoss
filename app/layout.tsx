import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Rapidoss — Livraison à la demande',
  description: 'Application de logistique et livraison à la demande à Kinshasa. Commandez, suivez et recevez vos colis en temps réel.',
  keywords: ['livraison', 'Kinshasa', 'logistique', 'colis', 'rapidoss', 'transport', 'RDC', 'Congo'],
  authors: [{ name: 'Rapidoss' }],
  creator: 'Rapidoss',
  publisher: 'Rapidoss',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://rapidoss.vercel.app'),
  openGraph: {
    title: 'Rapidoss — Livraison à la demande',
    description: 'Application de logistique et livraison à la demande à Kinshasa',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://rapidoss.vercel.app',
    siteName: 'Rapidoss',
    locale: 'fr_CD',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Rapidoss - Livraison à la demande',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rapidoss — Livraison à la demande',
    description: 'Application de logistique et livraison à la demande à Kinshasa',
    images: ['/og-image.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Rapidoss',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' },
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} font-sans`}>
      <body suppressHydrationWarning className="bg-[#121212] text-white antialiased selection:bg-[#29BA1F] selection:text-[#121212]">
        {children}
      </body>
    </html>
  );
}
