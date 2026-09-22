// Guide 02 · User Test: one run, from picking videos to the report and follow-up questions.
import { Bullets, GuideLink, TextLink } from '../../shell/content';
import { defineGuide } from '../../shell/guide';
import { TestingScreen } from '../../ui/testing/app';
import { TIcon } from '../../ui/testing/icons';
import { RecapMap } from './maps';
import { AskMode, Results } from './results';
import { ExportPage, LibraryPage, NewRunPage, Picker, SubmitSequence } from './screens';
import { TestingMap } from '../../ui/testing/TestingMap';

function Screen() {
  return (
    <>
      <TestingScreen sidebar={{ active: { library: 'videos', userTest: 'open..' } }}>
        <LibraryPage />
        <NewRunPage />
        <Picker />
        <SubmitSequence />
        <ExportPage />
      </TestingScreen>
      <Results />
      <AskMode />
    </>
  );
}

export default defineGuide({
  slug: 'user-test',
  fonts: 'light',
  hero: <TIcon name="userTest" size={34} width={1.7} />,
  lede: <>User Test is an agent that watches recorded playtests for you and reports where the game breaks and where players struggle — with a clip for every finding. This guide follows one run from start to finish.</>,
  glance: {
    title: 'The whole flow at a glance',
    note: <>Getting videos in is covered in <GuideLink to="gameplay-library">Guide 01</GuideLink>. This guide covers the highlighted part.</>,
    map: <TestingMap highlight="userTest" />,
  },

  steps: [
    { id: 'videos', label: 'Videos ready' },
    { id: 'open', label: 'Open User Test' },
    { id: 'mode', label: 'Choose mode' },
    { id: 'pick', label: 'Pick videos' },
    { id: 'context', label: 'Game context' },
    { id: 'analyse', label: 'Agent analyses' },
    { id: 'results', label: 'What you get' },
    { id: 'summary', label: 'Summary' },
    { id: 'full', label: 'Full report' },
    { id: 'ask', label: 'Ask about report' },
    { id: 'askmode', label: 'Just ask' },
    { id: 'export', label: 'Export' },
  ],

  scenes: [
    {
      id: 'videos', step: 'videos', chapter: 'Before you start',
      title: 'The videos are already in the library',
      body: <>
        <p>User Test analyses recordings from the <b>Gameplay Library</b> — whether they came from the Gameplay Recorder App, a browser upload or the CLI.</p>
        <p>In this example, 10 playtest sessions tagged <b>Build V2.2</b> are ready.</p>
        <TextLink to="gameplay-library">How videos get into the library →</TextLink>
      </>,
    },
    {
      id: 'open', step: 'open',
      title: 'Start a new run',
      body: <>
        <p>Open <b>User test</b> from the Testing menu. A <b>run</b> is one analysis of a set of videos.</p>
        <p>It's set up on one panel: choose a mode, add videos and, if you like, game context.</p>
      </>,
    },
    {
      id: 'mode-report', step: 'mode', focus: [600, 330, 1.2],
      title: 'Mode 1: Generate report',
      body: <>
        <p>Finds every problem across the sessions — where the game breaks and where players struggle — and builds a report with clips.</p>
        <p>Best for reviewing a whole playtest round.</p>
      </>,
    },
    {
      id: 'mode-ask', step: 'mode', focus: [660, 420, 1.1],
      title: 'Mode 2: Ask questions',
      body: <>
        <p>Skips the report and answers one specific question, like <b>“Which testers quit before finishing onboarding?”</b></p>
        <p>You get answers only — no report. This guide follows <b>Generate report</b>.</p>
      </>,
    },
    {
      id: 'add', step: 'pick', focus: [660, 430, 1.1],
      title: 'Back on Generate report, add the videos',
      body: <>
        <p>Switch back to <b>Generate report</b> and click <b>+ Add videos</b> — the Gameplay Library opens right inside User Test.</p>
      </>,
    },
    {
      id: 'pick', step: 'pick', focus: [706, 380, 1.08],
      title: 'Pick the sessions to analyse',
      body: <>
        <p>Tap a tag to select every video with it — here, all 10 <b>Build V2.2</b> sessions. Click <b>Use 10 videos</b>, and the run name fills in from the tag and date.</p>
      </>,
    },
    {
      id: 'context', step: 'context', chapter: 'Game context · optional', focus: [560, 380, 1.2],
      title: 'Add game context',
      body: <>
        <p>Click <b>+ Add game context</b> and pick a design doc you've used before, or <b>Upload new</b> — PDF, DOCX or image.</p>
        <p>Findings then point to the exact game screen. Choose <b>None</b> and the run still works; findings just aren't tied to screens.</p>
      </>,
    },
    {
      id: 'submit', step: 'analyse',
      title: 'Submit — the agent gets to work',
      body: <>
        <p>Click <b>Generate report</b>. You're taken to <b>Run history</b>, where the run sits on top marked <b>In progress</b> while the User Test agent watches all 10 videos.</p>
        <p>When it's done, the row shows the number of findings and a <b>View report</b> button.</p>
      </>,
    },
    {
      id: 'results', step: 'results',
      title: 'A report gives you three things',
      body: <>
        <Bullets items={[
          <><b>Summary</b> — the key numbers and top problems, readable in a minute</>,
          <><b>Full report</b> — every finding with clips and a fix</>,
          <><b>Ask about the report</b> — follow-up questions, answered right below it</>,
        ]} />
        <p>With the <b>Ask questions</b> mode instead, you get only the answers — no report.</p>
      </>,
    },
    {
      id: 'summary', step: 'summary', chapter: '1 of 3 · Summary',
      title: 'Read the result in a minute',
      body: <>
        <p>When the run is ready, the summary opens with:</p>
        <Bullets items={[
          <><b>Four numbers</b> — sessions, footage, <b>bugs</b> (the game breaks) and <b>friction</b> (players struggle)</>,
          <><b>A short takeaway</b> — the biggest problem in two sentences</>,
          <><b>Findings by category</b> — how many findings of each type, how many sessions they hit, and how many block players</>,
        ]} />
      </>,
    },
    {
      id: 'top-problems', step: 'summary', chapter: '1 of 3 · Summary',
      title: 'The top problems, ranked',
      body: <>
        <p>Each top finding says what happened, how many sessions hit it and how many clips show it.</p>
        <Bullets items={[
          <><b>Blocking</b> — players can't move on</>,
          <><b>Disruptive</b> — slows players down</>,
          <><b>Cosmetic</b> — looks wrong, play goes on</>,
        ]} />
      </>,
    },
    {
      id: 'full-open', step: 'full', chapter: '2 of 3 · Full report',
      title: 'Open the full report',
      body: <p>The summary shows only the top findings. At the end of it, click <b>Open the full report</b> to see every finding in detail.</p>,
    },
    {
      id: 'full-report', step: 'full', chapter: '2 of 3 · Full report',
      title: 'The full report, top to bottom',
      body: <Bullets items={[
        <><b>Report header</b> — name, videos, date and the four numbers</>,
        <><b>01 Summary</b> — the takeaway and findings by category</>,
        <><b>02 Findings</b> — every finding, grouped by category, with filters</>,
      ]} />,
    },
    {
      id: 'findings', step: 'full', chapter: '2 of 3 · Full report',
      title: 'Every finding, with proof',
      body: <p>Each finding has what happened, how many sessions hit it, the <b>evidence clips</b>, and a <b>recommendation</b> on what to fix.</p>,
    },
    {
      id: 'clip', step: 'full', chapter: '2 of 3 · Full report',
      title: 'Watch the exact moment',
      body: <>
        <p>Click a clip number to open the player at that moment: which tester, when, and what they did.</p>
        <p>Anyone can check a finding in seconds instead of watching hours of footage.</p>
      </>,
    },
    {
      id: 'ask', step: 'ask', chapter: '3 of 3 · Ask about the report',
      title: 'Got a question? Ask it here',
      body: <>
        <p>At the bottom of the summary there's a question box. Type anything about these 10 sessions and press send.</p>
        <p>This is the second way to ask — on top of a report. The <b>Ask questions</b> mode at the start asks without one.</p>
      </>,
    },
    {
      id: 'answer', step: 'ask', chapter: '3 of 3 · Ask about the report',
      title: 'The answer appears below the report',
      body: <>
        <p>The report summary stays above. The question and its answer are added underneath — a short summary, the details and links to clips.</p>
        <p>Keep asking follow-ups; the conversation grows down the same page.</p>
      </>,
    },
    {
      id: 'askmode', step: 'askmode', chapter: 'Ask questions mode',
      title: 'Or skip the report and just ask',
      body: <>
        <p>Choose <b>Ask questions</b> at the start, add videos, type your question and submit.</p>
        <p>The answer opens on its own page — a summary, details and clips — with no report above it.</p>
      </>,
    },
    {
      id: 'export', step: 'export', focus: [900, 200, 1.15],
      title: 'Export and share',
      body: <>
        <p>Export the summary, the full report or a question thread as a <b>PDF</b> to forward to the team.</p>
        <TextLink to="#recap">See the recap ↓</TextLink>
      </>,
    },
  ],

  Screen,

  recap: {
    title: 'Two ways to use User Test: get a report, or just ask.',
    head: <RecapMap />,
    quotes: [
      'See where players struggle without watching hours of footage.',
      'Every problem comes with the clip that shows it.',
      'Know what to fix before the next build.',
    ],
    faqs: [
      ['Do we have to watch the videos?', 'No. The report tells you what went wrong, and every finding links the exact clips if you want to check.'],
      ['Do we need an SDK or code changes?', 'No. It works from gameplay recordings alone.'],
      ["What if we don't have a design doc?", "It still runs. Findings just won't be tied to specific game screens."],
      ['Can we ask one question instead of a full report?', 'Yes. Choose Ask questions for a direct answer with clips. It can be turned into a full report later without re-analysing.'],
      ['Can we compare with the last build?', 'Not yet — comparing runs is planned for a later version.'],
    ],
    next: { to: 'functional-test', kicker: 'Next guide', text: 'Functional Test — check each test case against the videos' },
  },
});
