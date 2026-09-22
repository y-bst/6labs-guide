// Guide 04 · Radiologist: one search, from results to a single session in detail.
import { EVENTS, PLACEHOLDERS, SESSION_DETAIL, SESSIONS, sessions } from '../data/intel';
import { Bullets, GuideLink, RecapFlow } from '../shell/content';
import { defineGuide } from '../shell/guide';
import { Layer } from '../shell/scenes';
import { Icon } from '../ui/Icon';
import { IntelScreen, PageHead } from '../ui/intel/app';
import { AskBox, HomeLauncher, Query } from '../ui/intel/ask';
import { SessionDetail } from '../ui/intel/detail';
import { FiltersDialog } from '../ui/intel/filters';
import { IntelMap } from '../ui/intel/IntelMap';
import { EventRow, Instructions, PanelSection, Player, Profile, SidePanel, Stats, TileGrid, WhyThisVideo } from '../ui/intel/panel';
import { ResultsPage, SessionCard, SessionGallery, Tags } from '../ui/intel/sessions';

const PICKED = SESSIONS['2846'];

/** Numbered callouts for the session card diagram; `top` lines each number up with its part of the card. */
const ANATOMY = [
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
        <HomeLauncher agent="radiologist" switchHl="home" below={
          <SessionGallery className="r-onhome">
            {sessions('2847', '2846', '2845', '2844', '2843', '2842').map(s => <SessionCard key={s.id} session={s} />)}
          </SessionGallery>
        } />
      </Layer>

      <Layer show="open" className="i-pg">
        <PageHead page="radiologist" />
        <AskBox hl="open"><Query>{PLACEHOLDERS.radiologist}</Query></AskBox>
        <SessionGallery>
          {sessions('2847', '2846', '2845', '2844', '2843', '2842').map(s => <SessionCard key={s.id} session={s} />)}
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
        <PanelSection icon="sparkle" title="AI Summary">
          <p>{d.summary}</p>
          <Tags ai={PICKED.ai} tags={PICKED.tags} style={{ marginTop: '12px' }} />
        </PanelSection>
        <PanelSection icon="events" title="Detected Events">
          {EVENTS.slice(0, 2).map(e => <EventRow key={e.type} event={e} />)}
          <div className="r-more">Show All Events ({EVENTS.length})</div>
        </PanelSection>
        <PanelSection icon="stats" title="Session Info"><TileGrid tiles={d.info} /></PanelSection>
      </SidePanel>

      <Layer show="detail..playlist">
        <SessionDetail session={PICKED} />
      </Layer>

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
        <p>Under it, <b>Session info</b>: how long the session ran, where it was played and on what.</p>
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
      // No focus: zooming the camera onto the playlist cut the app's own top bar and sliced the
      // player in half, which read as a broken screen rather than a close-up.
      id: 'playlist', step: 'detail',
      title: "The player's other sessions",
      body: <>
        <p><b>User's playlist</b> on the right lists everything else this player recorded, grouped by play session with its date and length.</p>
        <p>Useful to see what happened before and after the moment you found.</p>
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
      ['Where do the sessions come from?', "The same sources as Oracle: BlueStacks, YouTube, the 6labs SDK or the Gameplay Library."],
      ['Do we have to watch whole videos?', 'No. Each session has a summary and a list of detected events. Click an event to jump straight to that moment.'],
      ['What are the tags with a ✦?', 'Tags added by AI after watching the video, like “menu hesitation” or “repeated death”. Grey tags come with the upload or run.'],
      ["What's an AI player session?", 'A session played by a 6labs AI player instead of a person. It shows the instructions the AI player was given.'],
      ['How far back do the numbers go?', 'The statistics in the side panel cover the last 30 days.'],
    ],
    next: { to: 'context', kicker: 'Next guide', text: 'Documents & Connectors — give agents your context' },
  },
});
