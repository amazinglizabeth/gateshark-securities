import React, { useState } from 'react';
import { CheckInInputScreen } from './CheckInInputScreen';
import { GuestDetailsScreen } from '../GuestDetailsScreen';
import { AccessGrantedScreen } from '../AccessGrantedScreen';
import { ScanQrScreen } from '../ScanQrScreen';

interface VerifyAccessScreenProps {
  onBack?: () => void;
  onVerifySuccess?: (code: string) => void;
  onScanQR?: () => void;
  mode?: 'check-in';
}

type CodeStatus = 'none' | 'expired' | 'used';
type Step = 'input' | 'guest-details' | 'access-granted' | 'scan-qr';

export const VerifyAccessScreen: React.FC<VerifyAccessScreenProps> = ({
  onBack,
  onVerifySuccess,
  onScanQR,
}) => {
  const [accessCode, setAccessCode] = useState('');
  const [codeStatus, setCodeStatus] = useState<CodeStatus>('none');
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('input');

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccessCode(e.target.value.toUpperCase());
    if (codeStatus !== 'none') {
      setCodeStatus('none');
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCode = accessCode.trim().toUpperCase();
    if (!trimmedCode || isVerifying) return;

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);

      if (trimmedCode.includes('EXP')) {
        setCodeStatus('expired');
      } else if (trimmedCode.includes('USED')) {
        setCodeStatus('used');
      } else {
        setCodeStatus('none');
        if (onVerifySuccess) {
          onVerifySuccess(trimmedCode);
        }
        setCurrentStep('guest-details');
      }
    }, 700);
  };

  const handleAllowAccess = () => {
    setCurrentStep('access-granted');
  };

  const handleDenyAccess = () => {
    if (onBack) {
      onBack();
    } else {
      setCurrentStep('input');
    }
  };

  const handleBackToHome = () => {
    if (onBack) {
      onBack();
    } else {
      setAccessCode('');
      setCodeStatus('none');
      setCurrentStep('input');
    }
  };

  const handleScanQRClick = () => {
    if (onScanQR) {
      onScanQR();
    }
    setCurrentStep('scan-qr');
  };

  // Render QR Code Scanner Screen
  if (currentStep === 'scan-qr') {
    return (
      <ScanQrScreen
        mode="check-in"
        onCancel={() => setCurrentStep('input')}
        onSuccess={(code) => {
          setAccessCode(code);
          if (onVerifySuccess) {
            onVerifySuccess(code);
          }
          setCurrentStep('guest-details');
        }}
      />
    );
  }

  // Render Guest Details Screen
  if (currentStep === 'guest-details') {
    return (
      <GuestDetailsScreen
        mode="check-in"
        accessCode={accessCode || '005UHJ9'}
        onAllow={handleAllowAccess}
        onDeny={handleDenyAccess}
      />
    );
  }

  // Render Access Granted Screen
  if (currentStep === 'access-granted') {
    return (
      <AccessGrantedScreen
        mode="check-in"
        guestName="Kamsy Okafor"
        onBackToHome={handleBackToHome}
      />
    );
  }

  // Render Input Screen
  return (
    <CheckInInputScreen
      accessCode={accessCode}
      codeStatus={codeStatus}
      isVerifying={isVerifying}
      onCodeChange={handleCodeChange}
      onVerify={handleVerify}
      onScanQR={handleScanQRClick}
      onBack={onBack}
    />
  );
};
