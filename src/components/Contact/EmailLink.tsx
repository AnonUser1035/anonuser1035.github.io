const EMAIL_PREFIX = 'ryan';
const EMAIL_DOMAIN = '@neurosafetysystems.com';

export default function EmailLink() {
  return (
    <div className="contact-email-container">
      <a
        href={`mailto:${EMAIL_PREFIX}${EMAIL_DOMAIN}`}
        className="contact-email-link"
      >
        <span className="contact-email-prefix">{EMAIL_PREFIX}</span>
        <span className="contact-email-domain">{EMAIL_DOMAIN}</span>
      </a>
    </div>
  );
}
