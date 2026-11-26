import {
  FOOTER,
  LEAD,
  LETTER,
  type LetterBlock,
  POSTSCRIPT,
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
      <p>{block.intro}</p>
      <ul className="recent-papers">
        {block.papers.map((paper) => (
          <li key={paper.href}>
            <a href={paper.href}>{paper.title}</a>
            <span className="venue">{paper.venue}</span>
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
        <p className="postscript">
          {POSTSCRIPT.text}{' '}
          <span className="postscript-pointer">{POSTSCRIPT.pointer}</span>
          <span className="postscript-touch">{POSTSCRIPT.touch}</span>
        </p>
      </div>
      <footer className="footer column">
        <p>{FOOTER}</p>
      </footer>
    </>
  );
}
