// AI Behavioural Test pages: session setup, submit → run history, live sessions, the report with a
// finding split by persona, and one agent's video.
import type { ReactNode } from 'react';
import { AIB_CATEGORIES, AIB_FINDING, AIB_RUN, AIB_SUMMARY, AIB_TILES, NEW_PLAYER, PERSONAS, WHALE, type Persona } from '../../data/behavioural';
import { BUILDS } from '../../data/verify';
import { Layer, Show, useScenes } from '../../shell/scenes';
import { AgentCounts, AgentFindingCard, AgentVideo, BuildDialog, BuildField, FormRow, LengthChoice, PersonaChips, PersonaMenu, RunPageTabs, SessionCard, WatchLive } from '../../ui/testing/ai';
import { Button, Input, Label, PageHeader, PageLayer, Row } from '../../ui/testing/app';
import { Scroller } from '../../ui/testing/composer';
import { TIcon } from '../../ui/testing/icons';
import { Pill } from '../../ui/testing/library';
import { CategoryTable, Crumb, GhostButton, ReportTiles, RunState, SectionHead } from '../../ui/testing/report';
import { ClickTarget, HistoryTable, RunRow, RunTabs, SubmitSequence } from '../../ui/testing/run';
import { Click } from '../../ui/Click';

const r = AIB_RUN;
const GENERIC = PERSONAS[0];
const SETUP_NOTE = 'Personas are derived from the player model and improve with every human session added.';

/** The "Set up a session" form. `still` renders it filled in, without scene changes (for the submit sequence). */
function SetupForm({ still, submit }: { still?: boolean; submit: ReactNode }) {
  const { at } = useScenes();
  /** Shown during `spec`, or always when still and `inStill`. */
  const when = (spec: string, inStill: boolean) => (still ? (inStill ? {} : { hidden: true }) : at(spec));
  const counts = (spec: string, mix: [Persona, number][], hl?: string) => (
    <div {...when(spec, spec === 'agents..')}><AgentCounts mix={mix} hl={still ? undefined : hl} /></div>
  );
  const hl = (spec: string) => (still ? undefined : spec);
  return (
    <div className="s-setup">
      <div className="s-setup-h"><b>Set up a session</b><span>{SETUP_NOTE}</span></div>
      <FormRow label="Run name" hl={hl('name')}>
        <div {...when('open', false)}><Input placeholder="e.g. Frost Festival — new player & whale" /></div>
        <div {...when('name..', true)}><Input value={r.name} /></div>
      </FormRow>
      <FormRow label="Build" hl={hl('build')}>
        <div className="s-field empty" {...when('..name', false)}>
          <b>Choose a build…</b><span className="grow" />
          {still ? <Button tone="ghost" sm>Select</Button> : <Click on="name"><Button tone="ghost" sm>Select</Button></Click>}
        </div>
        <div {...when('personas..', true)}><BuildField build={BUILDS[0]} /></div>
      </FormRow>
      <FormRow label="Personas" hl={hl('personas')}>
        <div className="s-field empty" {...when('..build', false)}><b>Choose personas…</b><span className="grow" /><TIcon name="chevDown" size={13} width={2} /></div>
        <div className="s-field" {...when('personas..', true)}><span style={{ color: 'var(--ink)' }}>New player, Whale</span><span className="grow" /><TIcon name="chevDown" size={13} width={2} /></div>
        {!still && <Show when="personas"><PersonaMenu checked={['New player', 'Whale']} click="personas" about={{ name: 'New player', text: 'Day 0–3, first sessions with no prior knowledge. Follows the tutorial and the highlighted actions.' }} /></Show>}
      </FormRow>
      <FormRow label="Agents">
        <div className="s-fnote" {...when('..build', false)}>Choose personas first.</div>
        {counts('personas', [[NEW_PLAYER, 1], [WHALE, 1]])}
        {counts('agents..', r.mix, 'agents')}
      </FormRow>
      <FormRow label="Session length" hl={hl('length')}>
        <div {...when('..agents', false)}><LengthChoice value="15 min" /></div>
        <div {...when('length..', true)}><LengthChoice value={r.length} /></div>
      </FormRow>
      <FormRow label="Instructions" optional hl={hl('length')}>
        <div {...when('..agents', false)}><Input area placeholder="e.g. Focus on the new Frost Festival event. Whales should try the battle pass upgrade path." /></div>
        <div {...when('length..', true)}><Input area value={r.instructions} /></div>
      </FormRow>
      <div className="s-setup-f">{submit}</div>
    </div>
  );
}

/** New run: build, personas, agents, length and instructions, filled in scene by scene. */
export function Setup() {
  return (
    <PageLayer show="open..length">
      <PageHeader page="aiBehavioural" />
      <RunTabs runs={4} />
      <SetupForm submit={<Button tone="primary">Submit</Button>} />
    </PageLayer>
  );
}

/** "Select a build", opened from the Select button on the form. */
export function BuildPicker() {
  return (
    <Layer show="build">
      <div className="backdrop" />
      <BuildDialog hlList="build" click="build" />
    </Layer>
  );
}

/** One agent while it is still playing: the latest frame, and what it saw, thought and did. */
export function LiveAgent() {
  return (
    <PageLayer show="live-agent">
      <Crumb back trail={`${r.name} ·`} name="New player · agent 1"><RunState state="progress" /></Crumb>
      <RunPageTabs on="videos" videos={r.sessions} clickReport="live-agent" />
      <AgentVideo persona={WHALE} build={r.build} length={r.length} live="4m so far" hlSaw="live-agent" />
    </PageLayer>
  );
}

/** Submit → Run history, where the new run plays: In progress, with Watch live. */
export function Submit() {
  return (
    <PageLayer show="submit">
      <SubmitSequence
        play="submit"
        form={<>
          <PageHeader page="aiBehavioural" />
          <RunTabs runs={4} />
          <SetupForm still submit={<ClickTarget><Button tone="primary">Submit</Button></ClickTarget>} />
        </>}
        history={<>
          <PageHeader page="aiBehavioural" />
          <RunTabs history runs={5} />
          <HistoryTable cols={['Run', 'Personas', 'Result', 'Date']} variant="wide">
            <RunRow state="progress" name={r.name} sub={`${r.sessions} sessions · ${r.length} · ${r.build}`} third={<PersonaChips mix={r.mix} />} date="Sep 18" running={<WatchLive click="submit" />} />
            <RunRow name="Store smoke check" sub="1 session · 10 min · v2.3.2" third={<PersonaChips mix={[[GENERIC, 1]]} />} result={{ findings: 2 }} date="Sep 8" />
            <RunRow name="Season 9 — full sweep" sub="32 sessions · 60 min · v2.3.1" third={<span><span className="s-mtag">Generic ×8</span><span className="s-mtag">+3</span></span>} result={{ findings: 14 }} date="Sep 4" />
            <RunRow name="Onboarding" sub="10 sessions · 15 min · v2.3.0" third={<PersonaChips mix={[[NEW_PLAYER, 10]]} />} result={{ findings: 6 }} date="Aug 30" />
          </HistoryTable>
        </>}
      />
    </PageLayer>
  );
}

const LIVE: [Persona, number, string?][] = [
  [NEW_PLAYER, 1], [NEW_PLAYER, 2], [NEW_PLAYER, 3], [NEW_PLAYER, 4],
  [NEW_PLAYER, 5, '24:10'], [WHALE, 1, '21:55'], [WHALE, 2, '19:30'], [WHALE, 3, '12:05'],
];

/** The run while it plays: the Videos tab, split into live and finished sessions. */
export function Live() {
  return (
    <PageLayer show="live">
      <Crumb back trail="AI behavioural test ·" name={r.name}><RunState state="progress" /><Button tone="dis" sm>Export</Button></Crumb>
      <RunPageTabs on="videos" videos={r.sessions} />
      <div className="s-vfilters">
        <Pill label="All" n={20} on />
        <Pill label="New player" n={12} />
        <Pill label="Whale" n={8} />
        <Pill label="Live" n={8} hl="live" />
        <Pill label="Finished" n={12} />
      </div>
      <div className="s-vpanel">
        <div className="s-vpanel-h">All sessions <small>20 of 20</small></div>
        <div className="s-sgrid">{LIVE.map(([p, n, t], i) => <SessionCard key={`${p.name}${n}`} persona={p} n={n} live={t} click={i === 0 ? 'live' : undefined} />)}</div>
      </div>
    </PageLayer>
  );
}

/** The finished run's report; scrolls down to a finding. */
export function Report() {
  const groups: [string, number][] = [['Stability & functional', 2], ['Usability friction', 4], ['Struggle', 2], ['Visual', 1]];
  return (
    <PageLayer show="report..finding">
      <Crumb back trail="AI behavioural test ·" name={r.name}><RunState state="complete" /><GhostButton download>Export</GhostButton></Crumb>
      <Scroller stops={[['finding', 640]]}>
        <RunPageTabs on="report" videos={r.sessions} />
        <div className="s-rep">
          <div className="s-rep-top">
            <div className="s-rep-row"><Label>AI behavioural report</Label><span className="s-rep-id">{r.id}</span></div>
            <h3>{r.name}</h3>
            <p>report generated {r.generated}</p>
            <ReportTiles tiles={AIB_TILES} hl="report" />
          </div>
          <div className="s-rep-body">
            <SectionHead n="01" title="Summary" />
            <p className="s-para" style={{ margin: '0 0 18px' }}>{AIB_SUMMARY}</p>
            <Label>Findings by category</Label>
            <CategoryTable rows={AIB_CATEGORIES} />
            <div className="s-rep-div" />
            <SectionHead n="02" title="Findings" />
            <Row style={{ gap: '8px', marginBottom: '16px' }}>
              {groups.map(([k, n]) => <span key={k} className="s-pill">{k} <span className="n">{n}</span></span>)}
            </Row>
            <div className="s-agent">
              <div className="s-band"><b>Stability &amp; functional defects</b><span>2 findings</span></div>
              <AgentFindingCard finding={AIB_FINDING} of={r.sessions} hlSplit="finding" hlEvidence="finding" clipClick="finding" />
            </div>
          </div>
        </div>
      </Scroller>
    </PageLayer>
  );
}

/** One agent's session, opened from an evidence clip. */
export function AgentPage() {
  return (
    <PageLayer show="video">
      <Crumb back trail={`${r.name} ·`} name="New player · agent 1"><RunState state="finished" /></Crumb>
      <AgentVideo persona={NEW_PLAYER} build={r.build} length={r.length} hlReasoning="video" />
      <div className="s-instr"><Label>Instructions to the players</Label><p>“{r.instructions}”</p></div>
    </PageLayer>
  );
}
