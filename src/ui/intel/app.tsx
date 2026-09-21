// The Intelligence app frame: sidebar, main area, top bar, page header and buttons.
import type { CSSProperties, ReactNode } from 'react';
import { HISTORY, PAGES, type PageId } from '../../data/intel';
import { useScenes, type SceneSpec, type Toggle } from '../../shell/scenes';
import { Icon, type IconName } from '../Icon';

type NavId = 'newQuery' | 'oracle' | 'radiologist' | 'documents' | 'connectors';
type HistoryEntry = string | { text: string; show?: SceneSpec; active?: Toggle };

export interface SidebarProps {
  /** Which item is selected: true for the whole story, or during some scenes. */
  active?: Partial<Record<NavId, Toggle>>;
  /** Pulse an item or a whole group during some scenes. */
  highlight?: Partial<Record<NavId | 'agents' | 'context' | 'history', SceneSpec>>;
  /** Past questions, newest first. Use { text, show } for one that appears mid-story. */
  history?: HistoryEntry[];
}

export function Sidebar({ active = {}, highlight = {}, history = HISTORY }: SidebarProps) {
  const { at, cls } = useScenes();
  const item = (id: NavId, icon: IconName, label: string) => (
    <a {...cls('', { on: active[id], hl: highlight[id] })}><Icon name={icon} />{label}</a>
  );
  return (
    <aside className="s-side">
      <div className="s-logo"><i />6labs.ai</div>
      <div className="s-area"><span className="on">Intelligence</span><span>Testing</span></div>
      <div className="s-rule" />
      <nav className="s-nav">
        {item('newQuery', 'new', 'New Query')}
        <div className="s-nav-h ca fold">Core agents</div>
        <div {...cls('i-tree', { hl: highlight.agents })}>
          {item('oracle', 'oracle', 'Oracle')}
          {item('radiologist', 'radio', 'Radiologist')}
          <a className="soon"><Icon name="fore" />Forecaster</a>
        </div>
        <div className="s-nav-h cx">Context</div>
        <div {...cls('i-tree', { hl: highlight.context })}>
          {item('documents', 'docs', 'Documents')}
          {item('connectors', 'conn', 'Connectors')}
        </div>
        <div className="s-nav-h hs fold">History</div>
        <div {...cls('i-tree hist', { hl: highlight.history })}>
          {history.map(h => typeof h === 'string'
            ? <a key={h}>{h}</a>
            : <a key={h.text} {...at(h.show)} {...cls('', { on: h.active })}>{h.text}</a>)}
        </div>
      </nav>
    </aside>
  );
}

/** Frame of an Intelligence screen: sidebar on the left, pages layered in the main area. */
export function IntelScreen({ sidebar, children }: { sidebar?: SidebarProps; children: ReactNode }) {
  return (
    <div className="s-frame">
      <div className="s-app intel">
        <Sidebar {...sidebar} />
        <div className="i-main">{children}</div>
      </div>
    </div>
  );
}

/** Bar across the top of a page: back arrow, title, and anything on the right. */
export function ScreenBar({ title, children }: { title?: ReactNode; children?: ReactNode }) {
  return (
    <div className="i-top">
      <Icon name="back" />
      {title !== undefined && <span className="grow">{title}</span>}
      {children}
    </div>
  );
}

/** Small button. `after` goes after the label, e.g. a chevron. */
export function Btn({ variant, icon, iconSize = 15, after, hl, children }: {
  variant?: 'brand' | 'pri';
  icon?: IconName;
  iconSize?: number;
  after?: ReactNode;
  hl?: SceneSpec;
  children: ReactNode;
}) {
  const { cls } = useScenes();
  return (
    <span {...cls(variant ? `i-btn ${variant}` : 'i-btn', { hl })}>
      {icon && <Icon name={icon} size={iconSize} />}{children}{after}
    </span>
  );
}

/** Page title with its gradient tile, e.g. the Oracle or Connectors header. */
export function PageHead({ page }: { page: PageId }) {
  const p = PAGES[page];
  return (
    <div className="i-phead">
      <div className={`i-tile ${p.tile}`}><Icon name={p.icon} size={32} /></div>
      <div><h3>{p.title}</h3><p>{p.sub}</p></div>
    </div>
  );
}

/** Gradient tile with an agent or page icon, e.g. inside diagrams. */
export function Tile({ page, size = 'sm', iconSize = 22, style }: { page: PageId; size?: 'sm' | 'md'; iconSize?: number; style?: CSSProperties }) {
  const p = PAGES[page];
  return <span className={size === 'sm' ? `i-tile ${p.tile} sm` : `i-tile ${p.tile}`} style={style}><Icon name={p.icon} size={iconSize} /></span>;
}
