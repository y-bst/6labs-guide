// Radiologist sessions: search bar, session cards and the gallery they sit in.
import type { CSSProperties, ReactNode } from 'react';
import type { Session } from '../../data/intel';
import { Layer, useScenes, type SceneSpec, type Toggle } from '../../shell/scenes';
import { Icon, type IconName } from '../Icon';
import { PlusButton, SendButton, SourceChip } from './ask';

export function Duration({ children }: { children: ReactNode }) {
  return <span className="r-dur"><Icon name="clock" size={12} />{children}</span>;
}

/** AI tags (✦, blue) then regular tags (grey). With `max`, extra tags collapse into "+N". */
export function Tags({ ai = [], tags = [], max, style }: { ai?: string[]; tags?: string[]; max?: number; style?: CSSProperties }) {
  const all = [...ai.map(t => ({ t, ai: true })), ...tags.map(t => ({ t, ai: false }))];
  const shown = max && all.length > max ? all.slice(0, max) : all;
  const extra = all.length - shown.length;
  return (
    <div className="r-tags" style={style}>
      {shown.map(({ t, ai }) => <span key={t} className={ai ? 'r-ai' : 'r-tag'}>{t}</span>)}
      {extra > 0 && <span className="r-tag">+{extra}</span>}
    </div>
  );
}

/**
 * A session in the results. `compact` shows only the title row; `allTags` skips the "+N" overflow.
 * `pick` outlines it (the session open in the side panel).
 */
export function SessionCard({ session, compact, allTags, pick }: { session: Session; compact?: boolean; allTags?: boolean; pick?: Toggle }) {
  const { cls } = useScenes();
  return (
    <div {...cls('r-card', { pick })}>
      <div className="r-thumb"><Duration>{session.duration}</Duration></div>
      <div className="r-body">
        <div className="r-t">Session #{session.id}<small><Icon name="cal" size={13} />{session.date}</small></div>
        {!compact && <>
          <p className="r-desc">{session.desc}</p>
          <Tags ai={session.ai} tags={session.tags} max={allTags ? undefined : 3} />
        </>}
      </div>
    </div>
  );
}

/** White panel with a Filters button and a grid of session cards. */
export function SessionGallery({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={className ? `r-wrap ${className}` : 'r-wrap'}>
      <div className="r-wrap-h"><span className="i-btn"><Icon name="filter" size={15} />Filters</span></div>
      <div className="r-grid">{children}</div>
    </div>
  );
}

/** Results of a search: bar, count and gallery. `narrow` makes room for the side panel. */
export function ResultsPage({ show, narrow, query, found, searchHl, children }: {
  show: SceneSpec;
  narrow?: Toggle;
  query: string;
  found: number;
  searchHl?: Toggle;
  children: ReactNode;
}) {
  return (
    <Layer show={show} className="i-pg r-results" toggles={{ narrow }}>
      <SearchBar query={query} hl={searchHl} />
      <div className="r-found">Found {found} sessions</div>
      <SessionGallery>{children}</SessionGallery>
    </Layer>
  );
}

/** Search bar after a search: the query on one line with the controls. */
export function SearchBar({ query, hl }: { query: string; hl?: Toggle }) {
  const { cls } = useScenes();
  return (
    <div {...cls('r-bar', { hl })}>
      <span className="q">{query}</span>
      <PlusButton />
      <SourceChip />
      <SendButton on style={{ marginLeft: '0' }} />
    </div>
  );
}
