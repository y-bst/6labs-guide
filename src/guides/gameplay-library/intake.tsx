// "Every video lands in one library" animation, and the labelled video card.
import type { CSSProperties } from 'react';
import { INTAKE, LIBRARY } from '../../data/testing';
import { Layer } from '../../shell/scenes';
import { TIcon, type TIconName } from '../../ui/testing/icons';
import { VideoCard } from '../../ui/testing/library';

const PATH = {
  recorder: 'M340 215C470 215 470 400 600 400',
  upload: 'M340 400H600',
  cli: 'M340 585C470 585 470 400 600 400',
};

const SOURCES: { cls: string; top: number; icon: TIconName; name: string; note: string }[] = [
  { cls: 'r', top: 160, icon: 'record', name: 'Gameplay Recorder App', note: 'Records while testers play' },
  { cls: 'u', top: 345, icon: 'upload', name: 'Browser upload', note: 'Drop in files you have' },
  { cls: 'c', top: 530, icon: 'cli', name: 'CLI', note: 'Push hundreds at once' },
];

/** Video chips travelling along the paths: gradient, path, start delay. */
const CHIPS: [string, string, string][] = [
  ['g1', PATH.recorder, '0s'], ['g3', PATH.upload, '.75s'], ['g2', PATH.cli, '1.5s'],
  ['g6', PATH.recorder, '2.25s'], ['g4', PATH.upload, '3s'], ['g5', PATH.cli, '3.75s'],
];

export function Intake() {
  return (
    <Layer show="intake" className="intake" toggles={{ play: 'intake' }}>
      <span className="in-title" style={{ left: '50px', top: '112px' }}>Sources</span>
      {SOURCES.map(s => (
        <div key={s.cls} className={`in-src ${s.cls}`} style={{ top: `${s.top}px` }}>
          <span className="ic"><TIcon name={s.icon} size={22} /></span>
          <span><b>{s.name}</b><small>{s.note}</small></span>
        </div>
      ))}
      <svg className="in-paths" width="1180" height="780" viewBox="0 0 1180 780" fill="none" strokeLinecap="round">
        {Object.values(PATH).map(d => <path key={`b${d}`} className="base" d={d} />)}
        <path className="flowline r" d={PATH.recorder} />
        <path className="flowline u" d={PATH.upload} />
        <path className="flowline c" d={PATH.cli} />
        <circle cx="600" cy="400" r="7" fill="#1770EF" />
      </svg>
      {CHIPS.map(([g, d, delay]) => <i key={g} className={`chip ${g}`} style={{ offsetPath: `path('${d}')`, '--d': delay } as CSSProperties} />)}
      <div className="in-lib">
        <div className="in-lib-h">
          <div className="s-icon lib sm"><TIcon name="library" size={22} width={1.7} /></div>
          <div><b>Gameplay Library</b><span>Every recording, from every source</span></div>
        </div>
        <div className="in-grid">
          {INTAKE.map((v, i) => (
            <VideoCard key={v.title} video={v} className={i === 0 ? 'pick' : undefined} style={{ '--t': `${(1.53 + i * 0.75).toFixed(2)}s` } as CSSProperties} />
          ))}
        </div>
      </div>
    </Layer>
  );
}

/** Callouts around one video card: [text, detail, top, side]. Lines are drawn to match. */
const TAGLINES: [string, string, number, 'l' | 'r'][] = [
  ['Source', 'Recorder app · Browser upload · CLI', 356, 'l'],
  ['Username', 'Who added the video', 494, 'l'],
  ['Your tag', 'Added by you · editable', 584, 'l'],
  ['Edit & delete', 'Show when you hover', 428, 'r'],
  ['System tag', 'Added automatically · locked', 538, 'r'],
];

export function CardAnatomy() {
  const v = LIBRARY[0];
  return (
    <Layer show="card" className="anat">
      <div className="s-card anat-card">
        <div className={`s-thumb g${v.g}`}>
          <span className="s-checkbox" />
          <span className="s-src">{v.source}</span>
          <span className="s-dur">{v.duration}</span>
        </div>
        <div className="s-card-body">
          <div className="titlerow">
            <div className="s-title">{v.title}</div>
            <span className="icons"><TIcon name="edit" size={15} width={2} /><TIcon name="trash" size={15} width={2} /></span>
          </div>
          <div className="s-meta"><i>{v.initials}</i>{v.who} <span>· {v.date}</span></div>
          <div className="s-tags"><span className="s-batch"><b>Batch</b> · {v.batch}</span><span className="s-utag">{v.tag}</span></div>
        </div>
      </div>
      <svg className="anat-lines" width="1180" height="780" viewBox="0 0 1180 780" fill="none" stroke="#030D2D" strokeWidth="2">
        <path d="M326 373H396" /><circle cx="400" cy="373" r="5" fill="#1770EF" stroke="none" />
        <path d="M326 511H400" /><circle cx="404" cy="511" r="5" fill="#1770EF" stroke="none" />
        <path d="M326 601H400" /><circle cx="404" cy="601" r="5" fill="#1770EF" stroke="none" />
        <path d="M954 445H892" /><circle cx="888" cy="445" r="5" fill="#1770EF" stroke="none" />
        <path d="M954 555H592" /><circle cx="588" cy="555" r="5" fill="#1770EF" stroke="none" />
      </svg>
      {TAGLINES.map(([b, s, top, side]) => (
        <div key={b} className={`tagline ${side}`} style={{ top: `${top}px` }}><b>{b}</b><span>{s}</span></div>
      ))}
    </Layer>
  );
}
