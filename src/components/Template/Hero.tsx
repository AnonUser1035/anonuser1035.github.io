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
          <span className="hero-name">Ryan S. Bohluli</span>
        </h1>

        <p className="hero-tagline">
          Computational neuroscience student at{' '}
          <a href="https://www.jhu.edu" className="hero-highlight">
            Johns Hopkins
          </a>
          . Co-founder &amp; Chief Research Officer at{' '}
          <a href="https://neurosafetysystems.com" className="hero-highlight">
            Neuro Safety Systems
          </a>
          , building closed-loop neuromodulation hardware.
          <br />
          Volunteer EMT. Aspiring physician.
        </p>

        <div className="hero-chips">
          <span className="hero-chip">Johns Hopkins &rsquo;27</span>
          <span className="hero-chip">Neurotech Founder</span>
          <span className="hero-chip">Volunteer EMT</span>
        </div>

        <div className="hero-cta">
          <a href="/resume.pdf" download className="button button-primary">
            Download Résumé
          </a>
          <Link href="#contact" className="button button-secondary">
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}
