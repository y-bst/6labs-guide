// Setting up a test run and following it: tabs, mode switch, picked videos, game context,
// run history rows and the "submit → run history" sequence.
import type { ReactNode } from 'react';
import { RUN } from '../../data/testing';
import { useScenes, type SceneSpec, type Toggle } from '../../shell/scenes';
import { TIcon } from './icons';
import { Button } from './app';
import { Click } from '../Click';

export function RunTabs({ history, runs }: { history?: boolean; runs: number }) {
  return (
    <div className="s-tabs">
      <span className={history ? undefined : 'on'}>New run</span>
      <span className={history ? 'on' : undefined}>Run history <span className="n">{runs}</span></span>
    </div>
  );
}

/** Report or ask. `report`/`ask` say when each is selected. */
export function ModeSwitch({ report, ask, hl, clickAsk }: {
  report?: Toggle;
  ask?: Toggle;
  hl?: Toggle;
  /** Scenes in which a cursor taps "Ask questions", which swaps the form. */
  clickAsk?: SceneSpec;
}) {
  const { cls } = useScenes();
  const askChip = <span {...cls('', { on: ask })}><TIcon name="chat" />Ask questions</span>;
  return (
    <div {...cls('s-mode', { hl })}>
      <span {...cls('', { on: report })}><TIcon name="report" />Generate report</span>
      {clickAsk ? <Click on={clickAsk}>{askChip}</Click> : askChip}
    </div>
  );
}

/** The picked batch, with Change / Clear. */
export function SelectedVideos({ show }: { show?: SceneSpec }) {
  const { at } = useScenes();
  return (
    <div className="s-selected" {...at(show)}>
      <div className="thumbs"><i className="g1" /><i className="g2" /><i className="g3" /></div>
      <div>
        <b>{RUN.videos} videos selected</b>
        <div style={{ fontSize: '13px', color: 'var(--ink-3)' }}>Build V2.2 · <a>Change</a> · <a>Clear</a></div>
      </div>
    </div>
  );
}

/** "+ Add game context", or the chosen document once picked. */
export function GameContextButton({ picked, on }: { picked?: string; on?: Toggle }) {
  const { cls } = useScenes();
  if (picked) return <span className="s-outline on"><TIcon name="doc" size={16} />{picked}</span>;
  return <span {...cls('s-outline', { on })}>+ Add game context</span>;
}

/* ---------- run history ---------- */

/** What a finished run shows in the Result column. */
export type RunResult =
  | { findings: number }
  /** Pass · failed · need review · not verified, as four colour chips. */
  | { outcomes: [pass: number, failed: number, review: number, notVerified: number] }
  | { text: string }
  | { failed: string };

export function RunResultCell({ result, className }: { result: RunResult; className?: string }) {
  const c = (base: string) => (className ? `${base} ${className}` : base);
  if ('findings' in result) return <span className={c('s-result find')}>{result.findings} findings</span>;
  if ('text' in result) return <span className={c('s-result plain')}>{result.text}</span>;
  if ('failed' in result) return <span className={c('s-failed')}><span className="s-result fail">Failed</span><small>{result.failed}</small></span>;
  const [p, f, r, n] = result.outcomes.map(k => k.toLocaleString('en-US'));
  return <span className={c('s-outc')}><i className="p">{p}</i><i className="f">{f}</i><i className="r">{r}</i><i className="n">{n}</i></span>;
}

/** Run history table. `cols` are the Run, third, Result and Date headings. */
export function HistoryTable({ cols, variant, children }: {
  cols: [run: string, third: string, result: string, date: string];
  /** Column widths: wide fits persona chips, counts fits the four outcome chips. */
  variant?: 'wide' | 'counts';
  children: ReactNode;
}) {
  const [run, third, result, date] = cols;
  return (
    <div className={variant ? `s-table ${variant}` : 's-table'}>
      <div className="s-trow head"><span /><span>{run}</span><span>{third}</span><span>{result}</span><span className="s-date">{date}</span><span /></div>
      {children}
    </div>
  );
}

export interface RunRowProps {
  /**
   * ready: finished. progress: still running (pinned, tinted). submitted: the run just sent,
   * which goes from In progress to ready inside <SubmitSequence>. failed: stopped with a reason.
   */
  state?: 'ready' | 'progress' | 'submitted' | 'failed';
  /** Icon of a finished run. */
  icon?: 'doc' | 'question';
  name: ReactNode;
  sub: ReactNode;
  /** Third column: tag chips, or any content (a build version, persona chips). */
  tags?: string[];
  third?: ReactNode;
  result?: RunResult;
  date: string;
  /** Button of a finished run. */
  action?: string;
  /** Button while running. Defaults to a disabled "Analysing…". */
  running?: ReactNode;
  /** Scenes in which a cursor taps the finished run's button, which opens the report next. */
  click?: SceneSpec;
  className?: string;
}

export function RunRow({ state = 'ready', icon = 'doc', name, sub, tags, third, result, date, action = 'View report', running, click, className }: RunRowProps) {
  const cell3 = third ?? <span>{tags?.map(t => <span key={t} className="s-mtag">{t}</span>)}</span>;
  const title = <span><b>{name}</b><small>{sub}</small></span>;
  const ticon = <span className={icon === 'question' ? 's-ticon q' : 's-ticon'}><TIcon name={icon} /></span>;
  const busy = running ?? <Button tone="dis" sm>Analysing…</Button>;
  const row = (extra: string) => ['s-trow', extra, className].filter(Boolean).join(' ');

  if (state === 'submitted') {
    return (
      <div className={row('s-newrow')}>
        <span className="s-stack">
          <span className="s-ticon s-st-prog"><span className="s-spin" /></span>
          <span className="s-ticon s-st-ready"><TIcon name={icon} /></span>
        </span>
        {title}
        {cell3}
        <span className="s-stack">
          <span className="s-result live s-st-prog">In progress</span>
          {result && <RunResultCell result={result} className="s-st-ready" />}
        </span>
        <span className="s-date">{date}</span>
        <span className="s-stack">
          <Button tone="dis" sm className="s-st-prog">Analysing…</Button>
          {click
            ? <Click on={click} delay={5.4}><Button tone="primary" sm className="s-st-ready s-viewbtn">{action}</Button></Click>
            : <Button tone="primary" sm className="s-st-ready s-viewbtn">{action}</Button>}
        </span>
      </div>
    );
  }
  if (state === 'progress') {
    return (
      <div className={row('live')}>
        <span className="s-ticon"><span className="s-spin" /></span>
        {title}
        {cell3}
        <span className="s-result live">In progress</span>
        <span className="s-date">{date}</span>
        {busy}
      </div>
    );
  }
  return (
    <div className={row(state === 'failed' ? 'fail' : '')}>
      {state === 'failed' ? <span className="s-ticon fail"><TIcon name="alert" /></span> : ticon}
      {title}
      {cell3}
      {result ? <RunResultCell result={result} /> : <span />}
      <span className="s-date">{date}</span>
      {action ? <Button tone="ghost" sm>{action}</Button> : <span />}
    </div>
  );
}

/** Wraps a button with the click animation: a cursor moves in, clicks, and a ripple spreads. */
export function ClickTarget({ children }: { children: ReactNode }) {
  return (
    <span className="s-click">
      {children}
      <span className="s-ripple" />
      <svg className="s-cursor" width="30" height="30" viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.5L10 19z" fill="var(--ink)" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></svg>
    </span>
  );
}

/**
 * The form is submitted (put a <ClickTarget> around its button), then Run history takes over,
 * where a `state="submitted"` row turns from In progress to ready. Plays during `play`.
 */
export function SubmitSequence({ play, form, history }: { play: SceneSpec; form: ReactNode; history: ReactNode }) {
  const { cls } = useScenes();
  return (
    <div {...cls('s-seq', { play })}>
      <div className="s-seq-a">{form}</div>
      <div className="s-seq-b">{history}</div>
    </div>
  );
}
