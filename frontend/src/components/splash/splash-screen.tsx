'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Only show splash once per session
    const shown = sessionStorage.getItem('splash_shown');
    if (shown) {
      setIsVisible(false);
      onFinish();
      return;
    }
    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('splash_shown', '1');
      setTimeout(onFinish, 800);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#ff5200] overflow-hidden"
        >
          {/* Animated background blobs */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-32 -left-32 w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-30 pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], rotate: [360, 180, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-400 rounded-full blur-3xl opacity-30 pointer-events-none"
          />

          <div className="relative flex flex-col items-center">
            {/* Logo box with 3D spin */}
            <motion.div
              initial={{ scale: 0, rotateY: 0 }}
              animate={{ scale: [0, 1.15, 1], rotateY: [0, 720] }}
              transition={{
                scale: { duration: 0.9, ease: 'backOut' },
                rotateY: { duration: 2.2, ease: 'easeInOut', delay: 0.3 },
              }}
              style={{ perspective: 1000 }}
              className="mb-8"
            >
              <div className="w-28 h-28 bg-white rounded-3xl shadow-2xl flex items-center justify-center ring-4 ring-white/20">
                <motion.div
                  animate={{ rotateZ: [0, 12, -12, 0], y: [0, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="text-5xl font-black text-[#ff5200]">G</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Brand name with staggered letters */}
            <div className="flex justify-center">
              {'Geekhoot'.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 32, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    delay: 0.7 + i * 0.09,
                    type: 'spring',
                    stiffness: 120,
                    damping: 12,
                  }}
                  className="text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-xl"
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.7, duration: 0.5, ease: 'backOut' }}
              className="mt-6 flex flex-col items-center"
            >
              <p className="text-white/90 text-center font-bold tracking-[0.3em] uppercase text-xs">
                Premium Custom Merch
              </p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 2, duration: 0.4 }}
                className="h-px w-16 bg-white/40 rounded-full mt-3"
              />
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-20 left-12 right-12 h-1.5 bg-black/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.7)]"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.6, ease: 'linear' }}
            />
          </div>

          {/* Built by watermark */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-7 text-white/40 text-[10px] uppercase tracking-widest font-semibold"
          >
            Built by WEBSINARO WB
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
