import Link from 'next/link';

/**
 * Back affordance for in-site project apps (e.g. the workout tracker), so they
 * read as living under Projects rather than as standalone pages.
 */
export default function BackToProjects() {
  return (
    <Link href="/projects/" className="back-to-projects">
      <span className="back-to-projects-arrow" aria-hidden="true">
        ←
      </span>
      Back to projects
    </Link>
  );
}
