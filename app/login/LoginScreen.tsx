import React, { useState } from 'react';

interface LoginScreenProps {
  onLoginSuccess?: (phone: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLoginSuccess) {
      onLoginSuccess(phoneNumber);
    }
  };

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

        {/* Main Content Area */}
        <div style={styles.content}>
          <h1 style={styles.title}>Welcome to Gate Staff</h1>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <input
                type="tel"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <button type="submit" style={styles.submitBtn}>
              Log In
            </button>
          </form>
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
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '16px',
    marginBottom: '60px',
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
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '26px',
    fontWeight: 700,
    color: '#2e694e',
    marginBottom: '40px',
    textAlign: 'center',
    letterSpacing: '-0.3px',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: '52px',
    padding: '0 20px',
    borderRadius: '12px',
    border: '1.5px solid #8dbba7',
    fontSize: '16px',
    color: '#2d3748',
    backgroundColor: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease',
  },
  submitBtn: {
    width: '100%',
    height: '52px',
    borderRadius: '12px',
    backgroundColor: '#347357',
    color: '#ffffff',
    fontSize: '17px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 4px 12px rgba(52, 115, 87, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
  },
};
