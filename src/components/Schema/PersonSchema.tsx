import { PROFILES } from '@/data/content';
import { AUTHOR_NAME, SITE_URL } from '@/lib/utils';
import JsonLd from './JsonLd';

export default function PersonSchema() {
  const personData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR_NAME,
    // Keeps search engines linking the pre-middle-initial name to this profile.
    alternateName: 'Ryan Bohluli',
    url: SITE_URL,
    sameAs: [PROFILES.linkedin, PROFILES.github],
    affiliation: {
      '@type': 'CollegeOrUniversity',
      name: 'Johns Hopkins University',
      url: 'https://www.jhu.edu/',
    },
  };

  return <JsonLd data={personData} />;
}
