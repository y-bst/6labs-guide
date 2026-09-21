// New run for test-case tests (Functional Test, AI Functional Test): two input tiles that start
// empty and fill in, then a card with the run name, optional instructions and the submit bar.
import type { CSSProperties, ReactNode } from 'react';
import { useScenes, type SceneSpec, type Toggle } from '../../shell/scenes';
import { TIcon, type TIconName } from './icons';

/** Two tiles side by side. Each side can hold an empty and a filled tile shown in different scenes. */
export function TileRow({ left, right }: { left: ReactNode; right: ReactNode }) {
  return <div className="s-tiles2"><div className="s-slot">{left}</div><div className="s-slot">{right}</div></div>;
}

/** An empty, dashed tile: what goes in, which formats, REQUIRED, and an optional note under it. */
export function InputTile({ icon, title, formats, note, show, hl, children }: {
  icon: TIconName;
  title: string;
  formats?: string[];
  note?: ReactNode;
  show?: SceneSpec;
  hl?: Toggle;
  children: ReactNode;
}) {
  const { at, cls } = useScenes();
  return (
    <div {...cls('s-intile', { hl })} {...at(show)}>
      <span className="s-intile-ic"><TIcon name={icon} size={18} width={1.8} /></span>
      <b>{title}</b>
      <p>{children}</p>
      {formats && <span className="s-formats">{formats.join(' · ')}</span>}
      <span className="s-req">Required</span>
      {note}
    </div>
  );
}

/** The same tile once filled: a label, what was picked, and links along the bottom. */
export function FilledTile({ label, links, show, hl, children }: {
  label: string;
  links: ReactNode;
  show?: SceneSpec;
  hl?: Toggle;
  children: ReactNode;
}) {
  const { at, cls } = useScenes();
  return (
    <div {...cls('s-filled', { hl })} {...at(show)}>
      <span className="s-label">{label}</span>
      {children}
      <div className="s-filled-f">{links}</div>
    </div>
  );
}

/** What was picked: a small square badge, the name, a remove ×, and a line under it. */
export function Picked({ badge, name, children }: { badge: ReactNode; name: ReactNode; children?: ReactNode }) {
  return (
    <>
      <div className="s-picked"><span className="s-picked-b">{badge}</span><b>{name}</b><TIcon name="close" size={14} width={2} /></div>
      {children && <div className="s-picked-sub">{children}</div>}
    </>
  );
}

/** Green "APK" badge of a build. */
export const Apk = () => <span className="s-apk">APK</span>;

/** An attached spreadsheet of test cases. */
export function CaseFile({ name, cases }: { name: string; cases: string }) {
  return (
    <div className="s-casefile">
      <span className="ic"><TIcon name="sheet" size={14} width={1.8} /></span>
      <b>{name}</b><small>{cases} cases</small>
      <TIcon name="close" size={12} width={2} />
    </div>
  );
}

/** The note under "Add your test cases": which columns each case needs. */
export function ColumnsNote({ hl }: { hl?: Toggle }) {
  const { cls } = useScenes();
  return (
    <div {...cls('s-colnote', { hl })}>
      <TIcon name="info" size={15} width={1.6} />
      <span>Each case needs <b>Precondition, Expected result, Steps</b> — without them 6labs can only mark the case not verified. <a>See a sample sheet</a></span>
    </div>
  );
}

/**
 * A text field: the value, or the placeholder greyed out. With `empty` and `typed` scene specs,
 * the placeholder shows first and the value is typed in later.
 */
export interface FieldText { placeholder: string; value?: string; empty?: SceneSpec; typed?: SceneSpec }

/** "Name this run": run name, optional instructions, and the bar with the submit button. */
export function RunDetails({ sub, name, instructions, summary, submit, hlName, hlInstructions }: {
  sub: string;
  name: FieldText;
  /** Only AI Functional Test has instructions. */
  instructions?: FieldText;
  /** Left side of the submit bar, e.g. "18 videos · 1 file". */
  summary: ReactNode;
  /** The submit button (wrap it in <ClickTarget> to animate a click). */
  submit: ReactNode;
  hlName?: Toggle;
  hlInstructions?: Toggle;
}) {
  const { at, cls } = useScenes();
  const field = (f: FieldText, area: boolean, hl?: Toggle) => {
    const base = area ? 's-input area' : 's-input';
    const empty = <div className={`${base} ph`} {...at(f.empty)}>{f.placeholder}</div>;
    const typed = <div {...cls(base, { hl })} {...at(f.typed)}>{f.value}</div>;
    if (f.empty || f.typed) return <>{empty}{typed}</>;
    return f.value ? typed : empty;
  };
  return (
    <div className="s-details">
      <b className="s-details-h">Name this run</b>
      <p>{sub}</p>
      <span className="s-label">Run name <small>optional</small></span>
      {field(name, false, hlName)}
      {instructions && <>
        <span className="s-label">Instructions <small>optional</small></span>
        {field(instructions, true, hlInstructions)}
      </>}
      <div className="s-details-f"><span>{summary}</span>{submit}</div>
    </div>
  );
}

/**
 * Moves its content up during some scenes, as if the page scrolled. Give up to three stops:
 * <Scroller stops={[['name..', 160]]}> scrolls 160px from the "name" scene on.
 */
export function Scroller({ stops, children }: { stops: [spec: SceneSpec, px: number][]; children: ReactNode }) {
  const { cls } = useScenes();
  const toggles = Object.fromEntries(stops.map(([spec], i) => [`y${i + 1}`, spec]));
  const style = Object.fromEntries(stops.map(([, px], i) => [`--y${i + 1}`, `-${px}px`])) as CSSProperties;
  return <div {...cls('s-scroller', toggles)} style={style}>{children}</div>;
}
