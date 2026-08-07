import { useState } from 'react'
import { SplashScreen } from './components/SplashScreen'
import { PwaInstallBanner } from './components/PwaInstallBanner'
import { LoginScreen } from '../app/login'
import { HomeScreen } from '../app/home'
import { VerifyAccessScreen, VerifyCheckoutScreen } from '../app/check'

type ScreenState = 'home' | 'check-in' | 'check-out'

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userPhone, setUserPhone] = useState('')
  const [activeScreen, setActiveScreen] = useState<ScreenState>('home')

  const handleLoginSuccess = (phone: string) => {
    setUserPhone(phone)
    setIsLoggedIn(true)
    setActiveScreen('home')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setActiveScreen('home')
  }

  return (
    <>
      <SplashScreen />
      <PwaInstallBanner />
      {!isLoggedIn ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : activeScreen === 'home' ? (
        <HomeScreen
          userPhone={userPhone}
          onLogout={handleLogout}
          onNavigateToCheckIn={() => setActiveScreen('check-in')}
          onNavigateToCheckOut={() => setActiveScreen('check-out')}
        />
      ) : activeScreen === 'check-in' ? (
        <VerifyAccessScreen
          mode="check-in"
          onBack={() => setActiveScreen('home')}
          onVerifySuccess={() => {}}
          onScanQR={() => {}}
        />
      ) : (
        <VerifyCheckoutScreen
          mode="check-out"
          onBack={() => setActiveScreen('home')}
          onVerifySuccess={() => {}}
          onScanQR={() => {}}
        />
      )}
    </>
  )
}

export default App
