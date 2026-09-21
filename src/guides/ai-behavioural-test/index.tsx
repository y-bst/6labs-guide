// Guide 04 · AI Behavioural Test: AI players play a build as personas; findings split by persona.
import { AIB_FINDING, AIB_RUN } from '../../data/behavioural';
import { Bullets, Facts, GuideLink, RecapFlow, TextLink } from '../../shell/content';
import { defineGuide } from '../../shell/guide';
import { TestingScreen } from '../../ui/testing/app';
import { TIcon } from '../../ui/testing/icons';
import { TestingMap } from '../../ui/testing/TestingMap';
import { AgentPage, Live, Report, Setup, Submit } from './screens';

function Screen() {
  return (
    <TestingScreen sidebar={{ active: { aiBehavioural: true } }}>
      <Setup />
      <Submit />
      <Live />
      <Report />
      <AgentPage />
    </TestingScreen>
  );
}

const [[np, npHit, npOf], [wh, whHit, whOf]] = AIB_FINDING.split;

export default defineGuide({
  slug: 'ai-behavioural-test',
  fonts: 'light',
  hero: <TIcon name="aiPerson" size={38} width={1.5} />,
  lede: <>AI Behavioural Test sends 6labs AI players into your build as the kinds of players you choose, like new players or big spenders. They play it freely, and 6labs reports where the game blocked, confused or lost them, with the video behind every finding.</>,
  glance: {
    title: 'Testing at a glance',
    note: <>This guide covers the highlighted part. It reads like a <GuideLink to="user-test">User Test</GuideLink> report, with AI players instead of testers.</>,
    map: <TestingMap highlight="aiBehavioural" />,
  },

  steps: [
    { id: 'open', label: 'Open AI Behavioural Test' },
    { id: 'build', label: 'Build' },
    { id: 'personas', label: 'Personas' },
    { id: 'agents', label: 'Agents' },
    { id: 'length', label: 'Length & instructions' },
    { id: 'submit', label: 'Submit' },
    { id: 'live', label: 'Watch live' },
    { id: 'report', label: 'Report' },
    { id: 'finding', label: 'Findings' },
    { id: 'video', label: 'Agent video' },
  ],

  scenes: [
    {
      id: 'open', step: 'open',
      title: 'AI players play your build',
      body: <>
        <p>Pick a build and the kinds of players you want. 6labs <b>AI players</b> install the build and play it the way those players would.</p>
        <p>Then 6labs reports where the game blocked, confused or lost them. It's all set up on one form.</p>
      </>,
    },
    {
      id: 'build', step: 'build', focus: [760, 330, 1.25],
      title: 'Choose the build',
      body: <>
        <p>The newest uploaded build is picked for you: here, <b>{AIB_RUN.build}</b>.</p>
        <p>Click <b>Change</b> to pick another, or upload a new APK.</p>
        <Facts items={['Android APK', 'Up to 500 MB']} />
      </>,
    },
    {
      id: 'personas', step: 'personas',
      title: 'Pick the personas',
      body: <>
        <p>A <b>persona</b> is a kind of player: a new player in their first days, a whale who spends, a lapsed player coming back, and more. <b>Generic</b> plays the build as-is.</p>
        <p>Personas come from your game's player model and get better with every human session added. Pick one or more; here, <b>New player</b> and <b>Whale</b>.</p>
      </>,
    },
    {
      id: 'agents', step: 'agents', focus: [760, 400, 1.25],
      title: 'Choose how many of each',
      body: <>
        <p>Each AI player is called an <b>agent</b>, and each agent plays one session. Set how many agents play as each persona.</p>
        <p>Here, <b>12 new players</b> and <b>8 whales</b>: 20 agents in total.</p>
      </>,
    },
    {
      id: 'length', step: 'length',
      title: 'Set the length and add instructions',
      body: <>
        <p>Pick how long each agent plays: <b>15, 30 or 60 minutes</b>, or a custom length.</p>
        <p><b>Instructions</b> are optional: one note for every agent, like what to focus on or what to try. The run name is optional too.</p>
      </>,
    },
    {
      id: 'submit', step: 'submit',
      title: 'Submit, and the agents start playing',
      body: <>
        <p>Click <b>Submit</b>. The run appears on top of <b>Run history</b> as <b>In progress</b>, with its personas.</p>
        <p>You don't have to wait for the report: click <b>Watch live</b>.</p>
      </>,
    },
    {
      id: 'live', step: 'live',
      title: 'Watch the sessions live',
      body: <>
        <p>While the run plays, the <b>Videos</b> tab shows every session, split into <b>Live</b> and <b>Finished</b>. Open a live one to watch the agent play.</p>
        <p>The report is written once the last session finishes, so there are no partial results.</p>
      </>,
    },
    {
      id: 'report', step: 'report',
      title: 'Read the report',
      body: <>
        <p>Five numbers up top: <b>personas</b>, <b>sessions played</b>, <b>footage reviewed</b>, <b>bugs</b> (the game breaks) and <b>friction points</b> (players struggle).</p>
        <p>Then a short summary and the findings by category, the same shape as a <GuideLink to="user-test">User Test</GuideLink> report.</p>
      </>,
    },
    {
      id: 'finding', step: 'finding',
      title: 'Every finding, split by persona',
      body: <>
        <p>This one hit <b>{AIB_FINDING.agents} of {AIB_RUN.sessions}</b> agents. The bars show who: {npHit} of {npOf} {np.name.toLowerCase()}s and {whHit} of {whOf} {wh.name.toLowerCase()}s.</p>
        <p>Each numbered clip opens that agent's video at the moment; its colour shows the persona. A <b>recommendation</b> says what to fix.</p>
      </>,
    },
    {
      id: 'video', step: 'video',
      title: 'See what the agent saw, thought and did',
      body: <>
        <Bullets items={[
          <><b>Saw</b> — what was on the screen</>,
          <><b>Reasoning</b> — the agent's own words</>,
          <><b>Did</b> — the action it took, and what happened next</>,
        ]} />
        <p>Step through the session screen by screen. The run's instructions are quoted below, so you can read the reasoning against them.</p>
        <TextLink to="#recap">See the recap ↓</TextLink>
      </>,
    },
  ],

  Screen,

  recap: {
    title: 'AI players play your build and show you where it loses players.',
    head: <RecapFlow items={['Pick a build', 'Personas + agents', 'Length & instructions', { strong: 'AI players play' }, ['Watch live', 'Report', 'Agent videos']]} />,
    quotes: [
      'Choose who plays: new players, whales, lapsed players and more.',
      'See where your build blocks, confuses or loses each kind of player.',
      "Every finding comes with the agent's video and its reasoning.",
    ],
    faqs: [
      ['What do we need?', 'An Android build (APK, up to 500 MB). Then pick personas, how many agents of each, and how long they play.'],
      ['Where do personas come from?', "Your game's player model. They improve with every human session added."],
      ['Can we watch while it runs?', 'Yes. Sessions can be watched live from the Videos tab. The report comes when the last session finishes.'],
      ['What do Blocking, Disruptive and Cosmetic mean?', "Blocking: players can't go on with the on-screen controls. Disruptive: it costs time or makes players quit, but they can recover. Cosmetic: it looks wrong, play goes on."],
      ['Can we export the report?', 'Yes, as a PDF once the run is complete.'],
      ['Does it work on iOS?', 'Not today. Builds are Android APKs.'],
    ],
    next: { to: 'ai-functional-test', kicker: 'Next guide', text: 'AI Functional Test — AI players run your test cases' },
  },
});
