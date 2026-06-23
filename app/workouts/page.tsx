import type { Metadata } from 'next';

import BackToProjects from '@/components/Projects/BackToProjects';
import PageWrapper from '@/components/Template/PageWrapper';
import WorkoutTracker from '@/components/Workouts/WorkoutTracker';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Workouts',
  description:
    'A weekly training plan with an interactive set tracker — tap to check off sets as you go.',
  path: '/workouts/',
});

export default function WorkoutsPage() {
  return (
    <PageWrapper>
      <section className="workouts-page">
        <BackToProjects />
        <header className="workouts-header">
          <h1 className="workouts-title">Workouts</h1>
          <p className="workouts-summary">
            My current weekly split. Tap a set to check it off — progress is
            saved on this device and resets each day.
          </p>
        </header>
        <WorkoutTracker />
      </section>
    </PageWrapper>
  );
}
