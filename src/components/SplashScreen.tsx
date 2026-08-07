import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
  minimumDurationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minimumDurationMs = 1800,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Keep splash visible for minimumDurationMs to feel like a real app startup
    const timer = setTimeout(() => {
      setIsFadingOut(true);
    }, minimumDurationMs);

    const fadeTimer = setTimeout(() => {
      setIsHidden(true);
      if (onFinish) onFinish();
    }, minimumDurationMs + 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(fadeTimer);
    };
  }, [minimumDurationMs, onFinish]);

  if (isHidden) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#347357',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        transition: 'opacity 0.5s ease-in-out, visibility 0.5s ease-in-out',
        opacity: isFadingOut ? 0 : 1,
        visibility: isFadingOut ? 'hidden' : 'visible',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulseLogo 2s ease-in-out infinite alternate',
        }}
      >
        <img
          src="/splash/gateshark-logo-white.png"
          alt="GateShark"
          style={{
            width: '160px',
            height: 'auto',
            maxHeight: '220px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.15))',
          }}
        />
      </div>

      <style>{`
        @keyframes pulseLogo {
          0% {
            transform: scale(0.98);
            opacity: 0.95;
          }
          100% {
            transform: scale(1.03);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
