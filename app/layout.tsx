import type { Metadata, Viewport } from 'next';
import { preload } from 'react-dom';

import GoogleAnalytics from '@/components/Template/GoogleAnalytics';
import { DESCRIPTION } from '@/data/content';
import { AUTHOR_NAME, OG_IMAGE, SITE_URL, TWITTER_HANDLE } from '@/lib/utils';
import './global.css';

// Both faces are used above the fold (the name, and the italic caption).
const FONTS = [
  '/fonts/newsreader-roman.woff2',
  '/fonts/newsreader-italic.woff2',
];

export const metadata: Metadata = {
  title: {
    default: AUTHOR_NAME,
    template: `%s | ${AUTHOR_NAME}`,
  },
  description: DESCRIPTION,
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
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: AUTHOR_NAME,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
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

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF8F5' },
    { media: '(prefers-color-scheme: dark)', color: '#121419' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  for (const href of FONTS) {
    preload(href, { as: 'font', type: 'font/woff2', crossOrigin: '' });
  }

  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
