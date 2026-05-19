'use client';
import { Truck, MessageCircle, ShieldCheck } from 'lucide-react';

const SETTINGS = [
  {
    icon: Truck,
    label: 'Free delivery in Kerala',
    sub: '₹99 flat for rest of India',
  },
  {
    icon: MessageCircle,
    label: 'Order instantly on WhatsApp',
    sub: 'No account needed to buy',
  },
  {
    icon: ShieldCheck,
    label: '7-day hassle-free returns',
    sub: 'Quality guaranteed on every order',
  },
];

export function AppSettingsStrip() {
  return (
    <div className="bg-[#ff5200] border-b border-orange-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-orange-500">
          {SETTINGS.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex items-center gap-3 py-3 px-4 sm:px-6"
            >
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-xs font-bold leading-tight">{label}</p>
                <p className="text-white/70 text-[11px] leading-tight mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
