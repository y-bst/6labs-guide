// Building blocks for scene cards and the recap.
import type { ReactNode } from 'react';
import { guide, href } from '../registry';

/** Bulleted list in a card. */
export function Bullets({ items }: { items: ReactNode[] }) {
  return <ul>{items.map((item, i) => <li key={i}><span>{item}</span></li>)}</ul>;
}

/** Grey fact chips under a card, e.g. formats or limits. */
export function Facts({ items }: { items: ReactNode[] }) {
  return <div className="facts">{items.map((item, i) => <span key={i}>{item}</span>)}</div>;
}

/** A word with a hover definition. */
export function Term({ def, title, children }: { def: string; title?: string; children: ReactNode }) {
  return <button type="button" className="term" data-title={title} data-def={def}>{children}</button>;
}

/** Plain link to another guide, inside running text. */
export function GuideLink({ to, children }: { to: string; children: ReactNode }) {
  return <a data-doc="" href={href(to)}>{children}</a>;
}

/** Inline link at the end of a card. `to` is a guide slug or an in-page anchor like "#recap". */
export function TextLink({ to, children }: { to: string; children: ReactNode }) {
  const isGuide = !to.startsWith('#');
  return <a className="textlink" data-doc={isGuide ? '' : undefined} href={isGuide ? href(to) : to}>{children}</a>;
}

/** Primary button on the last card, pointing to the next guide (or any page). */
export function NextButton({ to, children }: { to: string; children?: ReactNode }) {
  const isGuide = !to.endsWith('.html');
  return (
    <a className="btn primary" data-doc={isGuide ? '' : undefined} href={isGuide ? href(to) : to}>
      {children ?? `Next guide: ${guide(to).title} →`}
    </a>
  );
}

/* ---------- recap ---------- */

export type FlowItem = string | string[] | { strong: string };

/** Row of pills: strings are pills, arrays are grouped pills, { strong } is the highlighted one. */
export function RecapFlow({ items }: { items: FlowItem[] }) {
  const pill = (item: FlowItem, key: number) =>
    Array.isArray(item) ? <span key={key} className="rf-group">{item.map(t => <span key={t} className="rf">{t}</span>)}</span>
      : typeof item === 'string' ? <span key={key} className="rf">{item}</span>
        : <span key={key} className="rf strong">{item.strong}</span>;
  return (
    <div className="recap-flow" aria-label="The flow">
      {items.flatMap((item, i) => i === 0 ? [pill(item, i)] : [<span key={`a${i}`} className="rf-arrow" aria-hidden="true">→</span>, pill(item, i)])}
    </div>
  );
}

export interface RecapProps {
  title: ReactNode;
  /** Under the title: usually <RecapFlow>, or a map. */
  head: ReactNode;
  quotes: ReactNode[];
  faqs: [ReactNode, ReactNode][];
  next: { to: string; kicker: string; text: ReactNode; back?: boolean };
}

export function Recap({ title, head, quotes, faqs, next }: RecapProps) {
  const isGuide = !next.to.endsWith('.html');
  return (
    <section className="recap" id="recap">
      <div className="recap-head">
        <div className="label">Recap</div>
        <h2>{title}</h2>
        {head}
      </div>
      <div className="recap-grid">
        <div className="panel">
          <h3>Say it to a client</h3>
          <ul className="quotes">{quotes.map((q, i) => <li key={i}>{q}</li>)}</ul>
        </div>
        <div className="panel">
          <h3>Questions clients ask</h3>
          {faqs.map(([q, a], i) => <details key={i}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
      </div>
      <div className="nextdoc">
        <a data-doc={isGuide ? '' : undefined} href={isGuide ? href(next.to) : next.to}>
          <span><small>{next.kicker}</small><b>{next.text}</b></span>
          <span aria-hidden="true">{next.back ? '←' : '→'}</span>
        </a>
      </div>
    </section>
  );
}
