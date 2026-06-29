import type { Position } from '@/data/resume/work';

import CondensedJob from './Experience/CondensedJob';
import Job from './Experience/Job';

interface ExperienceProps {
  data: Position[];
}

export default function Experience({ data }: ExperienceProps) {
  const featured = data.filter((job) => !job.condensed);
  const earlier = data.filter((job) => job.condensed);

  return (
    <div className="experience">
      <div className="link-to" id="experience" />
      <div className="title">
        <h2>Experience</h2>
      </div>
      {featured.map((job) => (
        <Job data={job} key={`${job.name}-${job.position}`} />
      ))}
      {earlier.length > 0 ? (
        <div className="experience-earlier">
          <p className="experience-earlier-label">Earlier experience</p>
          {earlier.map((job) => (
            <CondensedJob data={job} key={`${job.name}-${job.position}`} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
