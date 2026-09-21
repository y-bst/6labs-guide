// AI player tests: picking a build, setting up personas and agents, live sessions,
// findings split by persona, and one agent's video page (what it saw, thought and did).
import type { ReactNode } from 'react';
import { AGENT, PERSONAS, type AgentFinding, type Persona } from '../../data/behavioural';
import { BUILDS, type Build } from '../../data/verify';
import { useScenes, type SceneSpec, type Toggle } from '../../shell/scenes';
import { Apk } from './composer';
import { TIcon } from './icons';
import { Button } from './app';
import { Click } from '../Click';

/* ---------- builds ---------- */

/** "Select a build": drop an APK, or pick one uploaded before (the newest is picked). */
export function BuildDialog({ hlDrop, hlList, click }: {
  hlDrop?: Toggle;
  hlList?: Toggle;
  /** Scenes in which a cursor taps "Use <build>", which closes the picker. */
  click?: SceneSpec;
}) {
  const { cls } = useScenes();
  return (
    <div className="s-modal s-builds">
      <div className="s-builds-h">
        <TIcon name="close" size={16} width={2} />
        <h2>Select a build</h2>
        <p>Upload an APK, or pick one you uploaded before. The AI players install the build you choose.</p>
      </div>
      <div {...cls('s-drop', { hl: hlDrop })}>
        <span className="s-intile-ic"><TIcon name="uploadTray" size={16} width={1.9} /></span>
        <b>Drop a build here or click to upload</b>
        <span>A release build of the game the AI players will install and play.</span>
        <span className="s-formats">APK · up to 500 MB</span>
      </div>
      <div {...cls('s-buildlist', { hl: hlList })}>
        <div className="s-buildlist-h"><b>Uploaded builds</b><small>{BUILDS.length} ready</small></div>
        {BUILDS.map((b, i) => (
          <div key={b.version} className={i === 0 ? 's-build on' : 's-build'}>
            <span className="s-radio" /><Apk />
            <span><b>{b.version}{i === 0 && <em>Newest</em>}</b><small>{b.file} · {b.size} · uploaded {b.uploaded}</small></span>
            <span className="s-ready">Ready to run</span>
            {i === 0 ? <TIcon name="check" size={14} width={2.2} /> : <span />}
          </div>
        ))}
      </div>
      <div className="s-builds-f"><span>The players will install {BUILDS[0].version}.</span><Button tone="ghost" sm>Cancel</Button>{click
        ? <Click on={click}><Button tone="primary" sm>Use {BUILDS[0].version}</Button></Click>
        : <Button tone="primary" sm>Use {BUILDS[0].version}</Button>}</div>
    </div>
  );
}

/** The chosen build as a form field, with Change. */
export function BuildField({ build }: { build: Build }) {
  return <div className="s-field"><Apk /><b>{build.version}</b><span>uploaded {build.uploaded} · newest</span><span className="grow" /><a>Change</a><TIcon name="chevDown" size={13} width={2} /></div>;
}

/* ---------- session setup ---------- */

/** One row of "Set up a session": label on the left, field on the right. */
export function FormRow({ label, optional, hl, children }: { label: string; optional?: boolean; hl?: Toggle; children: ReactNode }) {
  const { cls } = useScenes();
  return (
    <div className="s-frow">
      <span className="s-frow-l">{label}{optional && <small> (optional)</small>}</span>
      <div {...cls('s-frow-f', { hl })}>{children}</div>
    </div>
  );
}

const dot = (p: Persona) => <i className="s-pdot" style={{ background: p.color }} />;

/** The persona list, open: every persona with its one-line description; `checked` are ticked. */
export function PersonaMenu({ checked, about }: { checked: string[]; about: { name: string; text: string } }) {
  return (
    <div className="s-pmenu">
      <span className="s-search sm">Search 14 personas…</span>
      {PERSONAS.map(p => (
        <div key={p.name} className={checked.includes(p.name) ? 's-pitem on' : 's-pitem'}>
          <span className={checked.includes(p.name) ? 's-checkbox on' : 's-checkbox'} /><b>{p.name}</b><small>{p.note}</small>
        </div>
      ))}
      <div className="s-pabout"><span className="s-label">{about.name}</span><p>{about.text}</p></div>
    </div>
  );
}

/** Agents per persona with − n + steppers, and the total. */
export function AgentCounts({ mix, hl }: { mix: [Persona, number][]; hl?: Toggle }) {
  const { cls } = useScenes();
  const total = mix.reduce((n, [, k]) => n + k, 0);
  return (
    <div {...cls('s-agents', { hl })}>
      {mix.map(([p, n]) => (
        <div key={p.name} className="s-agents-r">
          {dot(p)}<b>{p.name}</b><small>{p.note}</small>
          <span className="s-stepper"><span>−</span><b>{n}</b><span>+</span></span>
        </div>
      ))}
      <div className="s-agents-t"><b>{total} {total === 1 ? 'agent' : 'agents'}</b> in total</div>
    </div>
  );
}

/** Session length: 15 / 30 / 60 min or Custom. */
export function LengthChoice({ value }: { value: string }) {
  return <div className="s-seg s-length">{['15 min', '30 min', '60 min', 'Custom'].map(v => <span key={v} className={v === value ? 'on' : undefined}>{v}</span>)}</div>;
}

/** "New player ×12" chips, for run history. */
export function PersonaChips({ mix }: { mix: [Persona, number][] }) {
  return <span>{mix.map(([p, n]) => <span key={p.name} className="s-mtag">{p.name} ×{n}</span>)}</span>;
}

/** "● Watch live" button of a playing run. */
export const WatchLive = () => <Button tone="ghost" sm className="s-watch"><i />Watch live</Button>;

/* ---------- a run's page ---------- */

/** Report / Videos tabs of a run. */
export function RunPageTabs({ on, videos }: { on: 'report' | 'videos'; videos: number }) {
  return (
    <div className="s-tabs">
      <span className={on === 'report' ? 'on' : undefined}>Report</span>
      <span className={on === 'videos' ? 'on' : undefined}>Videos <span className="n">{videos}</span></span>
    </div>
  );
}

/** One agent's session: LIVE with the time so far while it plays, or its length once finished. */
export function SessionCard({ persona, n, live }: { persona: Persona; n: number; live?: string }) {
  return (
    <div className="s-scard">
      <div className="s-scard-t">
        {live ? <span className="s-live">Live</span> : null}
        <span className="s-dur">{live ?? '30 min'}</span>
      </div>
      <b>{dot(persona)}{persona.name} · agent {n}</b>
    </div>
  );
}

/* ---------- findings ---------- */

/** How many agents of each persona hit a finding. */
export function PersonaSplit({ split }: { split: AgentFinding['split'] }) {
  return (
    <div className="s-split">
      <span className="s-label"><TIcon name="aiPerson" size={12} width={1.8} />By AI player</span>
      {split.map(([p, hit, of]) => (
        <div key={p.name} className="s-split-r">
          {dot(p)}<span>{p.name}</span>
          <span className="s-split-bar"><i style={{ width: `${(hit / of) * 100}%`, background: p.color }} /></span>
          <small>{hit} of {of}</small>
        </div>
      ))}
    </div>
  );
}

/** A finding from AI players: severity, persona split, what happened, clips coloured by persona, fix. */
export function AgentFindingCard({ finding: f, of, hlSplit, hlEvidence, clip, clipClick }: {
  finding: AgentFinding;
  /** Agents in the run. */
  of: number;
  hlSplit?: Toggle;
  hlEvidence?: Toggle;
  /** Mark the first clip as opened. */
  clip?: Toggle;
  /** Scenes in which a cursor taps that clip, which opens the agent's video next. */
  clipClick?: SceneSpec;
}) {
  const { cls } = useScenes();
  const chips = f.split.flatMap(([p, hit]) => Array.from({ length: hit }, () => p));
  const tone = f.severity === 'Blocking' ? 'red' : f.severity === 'Disruptive' ? 'amber' : 'grey';
  return (
    <div className="s-finding" style={{ ['--sev' as string]: `var(--${tone === 'grey' ? 'ink-4' : tone})` }}>
      <div className="s-finding-h"><b>{f.title}</b><span><strong>{f.agents}</strong> / {of} agents</span></div>
      <div className="s-row" style={{ gap: '8px', marginTop: '8px' }}><span className={`s-chip ${tone}`}>{f.severity}</span><span className="s-screen">{f.screen}</span></div>
      <div {...cls('', { hl: hlSplit })} style={{ borderRadius: '8px', marginTop: '12px' }}><PersonaSplit split={f.split} /></div>
      <p>{f.text}</p>
      <div {...cls('s-evi s-pevi', { hl: hlEvidence })} style={{ borderRadius: '8px' }}>
        <span className="s-label" style={{ marginRight: '4px' }}>Evidence</span>
        {chips.map((p, i) => {
          const chip = <button {...cls('', { on: i === 0 ? clip : undefined })} style={{ ['--pc' as string]: p.color }}>{i + 1}</button>;
          return i === 0 && clipClick ? <Click key={i} on={clipClick}>{chip}</Click> : <span key={i} style={{ display: 'contents' }}>{chip}</span>;
        })}
      </div>
      <div className="s-reco"><span className="s-label">Recommendation</span>{f.recommendation}</div>
    </div>
  );
}

/* ---------- one agent's video ---------- */

/**
 * An agent's session: the captured screen with the action as a caption, a frame strip, and
 * what the agent saw, its reasoning in its own words, and what it did.
 */
export function AgentVideo({ persona, build, length, hlSaw, hlReasoning, hlDid }: {
  persona: Persona;
  build: string;
  length: string;
  hlSaw?: Toggle;
  hlReasoning?: Toggle;
  hlDid?: Toggle;
}) {
  const { cls } = useScenes();
  const a = AGENT;
  return (
    <div className="s-avideo">
      <div className="s-avideo-h">
        <div className="s-icon ai sm"><TIcon name="aiPerson" size={20} width={1.5} /></div>
        <div className="grow"><b>{a.title}</b><span>{a.about}</span></div>
        <div className="s-kv"><span className="s-label">Build</span><b>{build}</b></div>
        <div className="s-kv"><span className="s-label">Session length</span><b>{length}</b></div>
      </div>
      <div className="s-avideo-b">
        <div className="s-phone">
          <div className="s-phone-scr" style={{ ['--pc' as string]: persona.color }}>
            <span className="s-dur">{a.time}</span>
            <span className="s-phone-cap">{a.did}</span>
          </div>
          <div className="s-phone-ctl"><span className="s-send sm"><TIcon name="play" size={12} /></span><span className="mono">{a.time} / 30:00</span><span className="s-phone-bar"><i /></span><small>Screen {a.screen} of {a.screens}</small></div>
          <div className="s-frames">{a.frames.map(t => <span key={t} className={t === a.time ? 'on' : undefined}><i>{t}</i></span>)}</div>
        </div>
        <div className="s-screenpanel">
          <span className="s-label">Screen {a.screen} · {a.time}</span>
          <h4>{a.place}</h4>
          <div {...cls('s-sp', { hl: hlSaw })}><span className="s-label">Saw</span><p>{a.saw}</p></div>
          <div {...cls('s-sp s-reason', { hl: hlReasoning })}><span className="s-label">Reasoning</span><p>“{a.reasoning}”</p></div>
          <div {...cls('s-sp', { hl: hlDid })}><span className="s-label">Did</span><p className="did"><TIcon name="arrowRight" size={14} width={2} />{a.did}</p><small>{a.observed}</small></div>
          <div className="s-sp-f"><Button tone="ghost" sm><TIcon name="chevLeft" size={13} width={2} />Previous</Button><Button tone="ghost" sm>Next screen<TIcon name="chevRight" size={13} width={2} /></Button></div>
        </div>
      </div>
    </div>
  );
}
