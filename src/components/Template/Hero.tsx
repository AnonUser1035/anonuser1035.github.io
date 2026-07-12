import ContactIcons from '@/components/Contact/ContactIcons';
import EmailLink from '@/components/Contact/EmailLink';

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

        <div className="hero-cta">
          <a href="/resume.pdf" download className="button button-primary">
            Download Résumé
          </a>
        </div>

        <div className="hero-contact contact-content">
          <div className="contact-email-block">
            <EmailLink />
            <p className="contact-hint">Usually respond within 24 hours</p>
          </div>

          <div className="contact-divider">
            <span>or find me on</span>
          </div>

          <ContactIcons />
        </div>
      </div>
    </section>
  );
}
