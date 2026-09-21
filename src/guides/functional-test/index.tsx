// Guide 03 · Functional Test: check the test cases a team already ran against the recordings.
import { FT_RUN, VERIFY } from '../../data/verify';
import { Bullets, Facts, GuideLink, RecapFlow, TextLink } from '../../shell/content';
import { defineGuide } from '../../shell/guide';
import { TestingScreen } from '../../ui/testing/app';
import { TIcon } from '../../ui/testing/icons';
import { TestingMap } from '../../ui/testing/TestingMap';
import { CaseLayer, NewRun, Picker, Report, Submit } from './screens';

function Screen() {
  return (
    <>
      <TestingScreen sidebar={{ active: { functional: true } }}>
        <NewRun />
        <Picker />
        <Submit />
        <Report />
      </TestingScreen>
      <CaseLayer />
    </>
  );
}

export default defineGuide({
  slug: 'functional-test',
  fonts: 'light',
  hero: <TIcon name="flaskDoc" size={38} width={1.5} />,
  lede: <>Functional Test checks the test cases your team already ran against the recordings of those sessions. Upload the case sheet, pick the videos, and 6labs marks every case passed, failed, need review or not verified, with the clip that shows it.</>,
  glance: {
    title: 'Testing at a glance',
    note: <>This guide covers the highlighted part. The recordings come from the <GuideLink to="gameplay-library">Gameplay Library</GuideLink>.</>,
    map: <TestingMap highlight="functional" />,
  },

  steps: [
    { id: 'open', label: 'Open Functional Test' },
    { id: 'videos', label: 'Recordings' },
    { id: 'cases', label: 'Test cases' },
    { id: 'name', label: 'Name the run' },
    { id: 'submit', label: 'Verify' },
    { id: 'result', label: 'Result' },
    { id: 'coverage', label: 'Coverage' },
    { id: 'list', label: 'Case list' },
    { id: 'case', label: 'Case detail' },
    { id: 'export', label: 'Export' },
  ],

  scenes: [
    {
      id: 'open', step: 'open',
      title: 'Check the tests your team already ran',
      body: <>
        <p>Your testers played the build following a list of <b>test cases</b>, and their sessions were recorded. Functional Test checks each case against that footage.</p>
        <p>It needs two things: the <b>sessions</b> and the <b>test case sheet</b>. Nothing is played again.</p>
      </>,
    },
    {
      id: 'videos', step: 'videos',
      title: 'Pick the sessions',
      body: <>
        <p>Click <b>Select the sessions</b> and the Gameplay Library opens inside Functional Test, the same picker User Test uses.</p>
        <p>Tap a tag to select the whole batch: here, all {FT_RUN.videos} <b>{FT_RUN.tag}</b> sessions. Then click <b>Use {FT_RUN.videos} videos</b>.</p>
      </>,
    },
    {
      id: 'cases', step: 'cases',
      title: 'Add the test case sheet',
      body: <>
        <p>Upload your test cases as one spreadsheet, <b>one row per case</b>.</p>
        <p>Each case needs a <b>Precondition</b>, an <b>Expected result</b> and <b>Steps</b>. Without them 6labs can't check the case and marks it <b>not verified</b>. <b>See a sample sheet</b> downloads a template.</p>
        <Facts items={['CSV or XLSX', 'ID', 'Test case', 'Category', 'Precondition', 'Expected result', 'Steps']} />
      </>,
    },
    {
      id: 'name', step: 'name',
      title: 'Name it, then verify',
      body: <>
        <p>The run name is <b>optional</b>. Leave it empty and 6labs names the run from the video tag and the file name.</p>
        <p><b>Verify test cases</b> stays greyed out until both the sessions and the sheet are in.</p>
      </>,
    },
    {
      id: 'submit', step: 'submit',
      title: '6labs checks every case',
      body: <>
        <p>Click <b>Verify test cases</b>. You're taken to <b>Run history</b>, where the new run sits on top as <b>In progress</b> while 6labs reads the footage.</p>
        <p>When it's done, the row shows four counts, <b>passed</b>, <b>failed</b>, <b>need review</b> and <b>not verified</b>, and a <b>View report</b> button.</p>
      </>,
    },
    {
      id: 'result', step: 'result', focus: [717, 300, 1.28],
      title: 'Read the result',
      body: <>
        <p><b>{VERIFY.passRate}%</b> of the {VERIFY.ran} cases that ran passed. Each case gets one of four outcomes:</p>
        <Bullets items={[
          <><b>Pass</b> — the footage shows the expected result</>,
          <><b>Failed</b> — the footage shows it break</>,
          <><b>Need review</b> — there is footage, but it doesn't settle the case</>,
          <><b>Not verified</b> — no video covers the case, or the sheet lacks its details. It isn't a failure.</>,
        ]} />
      </>,
    },
    {
      id: 'coverage', step: 'coverage', focus: [717, 300, 1.28],
      title: 'See how much of the sheet was reached',
      body: <>
        <p>Coverage is the share of the sheet's cases that appear in the sessions: <b>{VERIFY.coverage}%</b> of {VERIFY.inFile}, across {VERIFY.recordings} sessions.</p>
        <p>The other <b>{VERIFY.unreached}</b> cases never appeared in this footage. To check them, record sessions that play those parts of the game.</p>
      </>,
    },
    {
      id: 'list', step: 'list', focus: [717, 470, 1.28],
      title: 'Find any case',
      body: <>
        <p>Under the scores is every case that ran, one row each: <b>your own ID</b>, the case, its category, the <b>reason</b> for the outcome and the status.</p>
        <p>Search by ID, name, category or reason, or filter by category or status, for example only <b>Failed</b>.</p>
      </>,
    },
    {
      id: 'case', step: 'case',
      title: 'Open a case to see the proof',
      body: <>
        <Bullets items={[
          <><b>Left</b> — every case, grouped by category, with a dot for its outcome</>,
          <><b>Middle</b> — the video, cut to this case, and what your sheet specified</>,
          <><b>Right</b> — what was observed, the outcome, and your steps</>,
        ]} />
        <p>Previous and Next move through the list without closing it.</p>
      </>,
    },
    {
      id: 'steps', step: 'case',
      title: 'Jump to any step',
      body: <>
        <p>Each step from your sheet shows the moment it happened. Click a step and the video jumps there.</p>
        <p>Anyone can check a verdict in seconds, without watching the whole session.</p>
      </>,
    },
    {
      id: 'export', step: 'export', focus: [717, 250, 1.28],
      title: 'Export as CSV',
      body: <>
        <p><b>Export CSV</b> gives one row per case in your sheet, with your IDs, the status, the reason and what was observed.</p>
        <p>Cases the sessions never reached are listed as <b>not verified</b>.</p>
        <TextLink to="#recap">See the recap ↓</TextLink>
      </>,
    },
  ],

  Screen,

  recap: {
    title: 'Your test cases, checked against the footage.',
    head: <RecapFlow items={['Testers play & record', 'Gameplay Library', { strong: 'Recordings + test case sheet' }, '6labs checks every case', ['Result', 'Coverage', 'Case detail'], 'Export CSV']} />,
    quotes: [
      'Upload the tests you already ran and see which ones passed, with the clip that proves it.',
      'No re-testing: 6labs reads the footage you already have.',
      'Every failed case links to the moment it broke.',
    ],
    faqs: [
      ['Do we have to run the tests again?', 'No. 6labs checks the sessions you already have. Nothing is played again.'],
      ['What format do the test cases need?', 'A CSV or XLSX file, one row per case. Each case needs a Precondition, an Expected result and Steps; without them it can only be marked not verified. A sample sheet is on the page.'],
      ['How is this different from User Test?', 'User Test finds problems in free play. Functional Test checks a list of cases you wrote, one by one.'],
      ['What does "not verified" mean?', 'No video covers the case, or the sheet is missing its details. It is not a failure, and it is counted apart from failures.'],
      ['Can we change a verdict?', 'No, the report is view only. Need review marks the cases a person should look at.'],
    ],
    next: { to: 'ai-behavioural-test', kicker: 'Next guide', text: 'AI Behavioural Test — AI players play your build' },
  },
});
