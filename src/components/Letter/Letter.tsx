import {
  FOOTER,
  LEAD,
  LETTER,
  type LetterBlock,
  SIGNATURE,
} from '@/data/content';

import Inline from './Inline';

function Block({ block }: { block: LetterBlock }) {
  if (typeof block === 'string') {
    return (
      <p>
        <Inline text={block} />
      </p>
    );
  }

  return (
    <>
      <p className="work-intro">{block.intro}</p>
      <ul className="selected-work">
        {block.works.map((work) => (
          <li key={work.href}>
            <a href={work.href}>{work.title}</a>
            <span className="venue">{work.venue}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Letter() {
  return (
    <>
      <div className="letter column">
        <p className="lead">{LEAD}</p>
        {LETTER.map((block) => (
          <Block
            key={typeof block === 'string' ? block : block.intro}
            block={block}
          />
        ))}
        <p className="signature">{SIGNATURE}</p>
      </div>
      <footer className="footer column">
        <p>{FOOTER}</p>
      </footer>
    </>
  );
}
