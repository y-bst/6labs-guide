// An Oracle conversation: the question, the thinking steps, the answer card, follow-up and export.
import type { CSSProperties, ReactNode } from 'react';
import { PLACEHOLDERS, type ThinkingStep } from '../../data/intel';
import { useScenes, type SceneSpec, type Toggle } from '../../shell/scenes';
import { Click } from '../Click';
import { Icon } from '../Icon';
import { AskControls } from './ask';
import { Btn, Tile } from './app';

/** Scrolling area under the top bar. `scrollDown` slides it up to reveal what's below the answer. */
export function Conversation({ scroll = {}, children }: {
  /** Where the conversation has scrolled to: the handoff, then the answer after it. */
  scroll?: { handoff?: SceneSpec; second?: SceneSpec; end?: SceneSpec };
  children: ReactNode;
}) {
  const { cls } = useScenes();
  return (
    <div className="i-chat">
      <div {...cls('i-roll', { d1: scroll.handoff, d2: scroll.second, d3: scroll.end })}>{children}</div>
    </div>
  );
}

export function QuestionBubble({ style, children }: { style?: CSSProperties; children: ReactNode }) {
  return <div className="i-qb" style={style}>{children}</div>;
}

/** One reasoning step: a green check (or a spinner while running), the step, its time and result. */
export function Step({ step, index, focus, style, accent }: {
  step: ThinkingStep;
  /** Position in the list; staggers the entrance animation. */
  index?: number;
  focus?: SceneSpec;
  style?: CSSProperties;
  /** Colour for the step title, e.g. to point at it in a diagram. */
  accent?: string;
}) {
  const { cls } = useScenes();
  return (
    <div {...cls('i-step', { focus })} style={{ ...(index !== undefined ? { '--k': String(index) } : {}), ...style } as CSSProperties}>
      <span className={step.running ? 'spin' : 'ck'} />
      <div>
        <b style={accent ? { color: accent } : undefined}>{step.title}<small>{step.time}</small></b>
        <p>{step.text}</p>
        {step.hit && <div className="i-hit"><b>{step.hit[0]}</b>{step.hit[1]}</div>}
      </div>
    </div>
  );
}

/** The steps Oracle shows while it works. `play` animates them in; `focus` tints some steps during a scene. */
export function ThinkingSteps({ steps, show, play, focus }: {
  steps: ThinkingStep[];
  show?: SceneSpec;
  play?: SceneSpec;
  focus?: { steps: number[]; during: SceneSpec };
}) {
  const { at, cls } = useScenes();
  return (
    <div {...cls('i-think', { play })} {...at(show)}>
      {steps.map((s, i) => <Step key={s.title} step={s} index={i} focus={focus?.steps.includes(i) ? focus.during : undefined} />)}
    </div>
  );
}

/**
 * Oracle's answer, as the product writes it: numbered sections, the data it had to work with,
 * a table or two, and what to do next. There is no copy button, credit count or related list.
 */
export function AnswerCard({ show, agent, children }: {
  show?: SceneSpec;
  /** Which agent answered, and what it did — the line the card opens with. */
  agent?: { name: string; did: string };
  children: ReactNode;
}) {
  const { at } = useScenes();
  return (
    <div className="i-card" {...at(show)}>
      {agent && (
        <div className="i-agent">
          <Tile page="oracle" iconSize={18} />
          <div><b>{agent.name}</b><span>{agent.did}</span></div>
        </div>
      )}
      <div className="i-ans">{children}</div>
    </div>
  );
}

/** Where the figures came from, and how many. Sits under the section it qualifies. */
export function AnswerMeta({ items, hl }: { items: [label: string, value?: string][]; hl?: Toggle }) {
  const { cls } = useScenes();
  return (
    <div {...cls('i-meta', { hl })}>
      {items.map(([label, value]) => (
        <span key={label} className={value ? 'i-chip' : 'i-chip off'}>{value ? <><b>{value}</b>{label}</> : label}</span>
      ))}
    </div>
  );
}

/** A numbered section of an answer: 01 WHAT HAPPENED, 03 WHAT TO DO NEXT. */
export function AnswerSection({ n, kicker, tone = 'blue', hl, children }: {
  n: string;
  kicker: string;
  /** blue states what happened, green says what to do about it. */
  tone?: 'blue' | 'green';
  hl?: Toggle;
  children: ReactNode;
}) {
  const { cls } = useScenes();
  return (
    <div {...cls(`i-sec ${tone}`, { hl })}>
      <div className="i-sec-k"><i>{n}</i>{kicker}</div>
      <h3>{children}</h3>
    </div>
  );
}

/** A labelled block inside an answer: something odd, something it concluded, or a plain fact. */
export function AnswerNote({ kind, title, children }: { kind: 'anomaly' | 'insight' | 'fact'; title: string; children: ReactNode }) {
  return (
    <div className={`i-note ${kind}`}>
      <span className="i-note-k">{kind}</span>
      <b>{title}</b>
      <p>{children}</p>
    </div>
  );
}

/** A table of the numbers behind an answer. */
export function AnswerTable({ head, rows, footnote }: { head: string[]; rows: (string | number)[][]; footnote?: ReactNode }) {
  return (
    <>
      <div className="i-table" style={{ ['--cols']: head.length } as CSSProperties}>
        <div className="i-tr head">{head.map(h => <span key={h}>{h}</span>)}</div>
        {rows.map(r => <div key={String(r[0])} className="i-tr">{r.map((c, i) => <span key={i}>{c}</span>)}</div>)}
      </div>
      {footnote && <p className="i-foot-note">{footnote}</p>}
    </>
  );
}

/** Each recommendation is a named action with its reasoning. */
export function AnswerActions({ items }: { items: [title: string, text: ReactNode][] }) {
  return (
    <ol className="i-acts">
      {items.map(([title, text]) => <li key={title}><b>{title}</b><p>{text}</p></li>)}
    </ol>
  );
}

/** What the answer cannot settle, which Oracle states before it stops. */
export const AnswerCaveat = ({ children }: { children: ReactNode }) => (
  <p className="i-caveat"><b>What this does not establish:</b> {children}</p>
);

/** Questions Oracle offers to take next. */
export function ExploreNext({ kicker, items }: { kicker: string; items: string[] }) {
  return (
    <div className="i-explore">
      <span className="i-label">{kicker}</span>
      {items.map(q => <span key={q} className="i-q">{q}</span>)}
    </div>
  );
}

/** The offer to go and watch the sessions behind the numbers. */
export function VideoAnalysisCta({ hl, click }: { hl?: Toggle; click?: SceneSpec }) {
  const { cls } = useScenes();
  const btn = <span className="i-btn pri">Show me insights from videos</span>;
  return (
    <div {...cls('i-vacta', { hl })}>
      <div><b>This is as far as the numbers go.</b><span>The recorded sessions have not been watched yet.</span></div>
      {click ? <Click on={click}>{btn}</Click> : btn}
    </div>
  );
}

/** A clip reference inside video-analysis prose: the numbered chips that open a session. */
export const Cites = ({ ids }: { ids: number[] }) => (
  <span className="i-cites">{ids.map(i => <b key={i}>{i}</b>)}</span>
);

/** Box pinned to the bottom of a conversation for the next question. */
export function FollowUpBox({ hl }: { hl?: Toggle }) {
  const { cls } = useScenes();
  return (
    <div {...cls('i-follow', { hl })}>
      <div className="q">{PLACEHOLDERS.followUp}</div>
      <AskControls />
    </div>
  );
}

export function ExportButton({ hl }: { hl?: SceneSpec }) {
  return <Btn icon="export" after={<Icon name="down" size={14} />} hl={hl}>Export</Btn>;
}

const EXPORTS: { icon: 'file' | 'img' | 'ppt'; name: string; note: string }[] = [
  { icon: 'file', name: 'PDF', note: 'All chats in this conversation' },
  { icon: 'img', name: 'Image', note: 'Analysis as infographic' },
  { icon: 'ppt', name: 'PPT', note: 'Meeting-ready presentation' },
];

export function ExportMenu({ show }: { show?: SceneSpec }) {
  const { at } = useScenes();
  return (
    <div className="i-menu exp-dd" {...at(show)}>
      {EXPORTS.map(e => (
        <div key={e.name} className="i-mi big"><Icon name={e.icon} size={20} style={{ color: 'var(--ink-2)' }} /><b>{e.name}</b><small>{e.note}</small></div>
      ))}
    </div>
  );
}
