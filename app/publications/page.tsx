import type { Metadata } from 'next';

import LegacyRedirect from '@/components/Template/LegacyRedirect';

export const metadata: Metadata = {
  title: 'Publications',
  robots: { index: false, follow: true },
};

export default function PublicationsRedirect() {
  return <LegacyRedirect to="/#publications" label="Publications" />;
}
