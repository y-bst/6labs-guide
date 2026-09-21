// Report building blocks for testing agents: numbers, categories, ranked findings, answers.
import type { CSSProperties, ReactNode } from 'react';
import { CATEGORIES, QUIT_SUMMARY, QUITS, RUN, TILES, type TopFindingData } from '../../data/testing';
import { useScenes, type Toggle } from '../../shell/scenes';
import { TIcon } from './icons';
import { Button } from './app';

/** Breadcrumb bar across the top of a report page, with buttons on the right. */
export function Crumb({ trail, name = RUN.name, back, children }: {
  trail: string;
  /** Page name after the trail. Defaults to the User Test run. */
  name?: string;
  /** Back arrow before the trail. */
  back?: boolean;
  children: ReactNode;
}) {
  if (!back) return <div className="s-crumb"><span><span>{trail}</span>{name}</span>{children}</div>;
  return <div className="s-crumb"><b className="s-crumb-t"><TIcon name="chevLeft" size={15} width={2} /><span>{trail}</span>{name}</b><div className="s-crumb-r">{children}</div></div>;
}

/** Run status pill in a report's top bar. */
export function RunState({ state }: { state: 'complete' | 'progress' | 'finished' }) {
  const [tone, label] = { complete: ['ok', 'Complete'], progress: ['busy', 'In progress'], finished: ['done', 'Finished'] }[state];
  return <span className={`s-state ${tone}`}>{label}</span>;
}

export function GhostButton({ download, hl, children }: { download?: boolean; hl?: Toggle; children: ReactNode }) {
  const { cls } = useScenes();
  return <Button tone="ghost" sm hl={hl}>{download && <TIcon name="download" size={16} width={2} />}{children}</Button>;
}

/** The headline numbers: sessions, footage, bugs, friction (User Test by default). */
export function ReportTiles({ tiles = TILES, hl, style }: { tiles?: typeof TILES; hl?: Toggle; style?: CSSProperties }) {
  const { cls } = useScenes();
  const cols = tiles.length === 4 ? style : { gridTemplateColumns: `repeat(${tiles.length},minmax(0,1fr))`, ...style };
  return (
    <div {...cls('s-tiles', { hl })} style={cols}>
      {tiles.map(t => <div key={t.label} className="s-tile"><b>{t.dot && <span className={`s-dot ${t.dot}`} />}{t.value}</b><span>{t.label}</span></div>)}
    </div>
  );
}

/** Numbered section heading, e.g. "01 Summary". */
export function SectionHead({ n, title, style, small }: { n: string; title: string; style?: CSSProperties; small?: boolean }) {
  return <div className="s-sec-h" style={style}><i>{n}</i><h3 style={small ? { fontSize: '19px' } : undefined}>{title}</h3></div>;
}

/** Findings by category, with a total row (User Test by default). */
export function CategoryTable({ rows = CATEGORIES, hl }: { rows?: typeof CATEGORIES; hl?: Toggle }) {
  const { cls } = useScenes();
  const sum = (k: 'findings' | 'blocking') => rows.reduce((n, c) => n + c[k], 0);
  return (
    <div {...cls('s-cat four', { hl })}>
      <div><span>Category</span><span>Findings</span><span>Sessions affected</span><span>Blocking</span></div>
      {rows.map(c => (
        <div key={c.name}><span><i className={`s-dot ${c.dot}`} />{c.name}</span><span>{c.findings}</span><span>{c.sessions}</span><span>{c.blocking}</span></div>
      ))}
      <div className="total"><span>All findings</span><span>{sum('findings')}</span><span>—</span><span>{sum('blocking')}</span></div>
    </div>
  );
}

/** One ranked finding. `brief` drops the chips and the clips link. */
export function TopFinding({ finding: f, rank, brief, style }: { finding: TopFindingData; rank: number; brief?: boolean; style?: CSSProperties }) {
  const tone = f.severity === 'Blocking' ? 'red' : 'amber';
  return (
    <div className="s-top" style={style}>
      <span className={`s-rank ${tone}`}>{rank}</span>
      <span>
        <b>{f.title}</b>
        <p>{f.text}</p>
        {!brief && (
          <span className="s-row" style={{ gap: '6px' }}>
            <span className={`s-chip ${tone}`}>{f.severity}</span>
            <span className={`s-chip ${tone}`}>{f.kind}</span>
            <span className="s-screen">{f.screen}</span>
          </span>
        )}
      </span>
      <span className="s-count"><b>{f.sessions}</b> / {RUN.videos} sessions{!brief && <a>▶ {f.sessions} clips</a>}</span>
    </div>
  );
}

/** Link from the summary to the full report. `button` replaces the default button. */
export function FullReportCta({ style, button }: { style?: CSSProperties; button?: ReactNode }) {
  return (
    <div className="s-fullcta" style={style}>
      <div className="s-icon ut sm"><TIcon name="report" size={20} /></div>
      <div style={{ flex: '1' }}><b>View full report</b><span>All 7 findings, with clips and recommendations</span></div>
      {button ?? <Button tone="primary" sm>Open the full report</Button>}
    </div>
  );
}

export function AgentHeader({ sub, style }: { sub: string; style?: CSSProperties }) {
  return (
    <div className="s-agent-h" style={style}>
      <div className="s-icon ut sm"><TIcon name="userTest" size={20} /></div>
      <div><b>User Test</b><span>{sub}</span></div>
    </div>
  );
}

export function SourcesBar({ style }: { style?: CSSProperties }) {
  return <div className="s-sources" style={style}>Sources <span>· {RUN.videos} videos ▾</span></div>;
}

/** Top of the full report: run name, what was analysed, the four numbers. */
export function ReportHeader() {
  return (
    <div className="s-rep-top">
      <div className="s-rep-row"><span className="s-label">User test report</span><span className="s-rep-id">{RUN.id}</span></div>
      <h3>{RUN.name}</h3>
      <p>{RUN.videos} videos analysed · {RUN.context} · generated {RUN.generated}</p>
      <ReportTiles />
    </div>
  );
}

/** Answer to "Which testers quit before finishing onboarding?": summary, then a table with clips. */
export function QuitAnswer({ sub, pad, sources, rows = QUITS.length }: {
  sub: string;
  /** Horizontal padding inside the card. */
  pad: number;
  /** Show the Sources bar under the header. */
  sources?: boolean;
  rows?: number;
}) {
  const p = (v: number) => `${v}px ${pad}px`;
  return (
    <div className="s-agent">
      <AgentHeader sub={sub} style={{ padding: p(14) }} />
      {sources && <SourcesBar style={{ padding: p(10) }} />}
      <div className="s-sec" style={{ padding: p(14) }}>
        <SectionHead n="01" title="Summary" small style={{ marginBottom: '8px' }} />
        <p className="s-para" style={{ margin: '0' }}>{QUIT_SUMMARY}</p>
      </div>
      <div className="s-sec" style={{ padding: p(14) }}>
        <SectionHead n="02" title="Details" small style={{ marginBottom: '6px' }} />
        <div className="s-ans head"><span>Tester</span><span>Quit at</span><span>Last screen</span><span>Clip</span></div>
        {QUITS.slice(0, rows).map(([tester, time, screen]) => (
          <div key={tester} className="s-ans"><span className="mono">{tester}</span><span className="mono">{time}</span><span>{screen}</span><a>▶ Watch</a></div>
        ))}
      </div>
    </div>
  );
}
