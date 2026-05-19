'use client';
import { motion } from 'framer-motion';
import { MessageCircle, ShieldCheck, Truck, RotateCcw, Sparkles, Quote } from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: 'Order via WhatsApp',
    description: 'No complicated checkout. Tap Buy Now and place your order instantly on WhatsApp.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Guaranteed',
    description: 'Premium bio-wash fabrics and fade-proof prints. Every product quality-tested.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: '48-hour dispatch. Pan-India delivery in 4–7 days via trusted courier partners.',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: 'Not satisfied? Contact us within 7 days for hassle-free returns and refunds.',
    color: 'bg-purple-100 text-purple-700',
  },
];

export function WhyGeekhoot() {
  return (
    <>
      {/* Features grid */}
      <section className="bg-[var(--bg-secondary)] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">Why Geekhoot?</h2>
            <p className="text-[var(--fg-muted)] mt-2 text-sm">Premium custom merch, delivered with care.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, description, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[var(--bg)] rounded-2xl border border-[var(--border)] p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2 text-sm">{title}</h3>
                <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder quote banner */}
      <section className="bg-[#ff5200] py-16 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-3xl mx-auto text-center text-white relative z-10">
          <Quote className="w-10 h-10 mx-auto mb-6 opacity-40 rotate-180" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-4xl font-black italic tracking-tight leading-tight mb-8"
          >
            &ldquo;Quality is not just a standard,<br /> but a promise in every stitch and print.&rdquo;
          </motion.p>
          <p className="font-bold uppercase tracking-[0.4em] text-xs text-white/60">Gautam &mdash; Founder, Geekhoot</p>
        </div>
      </section>

      {/* Powered by watermark */}
      <div className="py-5 bg-[var(--bg)] text-center">
        <p className="text-[10px] font-bold text-[var(--fg-muted)] uppercase tracking-[0.25em] flex items-center justify-center gap-2">
          Website built by{' '}
          <span className="text-[#ff5200]">WEBSINARO</span>
          <span className="px-1.5 py-0.5 border border-[var(--border)] rounded text-[8px]">WB</span>
        </p>
      </div>
    </>
  );
}
