import React from 'react';

interface AccessGrantedScreenProps {
  guestName?: string;
  mode?: 'check-in' | 'check-out';
  title?: string;
  subtitle?: string;
  onBackToHome?: () => void;
}

export const AccessGrantedScreen: React.FC<AccessGrantedScreenProps> = ({
  guestName = 'Kamsy Okafor',
  mode = 'check-in',
  title,
  subtitle,
  onBackToHome,
}) => {
  const displayTitle =
    title || (mode === 'check-out' ? 'CHECKOUT SUCCESSFUL' : 'ACCESS GRANTED');
  const displaySubtitle =
    subtitle ||
    (mode === 'check-out'
      ? `${guestName} has been checked out by security.`
      : `${guestName} has been granted access by security.`);
  return (
    <div style={styles.mobileShell}>
      <div style={styles.container}>
        {/* Header Logo */}
        <div style={styles.header}>
          <div style={styles.logoRow}>
            <svg
              width="36"
              height="40"
              viewBox="0 0 48 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ flexShrink: 0 }}
            >
              <path
                fill="#347357"
                d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
              />
            </svg>
            <span style={styles.logoText}>GateShark</span>
          </div>
        </div>

        {/* Access Granted Content */}
        <div style={styles.grantedContainer}>
          {/* Circular Success Icon from public/sucess.svg */}
          <img
            src="/sucess.svg"
            alt="Success"
            style={{
              width: '160px',
              height: '160px',
              marginBottom: '32px',
              objectFit: 'contain',
            }}
          />

          <h1 style={styles.grantedTitle}>{displayTitle}</h1>
          <p style={styles.grantedSubtitle}>{displaySubtitle}</p>

          <div style={styles.grantedButtonBox}>
            <button
              type="button"
              onClick={onBackToHome}
              style={styles.backHomeBtn}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  mobileShell: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    overflowY: 'auto',
  },
  container: {
    width: '100%',
    maxWidth: '430px',
    minHeight: '100vh',
    padding: 'calc(24px + env(safe-area-inset-top, 0px)) 24px calc(36px + env(safe-area-inset-bottom, 0px))',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
    position: 'relative',
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '8px',
    marginBottom: '20px',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#2d3748',
    letterSpacing: '-0.4px',
  },
  grantedContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: '40px',
  },
  grantedBadgeOuter: {
    width: '170px',
    height: '170px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #d4e157 0%, #a2d149 30%, #4caf50 65%, #2e7d32 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '32px',
    padding: '8px',
    boxShadow: '0 10px 25px rgba(0, 166, 81, 0.15)',
  },
  grantedBadgeInner: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 0 0 3px #f5f942',
  },
  grantedTitle: {
    fontSize: '26px',
    fontWeight: 800,
    color: '#00a651',
    margin: '0 0 12px 0',
    letterSpacing: '-0.2px',
  },
  grantedSubtitle: {
    fontSize: '15px',
    fontWeight: 400,
    color: '#475569',
    margin: '0 0 40px 0',
    textAlign: 'center',
    maxWidth: '300px',
    lineHeight: '1.4',
  },
  grantedButtonBox: {
    width: '100%',
    marginTop: 'auto',
    paddingBottom: '12px',
  },
  backHomeBtn: {
    width: '100%',
    height: '52px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#347357',
    color: '#ffffff',
    fontSize: '17px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(52, 115, 87, 0.25)',
  },
};
