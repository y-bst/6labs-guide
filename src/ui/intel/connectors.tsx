// Connectors: the list page, connector cards, health pills, and one connection's detail page.
import { ACTIVE_CONNECTORS, AVAILABLE_CONNECTORS, COLUMNS, type Connector } from '../../data/intel';
import { Layer, useScenes, type SceneSpec, type Toggle } from '../../shell/scenes';
import { Icon } from '../Icon';
import { PageHead, ScreenBar } from './app';
import { BRANDS, BrandLogo } from './brands';

export function Avatar({ who }: { who: 'A' | 'Y' }) {
  return <span className={who === 'Y' ? 'c-av y' : 'c-av'}>{who}</span>;
}

export type Health = 'sync' | 'need' | 'ready' | 'err';
const HEALTH: Record<Health, string> = { sync: 'SYNCING', need: 'NEEDS WORK', ready: 'READY', err: 'ERROR' };

/** Connection health pill. */
export function Status({ health, show }: { health: Health; show?: SceneSpec }) {
  const { at } = useScenes();
  return <span className={`c-status ${health}`} {...at(show)}>{HEALTH[health]}</span>;
}

/**
 * A connector card. `kindDuring` reveals whether it pulls data in or pushes insights out,
 * and tints the card to match.
 */
export function ConnectorCard({ connector, kindDuring, wide }: { connector: Connector; kindDuring?: SceneSpec; wide?: boolean }) {
  const { at, cls } = useScenes();
  const { brand, kind, desc, owners } = connector;
  const label = kind === 'in' ? (wide ? '↓ Pulls data in' : '↓ In') : '↑ Out';
  return (
    <div {...cls('c-card', { [kind]: kindDuring })}>
      {kindDuring && <span className={`c-kind ${kind}`} {...at(kindDuring)}>{label}</span>}
      <div className="c-card-h"><BrandLogo brand={brand} />{BRANDS[brand].name}</div>
      <p>{desc}</p>
      {owners && (
        <div className="c-who">
          {owners.map(o => <Avatar key={o} who={o} />)}
          {owners.length === 1 ? '1 connection' : `${owners.length} connections`}
        </div>
      )}
    </div>
  );
}

/** The Connectors page: active in your company, then available to add. */
export function ConnectorsPage({ show, activeHl, kindDuring }: { show: SceneSpec; activeHl?: SceneSpec; kindDuring?: SceneSpec }) {
  const { cls } = useScenes();
  return (
    <Layer show={show} className="i-pg c-page">
      <PageHead page="connectors" />
      <div className="c-sh">Active in your company <span className="c-live">{ACTIVE_CONNECTORS.length} active</span></div>
      <div {...cls('c-grid2', { hl: activeHl })}>
        {ACTIVE_CONNECTORS.map(c => <ConnectorCard key={c.brand} connector={c} kindDuring={kindDuring} wide />)}
      </div>
      <div className="c-div">AVAILABLE TO ADD</div>
      <div className="c-grid3">
        {AVAILABLE_CONNECTORS.map(c => <ConnectorCard key={c.brand} connector={c} kindDuring={kindDuring} />)}
      </div>
    </Layer>
  );
}

/**
 * One BigQuery connection, opened from its card. It belongs to "you" (tab Y);
 * a teammate's connection (tab A) sits next to it.
 */
export function ConnectionDetail({ health, ownerHl, columns, describeHl }: {
  /** Health pill next to the name, per scene. */
  health: { health: Health; show: SceneSpec }[];
  /** Pulse the owner row and its edit switch. */
  ownerHl?: Toggle;
  /** Scenes where the table is expanded to its columns. */
  columns?: SceneSpec;
  /** Pulse the table and the read-only note. */
  describeHl?: Toggle;
}) {
  const { at, cls } = useScenes();
  return (
    <>
      <ScreenBar title="Connectors" />
      <div className="i-pg" style={{ top: '52px', paddingTop: '24px' }}>
        <div className="c-tabs">
          <span><Avatar who="A" />bq-oracle-limited-access</span>
          <span className="on"><Avatar who="Y" />sixlabs-qa</span>
          <span className="add">+ Add connection</span>
        </div>
        <div {...cls('c-own', { hl: ownerHl })}>
          <span className="c-perm">You can edit</span>Connected by you
          <span className="c-toggle">Allow members in your company to edit descriptions<span className="c-tg" /></span>
        </div>
        <div className="c-head">
          <span className="c-bigl"><Icon name="g" size={30} /></span>
          <div>
            <div className="c-name">BigQuery{health.map(h => <Status key={h.show} health={h.health} show={h.show} />)}</div>
            <div className="c-chips"><span>Data warehouse</span><span className="b">GCP</span><span>Project sixlabs-qa</span></div>
          </div>
          <div className="acts"><span className="i-btn brand">Disconnect</span><span className="i-btn brand">Refresh</span></div>
        </div>
        <div className="c-stats">
          {[['TABLES IMPORTED', '1'], ['READY · NEEDS WORK', '0 · 1'], ['CONNECTED / UPDATED', '5/11/2026'], ['LAST REFRESH', 'just now']].map(([k, v]) => (
            <div key={k} className="c-stat"><small>{k}</small><b>{v}</b></div>
          ))}
        </div>
        <div className="c-tbl-h">Tables <small>Click any table to edit descriptions</small></div>
        <div {...cls('c-table', { hl: describeHl })}>
          <div className="c-table-h">
            <span style={{ flex: '1' }}><b>sixlabs-qa.oracleDataSet.app_click_data</b><small>1.0M rows · 407.6 MB · 31 columns · 21/31 described (68%)</small></span>
            <span className="c-need">NEEDS DESCRIPTIONS</span>
            <Icon name="down" size={16} style={{ color: 'var(--ink-4)' }} />
          </div>
          {columns && (
            <div className="c-cols" {...at(columns)}>
              <div className="lab"><span>COLUMNS (31)</span><span>Inline edit · Tab to next field</span></div>
              {COLUMNS.map(c => (
                <div key={c.name} className="c-col"><code>{c.name}</code><em>{c.type}</em>{c.desc ? <span>{c.desc}</span> : <span className="miss">Add a description…</span>}</div>
              ))}
            </div>
          )}
        </div>
        <div {...cls('c-ro', { hl: describeHl })}><Icon name="lock" size={15} />6labs only reads from your warehouse — we never write back. Description edits live in 6labs and don't modify BigQuery metadata.</div>
      </div>
    </>
  );
}
