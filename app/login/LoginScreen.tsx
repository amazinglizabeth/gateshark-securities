import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface LoginScreenProps {
  onLoginSuccess?: (phone: string) => void;
}

interface LoginFormInputs {
  phoneNumber: string;
  password: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    mode: 'onTouched',
    defaultValues: {
      phoneNumber: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    if (onLoginSuccess) {
      onLoginSuccess(data.phoneNumber);
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

          <form onSubmit={handleSubmit(onSubmit)} style={styles.form} noValidate>
            {/* Phone Number Field */}
            <div style={styles.inputGroup}>
              <input
                type="tel"
                placeholder="Phone number"
                style={{
                  ...styles.input,
                  borderColor: errors.phoneNumber ? '#dc2626' : '#8dbba7',
                }}
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9+\s-]{7,15}$/,
                    message: 'Please enter a valid phone number',
                  },
                })}
              />
              {errors.phoneNumber && (
                <span style={styles.errorMsg}>{errors.phoneNumber.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div style={styles.inputGroup}>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  style={{
                    ...styles.input,
                    paddingRight: '48px',
                    borderColor: errors.password ? '#dc2626' : '#8dbba7',
                  }}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
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
              {errors.password && (
                <span style={styles.errorMsg}>{errors.password.message}</span>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} style={styles.submitBtn}>
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
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  errorMsg: {
    fontSize: '13px',
    color: '#dc2626',
    fontWeight: 500,
    marginTop: '2px',
    paddingLeft: '4px',
  },
  passwordWrapper: {
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
