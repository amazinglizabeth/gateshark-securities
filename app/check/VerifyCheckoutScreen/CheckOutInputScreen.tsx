import React, { useState } from 'react';

interface CheckOutInputScreenProps {
  accessCode: string;
  codeStatus: 'none' | 'invalid' | 'already_checked_out';
  isVerifying: boolean;
  onCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerify: (e: React.FormEvent) => void;
  onScanQR: () => void;
  onBack?: () => void;
}

export const CheckOutInputScreen: React.FC<CheckOutInputScreenProps> = ({
  accessCode,
  codeStatus,
  isVerifying,
  onCodeChange,
  onVerify,
  onScanQR,
  onBack,
}) => {
  const [showCode, setShowCode] = useState(false);
  const isCodeEntered = accessCode.trim().length > 0;

  return (
    <div style={styles.mobileShell}>
      <div style={styles.container}>
        {/* Header with Back Button and Logo */}
        <div style={styles.header}>
          {onBack && (
            <button style={styles.backBtn} onClick={onBack} aria-label="Back">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#347357"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
          )}

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

        {/* Verification Icon Badge & Headings */}
        <div style={styles.badgeSection}>
          <div style={styles.badgeIconBox}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#347357"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <rect x="7" y="7" width="10" height="10" rx="2" />
            </svg>
          </div>

          <h1 style={styles.title}>Verify Guest Checkout</h1>
          <p style={styles.subtitle}>
            Enter the access code shown by the guest, or scan their QR code to verify entry.
          </p>
        </div>

        {/* Access Code Form */}
        <form onSubmit={onVerify} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Access Code</label>
            <div style={styles.inputWrapper}>
              <input
                type={showCode ? 'text' : 'password'}
                placeholder="Enter access code"
                value={accessCode}
                onChange={onCodeChange}
                disabled={isVerifying}
                style={{
                  ...styles.input,
                  paddingRight: '48px',
                  ...(codeStatus === 'invalid'
                    ? styles.inputInvalid
                    : codeStatus === 'already_checked_out'
                    ? styles.inputAlreadyCheckedOut
                    : styles.inputNormal),
                }}
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                style={styles.eyeBtn}
                aria-label={showCode ? 'Hide access code' : 'Show access code'}
              >
                {showCode ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
            {codeStatus === 'invalid' && (
              <span style={styles.invalidSubtext}>Access code is invalid.</span>
            )}
            {codeStatus === 'already_checked_out' && (
              <span style={styles.alreadyCheckedOutSubtext}>Resident is already checked out.</span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isCodeEntered || isVerifying}
            style={{
              ...styles.verifyBtn,
              backgroundColor: isCodeEntered && !isVerifying ? '#347357' : '#d5e5dd',
              color: '#ffffff',
              cursor: isCodeEntered && !isVerifying ? 'pointer' : 'default',
              boxShadow: isCodeEntered && !isVerifying ? '0 4px 12px rgba(52, 115, 87, 0.25)' : 'none',
              opacity: isVerifying ? 0.85 : 1,
            }}
          >
            {isVerifying ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ animation: 'spin 1s linear infinite' }}
                >
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify code'
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.dividerRow}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or scan QR code</span>
          <div style={styles.dividerLine} />
        </div>

        {/* Scan QR Code Button */}
        <button type="button" onClick={onScanQR} style={styles.scanQrBtn}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#347357"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <rect x="7" y="7" width="10" height="10" rx="2" />
          </svg>
          Scan QR Code
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
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
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  badgeSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '32px',
  },
  badgeIconBox: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    backgroundColor: '#edf6f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  title: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 10px 0',
    letterSpacing: '-0.3px',
  },
  subtitle: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#475569',
    margin: 0,
    lineHeight: '1.5',
    maxWidth: '320px',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  eyeBtn: {
    position: 'absolute',
    right: '14px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
  },
  inputLabel: {
    fontSize: '15px',
    fontWeight: 500,
    color: '#475569',
  },
  input: {
    width: '100%',
    height: '52px',
    padding: '0 20px',
    borderRadius: '12px',
    fontSize: '17px',
    textAlign: 'center',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    fontWeight: 700,
    letterSpacing: '1.5px',
    transition: 'all 0.2s ease',
  },
  inputNormal: {
    border: '1.5px solid #8dbba7',
    color: '#347357',
    backgroundColor: '#ffffff',
  },
  inputInvalid: {
    border: '1.5px solid #dc2626',
    color: '#dc2626',
    backgroundColor: '#ffffff',
  },
  inputAlreadyCheckedOut: {
    border: '1.5px solid #b59f51',
    color: '#8c7329',
    backgroundColor: '#fdfbf5',
  },
  invalidSubtext: {
    fontSize: '14px',
    color: '#dc2626',
    marginTop: '2px',
    fontWeight: 500,
  },
  alreadyCheckedOutSubtext: {
    fontSize: '14px',
    color: '#8c7329',
    marginTop: '2px',
    fontWeight: 500,
  },
  verifyBtn: {
    width: '100%',
    height: '52px',
    borderRadius: '12px',
    fontSize: '17px',
    fontWeight: 700,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  dividerRow: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '32px 0 24px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: '14px',
    color: '#64748b',
    whiteSpace: 'nowrap',
  },
  scanQrBtn: {
    width: '100%',
    height: '52px',
    borderRadius: '12px',
    border: '1.5px solid #347357',
    backgroundColor: '#ffffff',
    color: '#347357',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'background-color 0.2s ease',
  },
};
