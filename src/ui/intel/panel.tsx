// A session opened beside the results: player with event markers, then its sections.
import type { ReactNode } from 'react';
import { EVENTS, type GameEvent, type Session, type Tile } from '../../data/intel';
import { useScenes, type SceneSpec, type Toggle } from '../../shell/scenes';
import { Icon, type IconName } from '../Icon';
import { Btn } from './app';
import { Duration, SourceBadge } from './sessions';
import { Click } from '../Click';

/** Coloured dots on the progress bar, one per detected event. */
export function Timeline({ events = EVENTS, hl }: { events?: GameEvent[]; hl?: Toggle }) {
  const { cls } = useScenes();
  return (
    <div {...cls('r-tl', { hl })}>
      {events.map(e => <i key={e.type} className={`ev-${e.tone}`} style={{ left: `${e.at}%` }} />)}
    </div>
  );
}

export function PlayerControls({ duration }: { duration: string }) {
  return (
    <div className="r-ctl">
      <Icon name="play" size={16} /><Icon name="vol" size={16} /><span className="grow">0:00 / {duration}</span><Icon name="full" size={15} />
    </div>
  );
}

/** Small player: thumbnail, event timeline and controls. */
export function Player({ session, markersHl }: { session: Session; markersHl?: Toggle }) {
  return (
    <div className="r-player">
      <div className="r-thumb"><SourceBadge source={session.source} /><Duration>{session.duration}</Duration></div>
      <Timeline hl={markersHl} />
      <PlayerControls duration={session.duration} />
    </div>
  );
}

/** Why the session matched the search: key facts, then a short explanation. */
export function WhyThisVideo({ facts, text, hl }: { facts: [string, string][]; text: string; hl?: Toggle }) {
  const { cls } = useScenes();
  return (
    <div {...cls('r-why', { hl })}>
      <div className="r-why-h"><Icon name="oracle" size={16} />Why this video</div>
      {facts.map(([k, v]) => <div key={k} className="r-kv">{k}<b>{v}</b></div>)}
      <p>{text}</p>
    </div>
  );
}

/** A titled block in the side panel. */
export function PanelSection({ icon, title, hl, children }: { icon: IconName; title: string; hl?: Toggle; children: ReactNode }) {
  const { cls } = useScenes();
  return (
    <div {...cls('r-sec', { hl })}>
      <div className="r-sec-h"><Icon name={icon} size={16} />{title}</div>
      {children}
    </div>
  );
}

/** Instructions given to a 6labs AI player, shown on its sessions. */
export function Instructions({ given, children }: { given: string; children: ReactNode }) {
  return <div className="r-instr"><small>{given}</small>{children}</div>;
}

export function EventRow({ event }: { event: GameEvent }) {
  return (
    <div className="r-ev">
      <div><span className={`pill ev-${event.tone}`}>{event.type}</span><small>{event.time}</small><p>{event.text}</p></div>
      <Icon name="chev" size={12} />
    </div>
  );
}

export function TileGrid({ tiles }: { tiles: Tile[] }) {
  return (
    <div className="r-tiles">
      {tiles.map(t => <div key={t.label} className={t.wide ? 'r-tile wide' : 'r-tile'}><small>{t.label}</small><b>{t.value}</b></div>)}
    </div>
  );
}

/** Three big numbers, green when good and red when bad. */
export function Stats({ stats }: { stats: { value: string; label: string; good: boolean }[] }) {
  return (
    <div className="r-stats">
      {stats.map(s => <div key={s.label} className={s.good ? 'r-stat g' : 'r-stat r'}><b>{s.value}</b><small>{s.label}</small></div>)}
    </div>
  );
}

export function Profile({ name, kind, style }: { name: string; kind: string; style: string }) {
  return <div className="r-prof"><i /><span><b>{name}</b><small>{kind}</small></span><span className="tag">{style}</span></div>;
}

/**
 * Panel on the right of the results. Its body scrolls to named positions:
 * `scroll={{ y1: 'summary..instructions', y2: 'info' }}` (see .r-scroll.y1 / .y2 in panel.css).
 */
export function SidePanel({ show, session, detailHl, scroll = {}, children }: {
  show: SceneSpec;
  session: Session;
  /** Pulse "View in detail". */
  detailHl?: SceneSpec;
  scroll?: { y1?: SceneSpec; y2?: SceneSpec };
  children: ReactNode;
}) {
  const { at, cls } = useScenes();
  return (
    <div className="r-panel" {...at(show)}>
      <div className="r-panel-h">
        <span className="grow">Session #{session.id}</span>
        {detailHl
          ? <Click on={detailHl}><Btn hl={detailHl}>View in detail</Btn></Click>
          : <Btn>View in detail</Btn>}
        <span className="r-x"><Icon name="x" size={16} /></span>
      </div>
      <div className="r-panel-b">
        <div {...cls('r-scroll', scroll)}>{children}</div>
        <div className="r-note"><Icon name="info" size={14} />All the data computed is based on last 30 days.</div>
      </div>
    </div>
  );
}
