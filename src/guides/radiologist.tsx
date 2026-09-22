// Guide 04 · Radiologist: one search, from results to a single session in detail.
import { BOOYAH, EVENTS, PLACEHOLDERS, SESSION_DETAIL, SESSIONS, sessions } from '../data/intel';
import { Bullets, GuideLink, NextButton, RecapFlow } from '../shell/content';
import { defineGuide } from '../shell/guide';
import { Layer } from '../shell/scenes';
import { Icon } from '../ui/Icon';
import { IntelScreen, PageHead, Tile } from '../ui/intel/app';
import { AskBox, HomeLauncher, Query } from '../ui/intel/ask';
import { QuestionBubble, Step } from '../ui/intel/chat';
import { BoxTitle, ConceptBox, ConceptScene } from '../ui/intel/concept';
import { SessionDetail } from '../ui/intel/detail';
import { FiltersDialog } from '../ui/intel/filters';
import { IntelMap } from '../ui/intel/IntelMap';
import { EventRow, Instructions, PanelSection, Player, Profile, SidePanel, Stats, TileGrid, WhyThisVideo } from '../ui/intel/panel';
import { ResultsPage, SessionCard, SessionGallery, Tags } from '../ui/intel/sessions';

const PICKED = SESSIONS['2846'];

/** Numbered callouts for the session card diagram; `top` lines each number up with its part of the card. */
const ANATOMY = [
  { top: 158, title: 'Source', text: 'Live capture, manual upload, or a 6labs AI player' },
  { top: 337, title: 'Length', text: 'How long the recording runs' },
  { top: 383, title: 'Session and date', text: 'Its number, and when it was played' },
  { top: 422, title: 'Description', text: 'What happens in it, in two lines' },
  { top: 471, title: 'Tags', text: 'Blue ✦ tags are added by AI, like “menu hesitation”. Grey tags come with the upload or run.' },
];

function Screen() {
  const d = SESSION_DETAIL;
  return (
    <IntelScreen sidebar={{ active: { newQuery: 'home', radiologist: 'open..' }, highlight: { agents: 'home', radiologist: 'open' } }}>
      <Layer show="home" className="i-pg">
        <HomeLauncher agent="radiologist" switchHl="home" />
      </Layer>

      <Layer show="open" className="i-pg">
        <PageHead page="radiologist" />
        <AskBox hl="open"><Query>{PLACEHOLDERS.radiologist}</Query></AskBox>
        <SessionGallery>
          {sessions('2851', '2850', '2849').map(s => <SessionCard key={s.id} session={s} compact />)}
        </SessionGallery>
      </Layer>

      <ResultsPage show="search, filters..info" narrow="panel..info" query="guild help requests" found={6} searchHl="search">
        {sessions('2847', '2846', '2845', '2844', '2843', '2842').map(s => (
          <SessionCard key={s.id} session={s} pick={s === PICKED ? 'panel..info' : undefined} />
        ))}
      </ResultsPage>

      <FiltersDialog show="filters" placementHl="filters" />

      <SidePanel show="panel..info" session={PICKED} detailHl="info" scroll={{ y2: 'info' }}>
        <Player session={PICKED} markersHl="panel" />
        <PanelSection icon="sparkle" title="AI Summary" hl="summary">
          <p>{d.summary}</p>
          <Tags ai={PICKED.ai} tags={PICKED.tags} style={{ marginTop: '12px' }} />
        </PanelSection>
        <PanelSection icon="events" title="Detected Events" hl="info">
          {EVENTS.slice(0, 2).map(e => <EventRow key={e.type} event={e} />)}
          <div className="r-more">Show All Events ({EVENTS.length})</div>
        </PanelSection>
        <PanelSection icon="stats" title="Session Info" hl="info"><TileGrid tiles={d.info} /></PanelSection>
      </SidePanel>

      <Layer show="detail..playlist">
        <SessionDetail session={PICKED} eventsHl="detail" playlistHl="playlist" />
      </Layer>

      <ConceptScene show="oracle" title="Two agents, one flow">
        <ConceptBox className="link-o">
          <BoxTitle page="oracle">Oracle</BoxTitle>
          <QuestionBubble style={{ marginTop: '16px' }}>{BOOYAH.question}</QuestionBubble>
          <Step step={BOOYAH.steps[3]} accent="#7B4CFF" style={{ marginTop: '16px', paddingBottom: '0' }} />
        </ConceptBox>
        <div className="link-arrow">
          <svg width="80" height="24" viewBox="0 0 80 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M2 12h72m-9-9l9 9-9 9" /></svg>
          asks for the evidence
        </div>
        <ConceptBox className="link-r">
          <BoxTitle page="radiologist">Radiologist</BoxTitle>
          <div className="r-found" style={{ margin: '16px 0 0', fontSize: '15px' }}>Found 412 sessions</div>
          <div className="mini-vids"><i /><i /><i /></div>
          <Tags ai={['clutch win', 'items looted']} tags={['Ranked', 'Squad']} style={{ marginTop: '12px' }} />
        </ConceptBox>
        <div className="link-cap">
          <div><Tile page="radiologist" iconSize={20} /><span>Use <b>Radiologist</b> to see the exact moments.</span></div>
          <div><Tile page="oracle" iconSize={20} /><span>Use <b>Oracle</b> to get an answer across all of them.</span></div>
        </div>
      </ConceptScene>
    </IntelScreen>
  );
}

export default defineGuide({
  slug: 'radiologist',
  icons: true,
  hero: <Icon name="radio" size={36} />,
  lede: <>Radiologist finds exact moments in gameplay. Search for an action, object or event and it brings back every matching session, with a summary, the reason it matched and each detected event on the timeline. This guide follows one search from start to finish.</>,
  glance: {
    title: 'Intelligence at a glance',
    note: <>This guide covers the highlighted part. <GuideLink to="oracle">Oracle</GuideLink> and <GuideLink to="context">context</GuideLink> have their own guides.</>,
    map: <IntelMap highlight="radiologist" />,
  },

  steps: [
    { id: 'home', label: 'Home' },
    { id: 'open', label: 'Open Radiologist' },
    { id: 'search', label: 'Search' },
    { id: 'filters', label: 'Filters' },
    { id: 'panel', label: 'Side panel' },
    { id: 'detail', label: 'Full detail' },
    { id: 'oracle', label: 'With Oracle' },
  ],

  scenes: [
    {
      id: 'home', step: 'home',
      title: 'Start from the home screen',
      body: <>
        <p>Every agent starts from the same box. The switch above it picks which one answers — here, <b>Radiologist</b>.</p>
        <p>Radiologist examines gameplay moment by moment, with a video behind every result.</p>
      </>,
    },
    {
      id: 'open', step: 'open',
      title: 'Radiologist finds the moment',
      body: <>
        <p>Its page opens with the search box and, below it, the sessions 6labs has most recently taken in.</p>
        <p>You can also open it straight from <b>Core agents</b> in the sidebar.</p>
      </>,
    },
    {
      id: 'search', step: 'search',
      title: 'Search for what happened',
      body: <>
        <p>Type an action, object or event in plain words, like <b>“guild help requests”</b>, and press the arrow.</p>
        <p>Radiologist brings back every session where it happens. Here it <b>found 6 sessions</b>.</p>
      </>,
    },
    {
      id: 'filters', step: 'filters',
      title: 'Narrow the results with filters',
      body: <>
        <p><b>Filters</b> sorts sessions by what happened in them, in seven groups:</p>
        <Bullets items={[
          <><b>Source &amp; tags</b> · <b>Match context</b>: mode, map, length, placement</>,
          <><b>Combat</b> · <b>Monetization</b>: kills, damage, shop visits, purchases</>,
          <><b>Player behaviour</b> · <b>Team dynamics</b> · <b>Frustration markers</b>: play style, revives, rage quits</>,
        ]} />
        <p>Here: only matches the player <b>won</b>.</p>
      </>,
    },
    {
      id: 'panel', step: 'panel',
      title: 'Open a session beside the results',
      body: <>
        <p>Click a card and it opens in a <b>side panel</b>, so the other results stay in view.</p>
        <p>The coloured dots on the video's timeline are <b>detected events</b>: moments Radiologist spotted in the gameplay.</p>
      </>,
    },
    {
      id: 'summary', step: 'panel', focus: [960, 400, 1.15],
      title: 'What the session was about',
      body: <>
        <p><b>AI summary</b> is the session in a sentence or two, written after watching it, with the tags it earned.</p>
        <p>It is the fastest way to tell whether a result is the one you wanted.</p>
      </>,
    },
    {
      id: 'info', step: 'panel', focus: [960, 330, 1.15],
      title: 'Every moment it found',
      body: <>
        <p><b>Detected events</b> lists each moment Radiologist spotted, with its type and time — <b>Match start · 0:21</b>. Click one and the video jumps there.</p>
        <p>Under it, <b>Session info</b>: where the session came from, how long it ran, and on what.</p>
      </>,
    },
    {
      id: 'detail', step: 'detail',
      title: 'View the session in detail',
      body: <>
        <p><b>View in detail</b> opens the session full-page: a bigger player, and every detected event listed under it.</p>
        <p>Click an event to jump the video straight to that moment.</p>
      </>,
    },
    {
      id: 'playlist', step: 'detail', focus: [1030, 400, 1.25],
      title: "The player's other sessions",
      body: <>
        <p><b>User's playlist</b> on the right lists everything else this player recorded, grouped by play session with its date and length.</p>
        <p>Useful to see what happened before and after the moment you found.</p>
      </>,
    },
    {
      id: 'oracle', step: 'oracle',
      title: 'Radiologist also works for Oracle',
      body: <>
        <p>When you ask Oracle a question, it consults Radiologist to find the sessions it needs.</p>
        <Bullets items={[
          <>Use <b>Radiologist</b> to see the exact moments</>,
          <>Use <b>Oracle</b> to get an answer across all of them</>,
        ]} />
        <NextButton to="context" />
      </>,
    },
  ],

  Screen,

  recap: {
    title: 'Search a moment. See every session where it happens.',
    head: <RecapFlow items={[['Home', 'Sidebar'], 'Search', { strong: 'Matching sessions' }, ['Side panel', 'Full detail']]} />,
    quotes: [
      'Search your gameplay the way you search the web.',
      'Every session is broken into events you can jump straight to.',
      'See why each video matched before you press play.',
    ],
    faqs: [
      ['What can we search for?', 'Actions, objects and events in the game, in plain words: a guild help request, a shop visit, a repeated death.'],
      ['Where do the sessions come from?', "The same sources as Oracle: BlueStacks, YouTube, the 6labs SDK or the Gameplay Library. Each card shows whether it's a live capture, a manual upload or an AI player run."],
      ['Do we have to watch whole videos?', 'No. Each session has a summary and a list of detected events. Click an event to jump straight to that moment.'],
      ['What are the tags with a ✦?', 'Tags added by AI after watching the video, like “menu hesitation” or “repeated death”. Grey tags come with the upload or run.'],
      ["What's an AI player session?", 'A session played by a 6labs AI player instead of a person. It shows the instructions the AI player was given.'],
      ['How far back do the numbers go?', 'The statistics in the side panel cover the last 30 days.'],
    ],
    next: { to: 'context', kicker: 'Next guide', text: 'Documents & Connectors — give agents your context' },
  },
});
