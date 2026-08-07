import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if app is running in standalone mode (already added to home screen and opened as app)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleIOS = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: boolean }).MSStream;
    setIsIOS(isAppleIOS);

    // Listen for beforeinstallprompt event (Android / Chromium)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      const dismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show banner on iOS if not in standalone and not dismissed
    if (isAppleIOS) {
      const dismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSInstructions(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (isStandalone || !showBanner) {
    return null;
  }

  return (
    <>
      <div style={styles.bannerContainer}>
        <div style={styles.bannerContent}>
          <div style={styles.iconWrapper}>
            <img src="/gateshark-icon-192.png" alt="Gateshark Icon" style={styles.appIcon} />
          </div>
          <div style={styles.textContainer}>
            <div style={styles.title}>Install Gateshark App</div>
            <div style={styles.subtitle}>
              Add to Home Screen to launch without browser UI
            </div>
          </div>
          <div style={styles.actions}>
            <button style={styles.installBtn} onClick={handleInstallClick}>
              {isIOS ? 'Instructions' : 'Add to Home'}
            </button>
            <button style={styles.closeBtn} onClick={handleDismiss} aria-label="Close">
              ✕
            </button>
          </div>
        </div>
      </div>

      {showIOSInstructions && (
        <div style={styles.modalOverlay} onClick={() => setShowIOSInstructions(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Install on iOS</h3>
            <p style={styles.modalStep}>
              1. Tap the <strong>Share</strong> button in Safari's bottom toolbar.
            </p>
            <p style={styles.modalStep}>
              2. Scroll down and select <strong>Add to Home Screen</strong>.
            </p>
            <p style={styles.modalStep}>
              3. Tap <strong>Add</strong> in the top-right corner.
            </p>
            <button style={styles.gotItBtn} onClick={() => setShowIOSInstructions(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  bannerContainer: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 32px)',
    maxWidth: '460px',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    borderRadius: '16px',
    padding: '12px 16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
    border: '1px solid #334155',
    zIndex: 9999,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  bannerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  iconWrapper: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    overflow: 'hidden',
    flexShrink: 0,
    backgroundColor: '#1e293b',
  },
  appIcon: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  textContainer: {
    flex: 1,
    textAlign: 'left',
  },
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#f8fafc',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '2px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  installBtn: {
    backgroundColor: '#6366f1',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    zIndex: 100000,
  },
  modalCard: {
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    padding: '28px 24px 24px',
    borderRadius: '20px',
    maxWidth: '340px',
    width: '100%',
    textAlign: 'left',
    border: '1px solid #334155',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
    boxSizing: 'border-box',
  },
  modalTitle: {
    margin: '0 0 16px 0',
    fontSize: '20px',
    fontWeight: 700,
    color: '#ffffff',
  },
  modalStep: {
    fontSize: '14px',
    color: '#cbd5e1',
    marginBottom: '14px',
    lineHeight: '1.5',
  },
  gotItBtn: {
    width: '100%',
    backgroundColor: '#285843',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '16px',
    boxShadow: '0 4px 12px rgba(40, 88, 67, 0.3)',
  },
};
