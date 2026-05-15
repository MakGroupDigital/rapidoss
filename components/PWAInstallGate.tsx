'use client';

import { useEffect, useMemo, useState } from 'react';
import { RapidossLogo, IcoChevronRight } from '@/components/Icons';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const PWA_INSTALL_DISMISSED_KEY = 'rapidoss:pwa-install-dismissed-at';
const PWA_INSTALL_DISMISS_DURATION_MS = 24 * 60 * 60 * 1000;

function isStandaloneDisplay() {
  if (typeof window === 'undefined') {
    return true;
  }

  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || navigatorWithStandalone.standalone === true;
}

function isIosDevice() {
  if (typeof window === 'undefined') {
    return false;
  }

  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function wasRecentlyDismissed() {
  if (typeof window === 'undefined') {
    return false;
  }

  const dismissedAt = Number(window.localStorage.getItem(PWA_INSTALL_DISMISSED_KEY) || 0);
  return dismissedAt > 0 && Date.now() - dismissedAt < PWA_INSTALL_DISMISS_DURATION_MS;
}

export default function PWAInstallGate() {
  const [isInstalled, setIsInstalled] = useState(() => isStandaloneDisplay());
  const [isDismissed, setIsDismissed] = useState(() => wasRecentlyDismissed());
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installState, setInstallState] = useState<'idle' | 'prompting' | 'dismissed'>('idle');
  const isIos = useMemo(() => isIosDevice(), []);

  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/sw.js');
      }
    };

    void registerServiceWorker();

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setIsInstalled(isStandaloneDisplay());
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    const handleDisplayModeChange = () => {
      setIsInstalled(isStandaloneDisplay());
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    const displayModeQuery = window.matchMedia('(display-mode: standalone)');
    displayModeQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
      displayModeQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      return;
    }

    setInstallState('prompting');
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      setIsInstalled(true);
    } else {
      setInstallState('dismissed');
    }

    setInstallPrompt(null);
  };

  const handleDismiss = () => {
    window.localStorage.setItem(PWA_INSTALL_DISMISSED_KEY, String(Date.now()));
    setIsDismissed(true);
  };

  if (isInstalled || isDismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-[#121212] px-5 text-white">
      <div className="pointer-events-none absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#29BA1F]/10 blur-3xl" />
      <div className="relative w-full max-w-sm rounded-[2rem] border border-[#29BA1F]/25 bg-[#171717] p-6 shadow-2xl shadow-black/50">
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Fermer"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#121212] text-sm font-black text-[#8b8b8b] transition hover:border-[#29BA1F]/30 hover:text-white"
        >
          x
        </button>

        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#29BA1F]/25 bg-[#0B2928]">
            <RapidossLogo size={42} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#29BA1F]">Installation requise</p>
            <h1 className="text-2xl font-black text-white">Installer Rapidoss</h1>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-[#9a9a9a]">
          Rapidoss doit être installé sur votre téléphone pour une expérience fiable, rapide et plein écran.
        </p>

        {installPrompt ? (
          <button
            type="button"
            onClick={handleInstall}
            disabled={installState === 'prompting'}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#29BA1F] to-[#098C04] px-5 py-4 text-sm font-black text-white disabled:cursor-wait disabled:opacity-70"
          >
            {installState === 'prompting' ? 'Ouverture...' : 'Installer maintenant'}
            <IcoChevronRight size={16} />
          </button>
        ) : (
          <div className="mt-6 rounded-2xl border border-[#29BA1F]/20 bg-[#0B2928]/55 p-4">
            <p className="text-sm font-black text-white">
              {isIos ? 'Sur iPhone' : 'Installation manuelle'}
            </p>
            <ol className="mt-3 space-y-2 text-xs leading-5 text-[#c7c7c7]">
              {isIos ? (
                <>
                  <li>1. Ouvrez Rapidoss dans Safari.</li>
                  <li>2. Touchez le bouton Partager.</li>
                  <li>3. Choisissez “Sur l’écran d’accueil”.</li>
                  <li>4. Ouvrez Rapidoss depuis l’icône installée.</li>
                </>
              ) : (
                <>
                  <li>1. Ouvrez le menu du navigateur.</li>
                  <li>2. Choisissez “Installer l’application”.</li>
                  <li>3. Relancez Rapidoss depuis son icône.</li>
                </>
              )}
            </ol>
          </div>
        )}

        {installState === 'dismissed' ? (
          <p className="mt-4 text-center text-xs text-red-300">
            Installation annulée. Installez Rapidoss pour continuer.
          </p>
        ) : null}
      </div>
    </div>
  );
}
