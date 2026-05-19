import { MessageCircle, Shield, Truck, RotateCcw } from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: 'Order via WhatsApp',
    description: 'No complicated checkout. Just tap Buy Now and send a WhatsApp message to place your order instantly.',
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    icon: Shield,
    title: 'Secure & Trusted',
    description: 'Your data is protected with enterprise-grade security. We never share your personal information.',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Same-day dispatch in Kerala. Pan-India delivery in 4–7 business days via trusted courier partners.',
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: 'Not satisfied? Contact us on WhatsApp within 7 days for hassle-free returns and refunds.',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  },
];

export function WhyGeekhoot() {
  return (
    <section className="bg-[var(--bg-secondary)] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">Why Geekhoot?</h2>
          <p className="text-[var(--fg-muted)] mt-2">Shopping made simple, secure, and fast.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="bg-[var(--bg)] rounded-2xl border border-[var(--border)] p-6 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
