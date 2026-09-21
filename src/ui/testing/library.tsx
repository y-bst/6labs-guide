// Gameplay Library pieces: tag pills and video cards.
import type { CSSProperties } from 'react';
import type { Video } from '../../data/testing';
import { useScenes, type SceneSpec, type Toggle } from '../../shell/scenes';
import { Button } from './app';
import { Click } from '../Click';

/** Tag filter pill with its count. */
export function Pill({ label, n, on, hl }: { label: string; n: number; on?: Toggle; hl?: Toggle }) {
  const { cls } = useScenes();
  return <span {...cls('s-pill', { on, hl })}>{label} <span className="n">{n}</span></span>;
}

export interface VideoCardProps {
  video: Video;
  /** Show the selection checkbox on the thumbnail. */
  checkbox?: boolean;
  /** Selected look (blue outline, ticked box). */
  sel?: Toggle;
  /** Scenes in which a cursor taps this card's checkbox. */
  tick?: SceneSpec;
  /** Hide parts for smaller cards. */
  hide?: ('duration' | 'date' | 'tags')[];
  /** Show only during some scenes. */
  show?: SceneSpec;
  /** Extra class, e.g. for an animation. */
  className?: string;
  style?: CSSProperties;
}

export function VideoCard({ video: v, checkbox, sel, tick, hide = [], show, className, style }: VideoCardProps) {
  const { at, cls } = useScenes();
  const has = (part: 'duration' | 'date' | 'tags') => !hide.includes(part);
  const box = <span className="s-checkbox" />;
  return (
    <div {...cls(className ? `s-card ${className}` : 's-card', { sel })} {...at(show)} style={style}>
      <div className={`s-thumb g${v.g}`}>
        {checkbox && (tick ? <Click on={tick} from="left">{box}</Click> : box)}
        <span className="s-src">{v.source}</span>
        {has('duration') && v.duration && <span className="s-dur">{v.duration}</span>}
      </div>
      <div className="s-card-body">
        <div className="s-title">{v.title}</div>
        <div className="s-meta"><i>{v.initials}</i>{v.who}{has('date') && v.date && <>{' '}<span>· {v.date}</span></>}</div>
        {has('tags') && v.batch && (
          <div className="s-tags">
            <span className="s-batch"><b>Batch</b> · {v.batch}</span>
            {v.tag === true ? <span className="s-addtag">+ Add tags</span> : v.tag && <span className="s-utag">{v.tag}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

/** Three-column grid of video cards. */
export function VideoGrid({ videos, ...card }: { videos: Video[] } & Omit<VideoCardProps, 'video'>) {
  return <div className="s-grid">{videos.map(v => <VideoCard key={v.title} video={v} {...card} />)}</div>;
}

/**
 * The Gameplay Library opened inside a test ("Pick sessions"), with the first tag tapped and its
 * whole batch selected. Put it in a layer after a <div className="backdrop" />.
 */
export function LibraryPicker({ tags, videos, selected, playTime, hl, click }: {
  tags: readonly (readonly [label: string, count: number])[];
  /** Cards shown in the grid, all selected. */
  videos: Video[];
  /** How many videos the tapped tag selected. */
  selected: number;
  /** Total play time of the selection, e.g. "2h 14m". */
  playTime: string;
  /** Highlight the tapped tag. */
  hl?: Toggle;
  /** Scenes in which a cursor taps "Use N videos", which closes the picker. */
  click?: SceneSpec;
}) {
  return (
    <div className="s-modal s-picker">
      <div className="s-picker-h">
        <span className="s-x">✕</span>
        <span className="s-label">Gameplay Library</span>
        <h2 style={{ marginTop: '8px' }}>Pick sessions</h2>
        <p>Recordings from your Gameplay Library. Pick a tag to select a whole batch.</p>
      </div>
      <div className="s-panel-top">
        <span className="s-label">Select by tag</span>
        {tags.map(([t, n], i) => <Pill key={t} label={t} n={n} on={i === 0 || undefined} hl={i === 0 ? hl : undefined} />)}
      </div>
      <div className="s-panel-bar">
        <span className="s-row" style={{ gap: '8px', fontSize: '14px' }}><span className="s-checkbox on" />Select all {selected}</span>
        <span className="s-sep" />
        <span className="s-seg"><span className="on">All</span><span>Recorder app</span><span>Browser upload</span><span>CLI</span></span>
        <span style={{ flex: '1' }} />
        <span className="s-search" style={{ minWidth: '190px' }}>Search videos</span>
      </div>
      <div className="s-grid">
        {videos.map(v => <VideoCard key={v.title} video={v} checkbox sel hide={['date']} />)}
      </div>
      <div className="s-picker-f">
        <span><b>{selected}</b> selected · {playTime} of play · {tags[0][0]}</span>
        <span style={{ flex: '1' }} />
        <Button tone="ghost" sm>Clear all</Button>
        {click
          ? <Click on={click}><Button tone="primary" sm>Use {selected} videos</Button></Click>
          : <Button tone="primary" sm>Use {selected} videos</Button>}
      </div>
    </div>
  );
}
