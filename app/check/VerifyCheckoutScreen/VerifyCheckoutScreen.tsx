import React, { useState } from 'react';
import { CheckOutInputScreen } from './CheckOutInputScreen';
import { GuestDetailsScreen } from '../GuestDetailsScreen';
import { AccessGrantedScreen } from '../AccessGrantedScreen';
import { ScanQrScreen } from '../ScanQrScreen';

interface VerifyCheckoutScreenProps {
  onBack?: () => void;
  onVerifySuccess?: (code: string) => void;
  onScanQR?: () => void;
  mode?: 'check-out';
}

type CodeStatus = 'none' | 'invalid' | 'already_checked_out';
type Step = 'input' | 'guest-details' | 'access-granted' | 'scan-qr';

export const VerifyCheckoutScreen: React.FC<VerifyCheckoutScreenProps> = ({
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

      if (trimmedCode.includes('INV') || trimmedCode.includes('EXP')) {
        setCodeStatus('invalid');
      } else if (trimmedCode.includes('OUT') || trimmedCode.includes('USED')) {
        setCodeStatus('already_checked_out');
      } else {
        setCodeStatus('none');
        if (onVerifySuccess) {
          onVerifySuccess(trimmedCode);
        }
        setCurrentStep('guest-details');
      }
    }, 700);
  };

  const handleConfirmExit = () => {
    setCurrentStep('access-granted');
  };

  const handleDeny = () => {
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

  // Render QR Code Scanner Screen in Checkout Mode
  if (currentStep === 'scan-qr') {
    return (
      <ScanQrScreen
        mode="check-out"
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

  // Render Guest Details Screen (Image 5 with "Confirm exit" button)
  if (currentStep === 'guest-details') {
    return (
      <GuestDetailsScreen
        mode="check-out"
        accessCode={accessCode || '005UHJ9'}
        confirmButtonText="Confirm exit"
        onAllow={handleConfirmExit}
        onDeny={handleDeny}
      />
    );
  }

  // Render Checkout Successful Screen
  if (currentStep === 'access-granted') {
    return (
      <AccessGrantedScreen
        mode="check-out"
        guestName="Kamsy Okafor"
        title="CHECKOUT SUCCESSFUL"
        subtitle="Kamsy Okafor has been checked out by security."
        onBackToHome={handleBackToHome}
      />
    );
  }

  // Render Input Screen
  return (
    <CheckOutInputScreen
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
