// An Oracle conversation: the question, the thinking steps, the answer card, follow-up and export.
import type { CSSProperties, ReactNode } from 'react';
import { PLACEHOLDERS, type ThinkingStep } from '../../data/intel';
import { useScenes, type SceneSpec, type Toggle } from '../../shell/scenes';
import { Icon } from '../Icon';
import { AskControls } from './ask';
import { Btn } from './app';

/** Scrolling area under the top bar. `scrollDown` slides it up to reveal what's below the answer. */
export function Conversation({ scrollDown, children }: { scrollDown?: SceneSpec; children: ReactNode }) {
  const { cls } = useScenes();
  return (
    <div className="i-chat">
      <div {...cls('i-roll', { down: scrollDown })}>{children}</div>
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

/** Oracle's answer: source videos, the answer text, copy/credits/rating, and related questions. */
export function AnswerCard({ show, sources, credits, related, highlight = {}, children }: {
  show?: SceneSpec;
  /** Durations of the source videos. */
  sources: string[];
  credits: number;
  related: string[];
  highlight?: { sources?: Toggle; footer?: Toggle; related?: Toggle };
  /** The answer text. */
  children: ReactNode;
}) {
  const { at, cls } = useScenes();
  return (
    <div className="i-card" {...at(show)}>
      <div className="i-card-b">
        <div {...cls('', { hl: highlight.sources })}>
          <div className="i-srch">Sources <span>· {sources.length} videos</span><Icon name="down" size={14} style={{ transform: 'rotate(180deg)' }} /></div>
          <div className="i-vids">
            {sources.map((d, i) => <div key={i} className="i-vid"><span className="i-dur"><Icon name="clock" size={12} />{d}</span></div>)}
          </div>
          <span className="i-link">See these in Gameplay Library</span>
        </div>
        <div className="i-ans">{children}</div>
        <div {...cls('i-foot', { hl: highlight.footer })}>
          <Icon name="copy" size={16} />
          <span className="i-credit">{credits} Credits Used</span>
          <span className="thumbs"><Icon name="like" size={20} /><Icon name="dislike" size={20} /></span>
        </div>
      </div>
      <div className="i-rel">
        <h4>Related</h4>
        {related.map(r => <span key={r} {...cls('', { hl: highlight.related })}><Icon name="bulb" size={16} />{r}</span>)}
      </div>
    </div>
  );
}

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
