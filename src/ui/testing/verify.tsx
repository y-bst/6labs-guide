// Test-case verification report (Functional Test, AI Functional Test): result and coverage,
// the file it was checked against, the case list, and the case detail popup.
import { OUTCOME, RAIL, VERIFY, type Case, type CaseDetail, type Outcome } from '../../data/verify';
import { useScenes, type Toggle } from '../../shell/scenes';
import { TIcon } from './icons';
import { Button } from './app';

export function StatusPill({ outcome }: { outcome: Outcome }) {
  return <span className={`s-status ${OUTCOME[outcome].tone}`}>{OUTCOME[outcome].label}</span>;
}

/** Grey band at the top of the report: kind of report and run name. */
export function VerifyHeader({ kind, name }: { kind: string; name: string }) {
  return <div className="s-vhead"><span className="s-label">{kind}</span><h3>{name}</h3></div>;
}

/** Result (pass rate of the cases that ran, four counts) beside Coverage (share of the file reached). */
export function Scorecard({ hlResult, hlCoverage }: { hlResult?: Toggle; hlCoverage?: Toggle }) {
  const { cls } = useScenes();
  const tiles: [Outcome, string][] = [['pass', 'passed'], ['failed', 'failed'], ['review', 'need review'], ['nv', 'not verified']];
  return (
    <div className="s-score">
      <div {...cls('s-score-p', { hl: hlResult })}>
        <span className="s-label">Result <small>of the {VERIFY.ran} cases that ran</small></span>
        <div className="s-big"><b>{VERIFY.passRate}%</b>passed</div>
        <div className="s-stackbar">{VERIFY.bar.map((w, i) => <i key={i} style={{ width: `${w}%` }} />)}</div>
        <div className="s-otiles">
          {tiles.map(([o, label]) => <span key={o} className={OUTCOME[o].tone}><b>{VERIFY.counts[o]}</b>{label}</span>)}
        </div>
      </div>
      <div {...cls('s-score-p', { hl: hlCoverage })}>
        <span className="s-label">Coverage <small>of the {VERIFY.inFile} cases in the file</small></span>
        <div className="s-big"><b>{VERIFY.coverage}%</b>reached across {VERIFY.recordings} recordings</div>
        <div className="s-covbar"><i style={{ width: `${VERIFY.coverage}%` }} /></div>
        <p>{VERIFY.unreached} cases never appeared in this footage.</p>
      </div>
    </div>
  );
}

/** The file the cases came from, downloadable, and the build they ran on (AI Functional Test). */
export function VerifiedAgainst({ build }: { build?: string }) {
  return <div className="s-against"><span className="s-label">Verified against</span><a><TIcon name="download" size={15} width={2} />{VERIFY.file}</a>{build && <em>on build {build}</em>}</div>;
}

/** Search, category, and status tabs with counts. */
export function CaseFilters({ tab = 'all', hl }: { tab?: Outcome | 'all'; hl?: Toggle }) {
  const { cls } = useScenes();
  const tabs: [Outcome | 'all', string, string][] = [
    ['all', 'All', VERIFY.ran],
    ...(['pass', 'failed', 'review', 'nv'] as Outcome[]).map(o => [o, OUTCOME[o].label, VERIFY.counts[o]] as [Outcome, string, string]),
  ];
  return (
    <div {...cls('s-cfilters', { hl })}>
      <div className="s-row" style={{ gap: '10px' }}>
        <span className="s-search" style={{ flex: '1' }}><TIcon name="search" size={15} />Search id, name, category or reason…</span>
        <span className="s-select">All categories<TIcon name="chevDown" size={14} width={2} /></span>
      </div>
      <div className="s-seg s-otabs">
        {tabs.map(([id, label, n]) => <span key={id} className={id === tab ? 'on' : undefined}>{label} <small>{n}</small></span>)}
      </div>
    </div>
  );
}

/** One row per case: ID, case, category with its path, reason, status. */
export function CaseTable({ cases, open, hl }: { cases: Case[]; open?: { id: string; when: Toggle }; hl?: Toggle }) {
  const { cls } = useScenes();
  return (
    <div {...cls('s-ctable', { hl })}>
      <div className="s-crow head"><span>ID</span><span>Test case</span><span>Category</span><span>Reason</span><span>Status</span><span /></div>
      {cases.map(c => (
        <div key={c.id} {...cls('s-crow', { hl: open?.id === c.id ? open.when : undefined })}>
          <span className="mono">{c.id}</span>
          <span>{c.title}</span>
          <span>{c.category}<small>{c.path}</small></span>
          <span>{c.reason}</span>
          <span><StatusPill outcome={c.outcome} /></span>
          <TIcon name="chevRight" size={14} width={2} />
        </div>
      ))}
      <div className="s-pager">
        <Button tone="ghost" sm className="dim"><TIcon name="chevLeft" size={13} width={2} />Previous</Button>
        <span>Page 1 of 104</span>
        <Button tone="ghost" sm>Next<TIcon name="chevRight" size={13} width={2} /></Button>
        <small>1–12 of {VERIFY.ran}</small>
      </div>
    </div>
  );
}

/**
 * The case detail popup: case navigator on the left, the clip and what the sheet specified in the
 * middle, what was observed on the right. `ai` adds the "Played by an AI player" marker.
 */
export function CaseModal({ detail: d, ai, hlSteps, hlStep, hlSpecified, hlObserved }: {
  detail: CaseDetail;
  ai?: boolean;
  hlSteps?: Toggle;
  /** Highlight the first step, as if clicked; the clip jumps to it. */
  hlStep?: Toggle;
  hlSpecified?: Toggle;
  hlObserved?: Toggle;
}) {
  const { cls } = useScenes();
  return (
    <div className="s-modal s-case">
      <div className="s-case-h">
        <div><small><span className="mono">{d.id}</span> {d.crumb}</small><h2>{d.title}</h2></div>
        <TIcon name="close" size={18} width={2} />
      </div>
      <div className="s-case-b">
        <div className="s-rail">
          <span className="s-search sm"><TIcon name="search" size={14} />Search cases…</span>
          <span className="s-select sm">All outcomes<TIcon name="chevDown" size={13} width={2} /></span>
          {RAIL.map(([cat, cases]) => (
            <div key={cat} className="s-rail-g">
              <span className="s-label">{cat}</span>
              {cases.map(([id, title, o]) => (
                <div key={id} className={id === d.id ? 's-rail-i on' : 's-rail-i'}>
                  <i className={OUTCOME[o].tone} /><span>{title}<small>{id}</small></span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="s-evidence">
          {ai && <span className="s-aimark"><TIcon name="aiPerson" size={13} width={1.8} />Played by an AI player</span>}
          <div {...cls('s-clip', { jump: hlStep })}>
            <span className="s-clip-play"><TIcon name="play" size={18} /></span>
          </div>
          <div className="s-clipbar"><i /></div>
          <div className="s-clipctl"><TIcon name="play" size={13} /><span>0:00 / {d.duration}</span></div>
          <span className="s-cliprange">{d.clip}</span>
          <div {...cls('s-spec', { hl: hlSpecified })}>
            <span className="s-label">Specified</span>
            <small>Precondition</small><p>{d.precondition}</p>
            <small>Expected result</small><p>{d.expected}</p>
          </div>
        </div>
        <div className="s-observed-col">
          <div {...cls('s-observed', { hl: hlObserved })}>
            <div className="s-observed-h"><span className="s-label">Observed</span><StatusPill outcome={d.outcome} /></div>
            <small>Result</small><p>{d.result}</p>
            <small>Steps</small>
            <ol {...cls('s-steps', { hl: hlSteps })}>
              {d.steps.map(([step, time], i) => (
                <li key={time} {...cls('', { on: i === 0 ? hlStep : undefined })}><i>{i + 1}</i><span>{step}</span><time>{time}</time></li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <div className="s-case-f">
        <span>{d.position}</span>
        <span style={{ flex: '1' }} />
        <Button tone="ghost" sm><TIcon name="chevLeft" size={13} width={2} />Previous</Button>
        <Button tone="ghost" sm>Next<TIcon name="chevRight" size={13} width={2} /></Button>
      </div>
    </div>
  );
}
