'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, ShieldCheck, Zap, MessageCircle } from 'lucide-react';

const TRUST_BADGES = [
  { icon: Truck,          text: '48-hr delivery' },
  { icon: ShieldCheck,    text: 'Quality guaranteed' },
  { icon: MessageCircle,  text: 'WhatsApp ordering' },
  { icon: Zap,            text: 'Custom prints' },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#ff5200] min-h-[520px] flex items-center">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative blobs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-400/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="text-white text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest"
            >
              <Zap className="w-3.5 h-3.5" />
              Custom Merch, Delivered Fast
            </motion.div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight mb-6 uppercase">
              WEAR YOUR{' '}
              <span className="text-white/60 italic">STORY.</span>
            </h1>

            <p className="text-white/80 text-base sm:text-lg mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Premium quality custom prints crafted with passion — T-shirts, bottles, cups, name slips & more. Order in seconds via WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#ff5200] font-bold text-sm hover:bg-orange-50 active:scale-95 transition-all shadow-xl shadow-black/10"
              >
                Explore Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products?category=Custom+T-Shirts"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-bold text-sm hover:bg-white/10 active:scale-95 transition-all"
              >
                Shop T-Shirts
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
              {TRUST_BADGES.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-3 py-2"
                >
                  <Icon className="w-4 h-4 text-white/80 shrink-0" />
                  <span className="text-white/80 text-xs font-medium">{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Floating product preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex justify-center items-center"
          >
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-80 h-80 bg-white rounded-[3rem] shadow-2xl shadow-black/20 flex items-center justify-center p-8 relative"
            >
              <div className="absolute -top-5 -right-5 w-20 h-20 bg-amber-300 rounded-full blur-2xl opacity-50" />
              <div className="absolute -bottom-3 -left-5 w-16 h-16 bg-orange-300 rounded-full blur-2xl opacity-40" />
              <div className="w-full h-full rounded-2xl overflow-hidden bg-orange-50 flex items-center justify-center">
                <span className="text-8xl">👕</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
