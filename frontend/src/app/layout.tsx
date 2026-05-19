import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Syne } from 'next/font/google';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { QueryProvider } from '@/components/ui/query-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ClientWrapper } from '@/components/splash/client-wrapper';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: { default: 'Geekhoot — Premium Custom Merch', template: '%s | Geekhoot' },
  description: 'Shop premium custom merch — T-shirts, bottles, cups, name slips & more. Fast delivery across India.',
  keywords: ['custom merch', 'custom t-shirts', 'name slips', 'printed bottles', 'custom cups', 'India'],
  openGraph: {
    title: 'Geekhoot',
    description: 'Premium Custom Merch',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ff5200',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${syne.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)] antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <QueryProvider>
            <ClientWrapper>
              <Navbar />
              <main className="flex-1 page-enter">{children}</main>
              <Footer />
            </ClientWrapper>
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'dark:bg-zinc-800 dark:text-white text-sm font-medium',
                duration: 3000,
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
