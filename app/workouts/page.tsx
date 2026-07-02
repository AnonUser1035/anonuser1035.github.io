import type { Metadata } from 'next';

import BackToProjects from '@/components/Projects/BackToProjects';
import PageWrapper from '@/components/Template/PageWrapper';
import EmomPlayer from '@/components/Workouts/EmomPlayer';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: "David Rosen's EMOMs",
  description:
    'An interval timer for EMOM workouts — a running clock rotates through movements every minute, with audio cues, pacing targets, and the screen kept awake.',
  path: '/workouts/',
});

export default function WorkoutsPage() {
  return (
    <PageWrapper>
      <section className="workouts-page">
        <BackToProjects />
        <header className="workouts-header">
          <h1 className="workouts-title">David Rosen&apos;s EMOMs</h1>
          <p className="workouts-summary">
            Every minute on the minute. Pick a workout, hit start, and train to
            the clock — leave your phone across the room and follow the beeps.
          </p>
        </header>
        <EmomPlayer />
      </section>
    </PageWrapper>
  );
}
