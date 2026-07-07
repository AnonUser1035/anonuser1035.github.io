import type { Metadata } from 'next';
import { Source_Sans_3, Source_Serif_4 } from 'next/font/google';
import Script from 'next/script';

import GoogleAnalytics from '@/components/Template/GoogleAnalytics';
import Navigation from '@/components/Template/Navigation';
import ScrollToTop from '@/components/Template/ScrollToTop';
import { AUTHOR_NAME, SITE_URL, TWITTER_HANDLE } from '@/lib/utils';
import './tailwind.css';

// Variable fonts: a single file covers every weight we use (400/600/700/800)
// as true weights — no synthetic bolds — and is lighter than stacked statics.
const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
  preload: false,
  adjustFontFallback: true,
});

const siteDescription =
  'Ryan Bohluli is a computational neuroscience student at Johns Hopkins, co-founder and Chief Research Officer of Neuro Safety Systems, EMT, and aspiring physician researching closed-loop neuromodulation.';

export const metadata: Metadata = {
  title: {
    default: AUTHOR_NAME,
    template: `%s | ${AUTHOR_NAME}`,
  },
  description: siteDescription,
  keywords: [
    AUTHOR_NAME,
    'Johns Hopkins',
    'neuroscience',
    'neuromodulation',
    'neurotechnology',
    'EEG',
    'EMT',
    'pre-med',
    'Neuro Safety Systems',
    'research',
  ],
  authors: [{ name: AUTHOR_NAME }],
  creator: AUTHOR_NAME,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: AUTHOR_NAME,
    title: AUTHOR_NAME,
    description: siteDescription,
    images: [
      {
        url: '/images/me.jpg',
        width: 1200,
        height: 630,
        alt: AUTHOR_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: AUTHOR_NAME,
    description: siteDescription,
    images: ['/images/me.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${sourceSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* CSP-safe theme initialization - prevents flash on load */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=window.localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t)}else if(window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.setAttribute('data-theme','dark')}else{document.documentElement.setAttribute('data-theme','light')}}catch(e){}})();`}
        </Script>
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ScrollToTop />
        <div className="site-wrapper">
          <Navigation />
          {children}
        </div>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
