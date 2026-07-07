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
          I&rsquo;m drawn to the gap between understanding how a system works
          and being able to act on it in real time &mdash; that&rsquo;s what
          pulled me into computational neuroscience at{' '}
          <a href="https://www.jhu.edu" className="hero-highlight">
            Johns Hopkins
          </a>
          , and into building closed-loop neuromodulation hardware as co-founder
          &amp; Chief Research Officer at{' '}
          <a href="https://neurosafetysystems.com" className="hero-highlight">
            Neuro Safety Systems
          </a>
          .
          <br />I still volunteer as an EMT &mdash; it keeps me honest about the
          difference between a system that works on paper and one that works in
          someone&rsquo;s actual worst five minutes.
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
