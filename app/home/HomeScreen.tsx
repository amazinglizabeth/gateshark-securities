import React from 'react';

interface HomeScreenProps {
  userPhone?: string;
  onNavigateToCheckIn?: () => void;
  onNavigateToCheckOut?: () => void;
  onLogout?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToCheckIn,
  onNavigateToCheckOut,
  onLogout,
}) => {
  return (
    <div style={styles.mobileShell}>
      <div style={styles.container}>
        {/* Top Header Logo */}
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

        {/* Estate & Gate Person Info */}
        <div style={styles.estateSection}>
          <div style={styles.estateIconBox}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#347357"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h1 style={styles.estateName}>Gateshark Estate</h1>
          <p style={styles.gatePersonInfo}>Gate Person · Aliu Abu</p>
        </div>

        {/* Action Cards Container */}
        <div style={styles.cardsContainer}>
          {/* Check in Card */}
          <div
            style={styles.actionCard}
            onClick={onNavigateToCheckIn}
            role="button"
            tabIndex={0}
          >
            <div style={styles.actionIconBox}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#347357"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
            <div style={styles.actionTextContent}>
              <h2 style={styles.actionTitle}>Check in</h2>
              <p style={styles.actionSubtitle}>
                Verify and admit an arriving guest or resident.
              </p>
            </div>
            <div style={styles.chevronBox}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>

          {/* Check out Card */}
          <div
            style={styles.actionCard}
            onClick={onNavigateToCheckOut}
            role="button"
            tabIndex={0}
          >
            <div style={styles.actionIconBox}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#347357"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <div style={styles.actionTextContent}>
              <h2 style={styles.actionTitle}>Check out</h2>
              <p style={styles.actionSubtitle}>
                Log a departing guest or resident out at the gate.
              </p>
            </div>
            <div style={styles.chevronBox}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Optional Logout Link at bottom */}
        {onLogout && (
          <button style={styles.logoutBtn} onClick={onLogout}>
            Log out
          </button>
        )}
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
    padding: 'calc(24px + env(safe-area-inset-top, 0px)) 20px calc(36px + env(safe-area-inset-bottom, 0px))',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '16px',
    marginBottom: '44px',
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
  estateSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '40px',
  },
  estateIconBox: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    backgroundColor: '#edf6f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  estateName: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 6px 0',
    letterSpacing: '-0.3px',
  },
  gatePersonInfo: {
    fontSize: '15px',
    fontWeight: 500,
    color: '#64748b',
    margin: 0,
  },
  cardsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  actionCard: {
    width: '100%',
    padding: '18px 20px',
    borderRadius: '20px',
    border: '1.5px solid #e2e8f0',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  },
  actionIconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    backgroundColor: '#edf6f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionTextContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  actionTitle: {
    fontSize: '17px',
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 4px 0',
  },
  actionSubtitle: {
    fontSize: '13px',
    fontWeight: 400,
    color: '#64748b',
    margin: 0,
    lineHeight: '1.4',
  },
  chevronBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoutBtn: {
    marginTop: 'auto',
    paddingTop: '32px',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
