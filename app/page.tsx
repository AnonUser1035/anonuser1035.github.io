import Letter from '@/components/Letter/Letter';
import { PersonSchema } from '@/components/Schema';
import RhythmStrip from '@/components/Strip/RhythmStrip';
import { NAME } from '@/data/content';

export default function HomePage() {
  return (
    <main className="page">
      <PersonSchema />
      <h1 className="name column">{NAME}</h1>
      <RhythmStrip />
      <Letter />
    </main>
  );
}
