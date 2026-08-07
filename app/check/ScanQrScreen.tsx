import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';

interface ScanQrScreenProps {
  onCancel?: () => void;
  onSuccess?: (code: string) => void;
  mode?: 'check-in' | 'check-out';
}

type ScanStatus = 'scanning' | 'verifying' | 'expired' | 'used';


export const extractAccessCode = (raw: string): string => {
  if (!raw) return '';
  const trimmed = raw.trim();

  // Try URL parsing
  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const url = new URL(trimmed);
      const codeParam =
        url.searchParams.get('code') ||
        url.searchParams.get('accessCode') ||
        url.searchParams.get('id') ||
        url.searchParams.get('pass');
      if (codeParam) return codeParam.trim().toUpperCase();

      const segments = url.pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        return segments[segments.length - 1].trim().toUpperCase();
      }
    }
  } catch {
    // Ignore invalid URL
  }

  // Try JSON parsing
  try {
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const parsed = JSON.parse(trimmed);
      const val = parsed.code || parsed.accessCode || parsed.id || parsed.passCode;
      if (val) return String(val).trim().toUpperCase();
    }
  } catch {
    // Ignore invalid JSON
  }

  // Handle prefix like CODE:005UHJ9 or PASS-005UHJ9
  if (trimmed.includes(':')) {
    const parts = trimmed.split(':');
    return parts[parts.length - 1].trim().toUpperCase();
  }

  return trimmed.toUpperCase();
};

export const ScanQrScreen: React.FC<ScanQrScreenProps> = ({
  onCancel,
  onSuccess,
  mode = 'check-in',
}) => {
  const [status, setStatus] = useState<ScanStatus>('scanning');
  const [scannedCode, setScannedCode] = useState('005UHJ9');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Helper to trigger scan with a specific code
  const triggerScan = (codeToScan: string) => {
    stopCamera();
    const cleanCode = extractAccessCode(codeToScan);
    setScannedCode(cleanCode || '005UHJ9');
    setStatus('verifying');
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Start Camera and Video Decoding Loop
  useEffect(() => {
    let active = true;

    if (status !== 'scanning') {
      stopCamera();
      return;
    }

    const startCamera = async () => {
      setCameraError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera access is not supported on this browser context.');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsCameraActive(true);
        }

        // Real-time canvas scanning loop
        const scanFrame = () => {
          if (!active || status !== 'scanning') return;

          const video = videoRef.current;
          const canvas = canvasRef.current;

          if (video && video.readyState === video.HAVE_ENOUGH_DATA && canvas) {
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
              });

              if (qrCode && qrCode.data) {
                triggerScan(qrCode.data);
                return;
              }
            }
          }

          animationFrameRef.current = requestAnimationFrame(scanFrame);
        };

        animationFrameRef.current = requestAnimationFrame(scanFrame);
      } catch (err: any) {
        if (active) {
          console.warn('Camera initiation note:', err);
          setCameraError(
            err.message || 'Camera permission denied or camera unavailable.'
          );
          setIsCameraActive(false);
        }
      }
    };

    startCamera();

    return () => {
      active = false;
      stopCamera();
    };
  }, [status]);

  // Handle uploaded QR Code image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
          if (qrCode && qrCode.data) {
            triggerScan(qrCode.data);
          } else {
            alert('Could not detect a valid QR code in the selected image. Please try another image.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (status === 'verifying') {
      const timer = setTimeout(() => {
        const upper = scannedCode.toUpperCase();
        if (upper.includes('EXP') || upper.includes('INV')) {
          setStatus('expired');
        } else if (upper.includes('USED') || upper.includes('OUT')) {
          setStatus('used');
        } else {
          if (onSuccess) {
            onSuccess(upper);
          }
        }
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [status, scannedCode, onSuccess]);

  return (
    <div style={styles.mobileShell}>
      <div style={styles.container}>
        {/* Hidden Canvas for Decoding Frames */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Hidden File Input for QR Image Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />

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

        {/* SCANNING CAMERA VIEWPORT (IMAGE 1) */}
        {status === 'scanning' && (
          <div style={styles.viewportContent}>
            {/* Camera Viewport Container with Video Feed, Corner Brackets & Laser */}
            <div
              style={styles.cameraBox}
              onClick={() => triggerScan('005UHJ9')}
              title="Point camera at QR code or click to simulate scan"
            >
              {/* Real Video Stream Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '24px',
                  display: isCameraActive ? 'block' : 'none',
                }}
              />

              {/* Corner Frame Brackets */}
              <div style={{ ...styles.bracket, top: 24, left: 24, borderTop: '3.5px solid #ffffff', borderLeft: '3.5px solid #ffffff' }} />
              <div style={{ ...styles.bracket, top: 24, right: 24, borderTop: '3.5px solid #ffffff', borderRight: '3.5px solid #ffffff' }} />
              <div style={{ ...styles.bracket, bottom: 24, left: 24, borderBottom: '3.5px solid #ffffff', borderLeft: '3.5px solid #ffffff' }} />
              <div style={{ ...styles.bracket, bottom: 24, right: 24, borderBottom: '3.5px solid #ffffff', borderRight: '3.5px solid #ffffff' }} />

              {/* Scanning Laser Line */}
              <div style={styles.laserLine} />
            </div>

            <p style={styles.subtitle}>
              {isCameraActive
                ? "Point camera at the guest's QR code"
                : cameraError
                  ? "Camera offline — click below to upload an image or simulate scan"
                  : "Initializing camera..."}
            </p>

            {/* Code auto-fills box */}
            <div style={styles.autoFillBox}>
              <span style={styles.autoFillText}>
                {isCameraActive
                  ? "Scanning live... code auto-fills"
                  : "Code auto-fills from scan..."}
              </span>
            </div>

            {/* Upload QR Image Action */}
            <div style={styles.uploadContainer}>
              <button
                type="button"
                style={styles.uploadBtn}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload QR Image
              </button>
            </div>

            {/* Cancel Action */}
            <button type="button" onClick={onCancel} style={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        )}

        {/* VERIFYING / EXPIRED / USED QR RESULT VIEWS (IMAGES 2, 3, 4) */}
        {status !== 'scanning' && (
          <div style={styles.viewportContent}>
            {/* Scanned QR Code Image Box */}
            <div style={styles.qrCardBox}>
              <div style={styles.qrInnerFrame}>
                {/* SVG QR Code Graphic */}
                <svg width="200" height="200" viewBox="0 0 100 100" fill="none">
                  {/* Position detection patterns (outer & inner squares) */}
                  {/* Top-Left Finder */}
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                  <rect x="9" y="9" width="20" height="20" rx="2" fill="#ffffff" />
                  <rect x="13" y="13" width="12" height="12" rx="1.5" fill="#0f172a" />

                  {/* Top-Right Finder */}
                  <rect x="67" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                  <rect x="71" y="9" width="20" height="20" rx="2" fill="#ffffff" />
                  <rect x="75" y="13" width="12" height="12" rx="1.5" fill="#0f172a" />

                  {/* Bottom-Left Finder */}
                  <rect x="5" y="67" width="28" height="28" rx="4" fill="#0f172a" />
                  <rect x="9" y="71" width="20" height="20" rx="2" fill="#ffffff" />
                  <rect x="13" y="75" width="12" height="12" rx="1.5" fill="#0f172a" />

                  {/* Corner frame brackets overlay */}
                  <path d="M2 12V6a4 4 0 0 1 4-4h6" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M88 2h6a4 4 0 0 1 4 4v6" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M2 88v6a4 4 0 0 0 4 4h6" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M88 98h6a4 4 0 0 0 4-4v-6" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

                  {/* QR Data Modules grid pattern */}
                  <rect x="38" y="8" width="6" height="6" fill="#0f172a" />
                  <rect x="48" y="14" width="6" height="6" fill="#0f172a" />
                  <rect x="56" y="8" width="6" height="6" fill="#0f172a" />
                  <rect x="38" y="24" width="6" height="6" fill="#0f172a" />
                  <rect x="48" y="28" width="6" height="6" fill="#0f172a" />
                  <rect x="56" y="20" width="6" height="6" fill="#0f172a" />

                  <rect x="8" y="38" width="6" height="6" fill="#0f172a" />
                  <rect x="18" y="44" width="6" height="6" fill="#0f172a" />
                  <rect x="26" y="38" width="6" height="6" fill="#0f172a" />
                  <rect x="14" y="52" width="6" height="6" fill="#0f172a" />
                  <rect x="24" y="56" width="6" height="6" fill="#0f172a" />

                  <rect x="38" y="40" width="8" height="8" fill="#0f172a" />
                  <rect x="50" y="44" width="8" height="8" fill="#0f172a" />
                  <rect x="62" y="38" width="8" height="8" fill="#0f172a" />
                  <rect x="74" y="44" width="6" height="6" fill="#0f172a" />
                  <rect x="84" y="40" width="6" height="6" fill="#0f172a" />
                  <rect x="72" y="56" width="8" height="8" fill="#0f172a" />
                  <rect x="84" y="52" width="6" height="6" fill="#0f172a" />

                  <rect x="38" y="66" width="6" height="6" fill="#0f172a" />
                  <rect x="48" y="74" width="8" height="8" fill="#0f172a" />
                  <rect x="60" y="68" width="6" height="6" fill="#0f172a" />
                  <rect x="72" y="72" width="8" height="8" fill="#0f172a" />
                  <rect x="84" y="66" width="6" height="6" fill="#0f172a" />

                  <rect x="38" y="84" width="6" height="6" fill="#0f172a" />
                  <rect x="52" y="86" width="6" height="6" fill="#0f172a" />
                  <rect x="64" y="84" width="8" height="8" fill="#0f172a" />
                  <rect x="76" y="86" width="6" height="6" fill="#0f172a" />
                </svg>
              </div>
            </div>

            <p style={styles.subtitle}>Point camera at the guest's QR code</p>

            {/* Scanned Code Result Box */}
            <div
              style={{
                ...styles.resultCodeBox,
                ...(status === 'expired'
                  ? styles.resultExpiredBox
                  : status === 'used'
                    ? styles.resultUsedBox
                    : styles.resultNormalBox),
              }}
            >
              <span
                style={{
                  ...styles.resultCodeText,
                  color:
                    status === 'expired'
                      ? '#dc2626'
                      : status === 'used'
                        ? '#8c7329'
                        : '#347357',
                }}
              >
                {scannedCode}
              </span>
            </div>

            {/* Status Feedback / Subtext / Loader */}
            {status === 'verifying' && (
              <div style={styles.spinnerBox}>
                <div style={styles.spinner} />
              </div>
            )}

            {status === 'expired' && (
              <span style={styles.expiredSubtext}>
                {mode === 'check-out' ? 'Access code is invalid.' : 'Access code is expired.'}
              </span>
            )}

            {status === 'used' && (
              <span style={styles.usedSubtext}>
                {mode === 'check-out' ? 'Resident is already checked out.' : 'Access code has been used.'}
              </span>
            )}

            {/* Back / Retry Buttons when error */}
            {(status === 'expired' || status === 'used') && (
              <div style={styles.errorActionRow}>
                <button
                  type="button"
                  onClick={() => setStatus('scanning')}
                  style={styles.retryBtn}
                >
                  Scan Again
                </button>
                <button type="button" onClick={onCancel} style={styles.cancelBtn}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
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
    marginBottom: '28px',
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
  viewportContent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  cameraBox: {
    width: '280px',
    height: '280px',
    borderRadius: '24px',
    backgroundColor: '#061610',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '28px',
    cursor: 'pointer',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
  },
  bracket: {
    position: 'absolute',
    width: '28px',
    height: '28px',
    borderRadius: '2px',
  },
  laserLine: {
    width: '180px',
    height: '2px',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 10px #ffffff, 0 0 20px #ffffff',
  },
  subtitle: {
    fontSize: '15px',
    fontWeight: 400,
    color: '#475569',
    margin: '0 0 24px 0',
    textAlign: 'center',
  },
  autoFillBox: {
    width: '100%',
    height: '52px',
    borderRadius: '12px',
    border: '1.5px solid #8dbba7',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  autoFillText: {
    fontSize: '15px',
    color: '#94a3b8',
    fontWeight: 400,
  },
  uploadContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  uploadBtn: {
    border: '1.5px solid #347357',
    backgroundColor: '#f4faf7',
    color: '#347357',
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  cancelBtn: {
    background: 'none',
    border: 'none',
    color: '#347357',
    fontSize: '17px',
    fontWeight: 700,
    cursor: 'pointer',
    padding: '10px 24px',
    marginTop: 'auto',
    marginBottom: '12px',
  },
  qrCardBox: {
    width: '280px',
    height: '280px',
    borderRadius: '24px',
    backgroundColor: '#f6f9f7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '28px',
  },
  qrInnerFrame: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCodeBox: {
    width: '100%',
    height: '52px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    boxSizing: 'border-box',
  },
  resultNormalBox: {
    border: '1.5px solid #8dbba7',
    backgroundColor: '#ffffff',
  },
  resultExpiredBox: {
    border: '1.5px solid #dc2626',
    backgroundColor: '#ffffff',
  },
  resultUsedBox: {
    border: '1.5px solid #b59f51',
    backgroundColor: '#fdfbf5',
  },
  resultCodeText: {
    fontSize: '17px',
    fontWeight: 700,
    letterSpacing: '1.5px',
  },
  spinnerBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '8px',
  },
  spinner: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '3px solid #e2e8f0',
    borderTopColor: '#347357',
    animation: 'spin 0.8s linear infinite',
  },
  expiredSubtext: {
    fontSize: '14px',
    color: '#dc2626',
    fontWeight: 500,
    marginTop: '4px',
  },
  usedSubtext: {
    fontSize: '14px',
    color: '#8c7329',
    fontWeight: 500,
    marginTop: '4px',
  },
  errorActionRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginTop: 'auto',
    width: '100%',
    paddingBottom: '12px',
  },
  retryBtn: {
    width: '100%',
    height: '52px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#347357',
    color: '#ffffff',
    fontSize: '17px',
    fontWeight: 700,
    cursor: 'pointer',
  },
};
