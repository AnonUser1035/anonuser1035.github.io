import Link from 'next/link';

import ThemePortrait from './ThemePortrait';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-avatar">
          <ThemePortrait width={160} height={160} priority />
        </div>

        <h1 className="hero-title">
          <span className="hero-name">Ryan Bohluli</span>
        </h1>

        <p className="hero-tagline">
          Computational neuroscience at{' '}
          <a href="https://www.jhu.edu" className="hero-highlight">
            Johns Hopkins
          </a>
          , co-founder &amp; Chief Research Officer at{' '}
          <a href="https://neurosafetysystems.com" className="hero-highlight">
            Neuro Safety Systems
          </a>
          , EMT, and aspiring physician.
          <br />
          Building closed-loop neuromodulation systems and wearable
          neurotechnology.
        </p>

        <div className="hero-chips">
          <span className="hero-chip">Johns Hopkins &rsquo;27</span>
          <span className="hero-chip">Neurotech Founder</span>
          <span className="hero-chip">Volunteer EMT</span>
        </div>

        <div className="hero-cta">
          <Link href="/about" className="button button-primary">
            About Me
          </Link>
          <Link href="/resume" className="button button-secondary">
            View Resume
          </Link>
        </div>
      </div>
    </section>
  );
}
