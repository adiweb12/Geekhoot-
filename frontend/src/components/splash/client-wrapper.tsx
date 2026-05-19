'use client';
import { useEffect, useState } from 'react';
import { SplashScreen } from './splash-screen';
import { useAuthStore } from '@/store/auth.store';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [splashDone, setSplashDone] = useState(false);
  const { fetchMe, hydrated } = useAuthStore();

  // After hydration, validate token silently (prevents re-login on refresh)
  useEffect(() => {
    if (hydrated) {
      fetchMe();
    }
  }, [hydrated, fetchMe]);

  return (
    <>
      {!splashDone && <SplashScreen onFinish={() => setSplashDone(true)} />}
      <div
        style={{
          opacity: splashDone ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: splashDone ? 'auto' : 'none',
        }}
      >
        {children}
      </div>
    </>
  );
}
