// The question box and everything around it: controls, menus, suggested prompts, home launcher.
import type { CSSProperties, ReactNode } from 'react';
import { PLACEHOLDERS, PROMPTS } from '../../data/intel';
import { useScenes, type SceneSpec, type Toggle } from '../../shell/scenes';
import { Click } from '../Click';
import { Icon } from '../Icon';
import { BrandMark } from './brands';

/* ---------- controls ---------- */

export function PlusButton({ hl }: { hl?: Toggle }) {
  const { cls } = useScenes();
  return <span {...cls('i-plus', { hl })}><Icon name="plus" size={16} /></span>;
}

/** Data source picker; always BlueStacks in the guides. */
export function SourceChip({ hl }: { hl?: Toggle }) {
  const { cls } = useScenes();
  return <span {...cls('i-src', { hl })}><Icon name="bs" size={16} />BlueStacks</span>;
}

/** Round send button: grey until there's a question (`on`). */
export function SendButton({ on, hl, style }: { on?: Toggle; hl?: Toggle; style?: CSSProperties }) {
  const { cls } = useScenes();
  return <span {...cls('i-go', { on, hl })} style={style}><Icon name="up" /></span>;
}

export interface ControlHighlights { plus?: Toggle; source?: Toggle; send?: Toggle }

export function AskControls({ hl = {}, send, click }: {
  hl?: ControlHighlights;
  send?: Toggle;
  /** Scenes in which a cursor taps Send, so the answer does not just appear. */
  click?: SceneSpec;
}) {
  const go = <SendButton on={send} hl={hl.send} />;
  return (
    <div className="i-ctl">
      <PlusButton hl={hl.plus} />
      <SourceChip hl={hl.source} />
      {click ? <Click on={click} from="below">{go}</Click> : go}
    </div>
  );
}

/* ---------- question box ---------- */

/** One line of text in the box. Several can be layered with `show`, e.g. placeholder, then the typed question. */
export function Query({ show, typed, children }: { show?: SceneSpec; typed?: boolean; children: ReactNode }) {
  const { at } = useScenes();
  return <div className={typed ? 'q typed' : 'q'} {...at(show)}>{children}</div>;
}

export function AskBox({ hl, controls, send, click, style, menus, children }: {
  /** Pulse the whole box. */
  hl?: Toggle;
  /** Pulse single controls. */
  controls?: ControlHighlights;
  /** When the send button turns blue. */
  send?: Toggle;
  /** Scenes in which a cursor taps Send. */
  click?: SceneSpec;
  style?: CSSProperties;
  /** Dropdowns anchored to the box (SourceMenu, AddMenu). */
  menus?: ReactNode;
  /** <Query> lines. */
  children: ReactNode;
}) {
  const { cls } = useScenes();
  return (
    <div {...cls('i-ask', { hl })} style={style}>
      {children}
      <AskControls hl={controls} send={send} click={click} />
      {menus}
    </div>
  );
}

/* ---------- menus ---------- */

const SOURCES: { name: string; icon: 'bs' | 'yt' | 'pc' | 'mobile' | 'lib'; color?: string }[] = [
  { name: 'BlueStacks', icon: 'bs' },
  { name: 'YouTube', icon: 'yt' },
  { name: 'SDK – PC', icon: 'pc', color: 'var(--brand)' },
  { name: 'SDK – Mobile', icon: 'mobile', color: 'var(--brand)' },
  { name: 'Library', icon: 'lib', color: 'var(--ink-2)' },
];

/** Where the answer's data comes from. BlueStacks is selected. */
export function SourceMenu({ show }: { show?: SceneSpec }) {
  const { at } = useScenes();
  return (
    <div className="i-menu src-dd" {...at(show)}>
      <div className="mh">Sources</div>
      {SOURCES.map((s, i) => (
        <div key={s.name} className={i === 0 ? 'i-mi sel' : 'i-mi'}>
          <Icon name={s.icon} style={s.color ? { color: s.color } : undefined} />{s.name}
        </div>
      ))}
    </div>
  );
}

/** The "+" menu with its Connectors submenu open. */
export function AddMenu({ show }: { show?: SceneSpec }) {
  const { at } = useScenes();
  const menu = (
    <>
      <div className="i-menu add-dd">
        <div className="i-mi"><Icon name="file" style={{ color: 'var(--ink-3)' }} />Attach PDF</div>
        <div className="i-mi" style={{ background: '#F5F6FA' }}><Icon name="conn" style={{ color: 'var(--ink-3)' }} />Connectors<Icon name="chev" size={14} className="end" /></div>
      </div>
      <div className="i-sub add-sub">
        <div className="mh">CONNECTED</div>
        <div className="i-mi"><BrandMark brand="bigquery" />BigQuery</div>
        <div className="i-mi"><BrandMark brand="snowflake" />Snowflake</div>
      </div>
    </>
  );
  return show ? <div {...at(show)}>{menu}</div> : menu;
}

/* ---------- prompts & home ---------- */

export function SuggestedPrompts({ hl }: { hl?: Toggle }) {
  const { cls } = useScenes();
  return (
    <>
      <div className="i-prompts-l">Try our suggested prompts</div>
      <div {...cls('i-prompts', { hl })}>
        {PROMPTS.map(p => <span key={p}><Icon name="bulb" size={16} />{p}</span>)}
      </div>
    </>
  );
}

/** The home screen (New Query): headline, agent switch, question box, prompts. */
export function HomeLauncher({ agent = 'oracle', switchHl }: { agent?: 'oracle' | 'radiologist'; switchHl?: Toggle }) {
  const { cls } = useScenes();
  return (
    <div className="i-home">
      <span className="i-badge">✦ AI trained on 1,000,000+ hours of gameplay data</span>
      <h3 className="i-hero">Get to <em>know your game</em> better!</h3>
      <div className="i-powered">Powered by <em>Sixth</em>Sense™ Engine</div>
      <div {...cls('i-switch', { hl: switchHl })}>
        <span className={agent === 'oracle' ? 'on' : undefined}><Icon name="oracle" />Oracle</span>
        <span className={agent === 'radiologist' ? 'on' : undefined}><Icon name="radio" />Radiologist</span>
      </div>
      <AskBox style={{ marginTop: '22px' }}>
        <Query>{PLACEHOLDERS.home}</Query>
      </AskBox>
      <SuggestedPrompts />
    </div>
  );
}
