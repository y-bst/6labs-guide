// The Testing app frame: sidebar, main area, page header.
import type { CSSProperties, ReactNode } from 'react';
import { Layer, useScenes, type SceneSpec, type Toggle } from '../../shell/scenes';
import { Logo } from '../Logo';
import { TIcon, type TIconName } from './icons';

type NavId = 'library' | 'userTest' | 'functional' | 'aiBehavioural' | 'aiFunctional';

export interface TestingSidebarProps {
  /** Which item is selected: true for the whole story, or during some scenes. */
  active?: Partial<Record<NavId, Toggle>>;
  /** Pulse an item during some scenes. */
  highlight?: Partial<Record<NavId, Toggle>>;
}

/** Items not built yet, greyed out with a SOON badge. */
const SOON_HUMAN: [TIconName, string][] = [['briefcase', 'External agency test'], ['chart', 'Beta · CBT / OBT']];
const SOON_AI: [TIconName, string][] = [['nodes', 'AI large-scale test'], ['checklist', 'Test case generation'], ['globe', 'L-QA · localization']];

export function TestingSidebar({ active = {}, highlight = {} }: TestingSidebarProps) {
  const { cls } = useScenes();
  const icon = (name: TIconName, size = 17) => <TIcon name={name} size={size} width={1.5} />;
  const item = (id: NavId, name: TIconName, label: string, size?: number) => (
    <a {...cls('', { on: active[id], hl: highlight[id] })}>{icon(name, size)}<span>{label}</span></a>
  );
  const soon = ([name, label]: [TIconName, string]) => (
    <a key={label} className="s-off">{icon(name, 16)}<span>{label}</span><span className="s-soon">SOON</span></a>
  );
  return (
    <aside className="s-side">
      <div className="s-logo"><Logo height={28} /></div>
      <div className="s-area"><span>Intelligence</span><span className="on">Testing</span></div>
      <div className="s-rule" />
      <nav className="s-nav">
        <a>{icon('overview')}<span>Overview</span></a>
        {item('library', 'folderPlay', 'Gameplay Library', 18)}
        <div className="s-nav-h cx">Human testing<TIcon name="chevDown" size={14} width={2} /></div>
        <div className="s-tree">
          {item('userTest', 'people', 'User test', 16)}
          {item('functional', 'flaskDoc', 'Functional test', 16)}
          {SOON_HUMAN.map(soon)}
        </div>
        <div className="s-nav-h ai">AI player testing<TIcon name="chevDown" size={14} width={2} /></div>
        <div className="s-tree">
          {item('aiBehavioural', 'aiPerson', 'AI behavioural test', 16)}
          {item('aiFunctional', 'aiDoc', 'AI functional test', 16)}
          {SOON_AI.map(soon)}
        </div>
      </nav>
    </aside>
  );
}

/** Frame of a Testing screen: sidebar on the left, the page on the right. */
export function TestingScreen({ sidebar, children }: { sidebar?: TestingSidebarProps; children: ReactNode }) {
  return (
    <div className="s-frame">
      <div className="s-app">
        <TestingSidebar {...sidebar} />
        <div className="s-main">{children}</div>
      </div>
    </div>
  );
}

const PAGES = {
  library: { tone: 'lib', icon: 'library', title: 'Gameplay Library', sub: 'Every recording, from every source. Tests pick their batches from here.' },
  userTest: { tone: 'ut', icon: 'userTest', title: 'User Test', sub: 'Find where players struggle in your recorded sessions — a full report, or just ask.' },
  functional: { tone: 'ft', icon: 'flaskDoc', title: 'Functional test', sub: 'Upload the tests you already ran. 6labs checks what happened in each video — did every action complete — and makes them searchable.' },
  aiBehavioural: { tone: 'ai', icon: 'aiPerson', title: 'AI behavioural test', sub: 'AI players play your build like real personas — new player, core, whale, lapsed — and 6labs analyses what they did the same way it analyses human sessions.' },
  aiFunctional: { tone: 'ai', icon: 'aiDoc', title: 'AI functional test', sub: 'AI players run your test cases on your build and report what passed, what failed and what they could not reach — with the video.' },
} as const satisfies Record<string, { tone: string; icon: TIconName; title: string; sub: string }>;

/** Prototype icons are drawn thinner than the older ones. */
const THIN: TIconName[] = ['flaskDoc', 'aiPerson', 'aiDoc'];

/** Page title with its gradient icon. `small` is the scaled-down version inside diagrams. */
export function PageHeader({ page, sub, small, action }: {
  page: keyof typeof PAGES;
  /** Override the subtitle, or false to hide it. */
  sub?: string | false;
  small?: boolean;
  /** Button on the right. */
  action?: ReactNode;
}) {
  const p = PAGES[page];
  const text = sub === undefined ? p.sub : sub;
  const thin = THIN.includes(p.icon);
  return (
    <div className="s-head">
      <div className={`s-icon ${p.tone}`}><TIcon name={p.icon} size={small ? 26 : thin ? 30 : 28} width={thin ? 1.5 : 1.7} /></div>
      <div className="grow">
        <h3 className="s-h1" style={small ? { fontSize: '26px' } : undefined}>{p.title}</h3>
        {text && <p className="s-sub">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function UploadButton({ hl }: { hl?: Toggle }) {
  return <Button tone="primary" hl={hl}><TIcon name="uploadTray" size={16} width={2} />Upload videos</Button>;
}

/* ---------- primitives ----------
   The small pieces every Testing screen is built from. Guides use these instead of writing the
   class names, so a class can be renamed in one place and TypeScript catches the rest. */

/**
 * One screen of the app, filling the main area. It is a <Layer>, so several screens can share
 * the spot and fade between scenes; without `show` it is simply always there.
 */
export function PageLayer({ show, className, children }: { show?: SceneSpec; className?: string; children: ReactNode }) {
  const cn = className ? `s-pg ${className}` : 's-pg';
  if (show) return <Layer show={show} className={cn}>{children}</Layer>;
  return <div className={`layer ${cn}`}>{children}</div>;
}

/** A button. `tone` picks the fill, `sm` the short height. */
export function Button({ tone, sm, hl, show, className, children }: {
  tone?: 'primary' | 'ghost' | 'dis';
  sm?: boolean;
  hl?: Toggle;
  /** Show only during these scenes, e.g. a disabled button that becomes live. */
  show?: SceneSpec;
  /** Extra class for the few buttons a screen styles further. */
  className?: string;
  children: ReactNode;
}) {
  const { at, cls } = useScenes();
  const base = ['s-btn', tone, sm && 'sm', className].filter(Boolean).join(' ');
  return <span {...cls(base, { hl })} {...at(show)}>{children}</span>;
}

/** Small uppercase caption above a field or a panel. */
export function Label({ show, className, style, children }: { show?: SceneSpec; className?: string; style?: CSSProperties; children: ReactNode }) {
  const { at } = useScenes();
  return <span className={className ? `s-label ${className}` : 's-label'} style={style} {...at(show)}>{children}</span>;
}

/** A row of things, centred and wrapping. */
export function Row({ gap, show, style, children }: { gap?: number; show?: SceneSpec; style?: CSSProperties; children: ReactNode }) {
  const { at } = useScenes();
  return <div className="s-row" style={gap === undefined ? style : { gap: `${gap}px`, ...style }} {...at(show)}>{children}</div>;
}

/** Hairline between sections of a screen. */
export const Divider = () => <div className="s-divider" />;

/** A text field: its value, or the placeholder greyed out when there is none. */
export function Input({ value, placeholder, area, show, style, children }: {
  value?: ReactNode;
  placeholder?: string;
  /** The taller multi-line box. */
  area?: boolean;
  show?: SceneSpec;
  style?: CSSProperties;
  /** Content of a field that is not plain text, e.g. a field with a chip in it. */
  children?: ReactNode;
}) {
  const { at } = useScenes();
  const filled = children ?? value;
  const base = [filled ? '' : 'ph', area && 'area'].filter(Boolean).join(' ');
  return <div className={base ? `s-input ${base}` : 's-input'} style={style} {...at(show)}>{filled ?? placeholder}</div>;
}
