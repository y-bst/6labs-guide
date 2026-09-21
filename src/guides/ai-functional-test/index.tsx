// Guide 05 · AI Functional Test: AI players run a studio's test cases on a build.
import { AIF_RUN, VERIFY } from '../../data/verify';
import { Bullets, Facts, GuideLink, RecapFlow, TextLink } from '../../shell/content';
import { defineGuide } from '../../shell/guide';
import { TestingScreen } from '../../ui/testing/app';
import { TIcon } from '../../ui/testing/icons';
import { TestingMap } from '../../ui/testing/TestingMap';
import { BuildPicker, CaseLayer, NewRun, Report, Submit } from './screens';

function Screen() {
  return (
    <>
      <TestingScreen sidebar={{ active: { aiFunctional: true } }}>
        <NewRun />
        <BuildPicker />
        <Submit />
        <Report />
      </TestingScreen>
      <CaseLayer />
    </>
  );
}

export default defineGuide({
  slug: 'ai-functional-test',
  fonts: 'light',
  hero: <TIcon name="aiDoc" size={38} width={1.5} />,
  lede: <>AI Functional Test hands your test cases to 6labs AI players. They install your build, play through every case, and report what passed and what failed, with the video of each attempt.</>,
  glance: {
    title: 'Testing at a glance',
    note: <>This guide covers the highlighted part. The report works like <GuideLink to="functional-test">Functional Test</GuideLink>'s.</>,
    map: <TestingMap highlight="aiFunctional" />,
  },

  steps: [
    { id: 'open', label: 'Open AI Functional Test' },
    { id: 'build', label: 'Build' },
    { id: 'cases', label: 'Test cases' },
    { id: 'details', label: 'Name & instructions' },
    { id: 'submit', label: 'Run test' },
    { id: 'report', label: 'Result' },
    { id: 'coverage', label: 'Coverage' },
    { id: 'list', label: 'Case list' },
    { id: 'case', label: 'Case detail' },
    { id: 'export', label: 'Export' },
  ],

  scenes: [
    {
      id: 'open', step: 'open',
      title: 'AI players run your test cases',
      body: <>
        <p>You give it two things: a <b>build</b> of your game and your <b>test case sheet</b>. 6labs AI players install the build and play through each case.</p>
        <p>No testers and no recordings needed: the AI players make the recordings themselves.</p>
      </>,
    },
    {
      id: 'build', step: 'build',
      title: 'Choose the build',
      body: <>
        <p>Click <b>Choose a build</b>. Drop in a new APK, or pick one you uploaded before; the newest is at the top.</p>
        <p>Here, <b>{AIF_RUN.build.version}</b>. The AI players install exactly this build.</p>
        <Facts items={['Android APK', 'Up to 500 MB']} />
      </>,
    },
    {
      id: 'cases', step: 'cases',
      title: 'Add the test case sheet',
      body: <>
        <p>The same sheet as Functional Test: a <b>CSV or XLSX</b> file, one row per case.</p>
        <p>Each case needs a <b>Precondition</b>, an <b>Expected result</b> and <b>Steps</b>, or it can only be marked <b>not verified</b>.</p>
      </>,
    },
    {
      id: 'details', step: 'details',
      title: 'Name it and add instructions',
      body: <>
        <p>Both are <b>optional</b>. Left empty, the name is made from the file name, the build version and the date.</p>
        <p><b>Instructions</b> are one note for the whole run: a test account to use, where to start, or cases to skip.</p>
      </>,
    },
    {
      id: 'submit', step: 'submit',
      title: 'The AI players get to work',
      body: <>
        <p>Click <b>Run test</b>. The run sits on top of <b>Run history</b> as <b>In progress</b> while the AI players play.</p>
        <p>When the last case is done, the row shows the four counts and a <b>View report</b> button.</p>
      </>,
    },
    {
      id: 'report', step: 'report', focus: [717, 300, 1.28],
      title: 'Read the result',
      body: <>
        <p><b>{VERIFY.passRate}%</b> of the cases that ran passed. Each one gets a single outcome:</p>
        <Bullets items={[
          <><b>Passed</b> — the AI player got the expected result</>,
          <><b>Failed</b> — the steps ran and the build didn't do what the case expects</>,
          <><b>Need review</b> — the case was reached, but the video doesn't settle it</>,
          <><b>Not verified</b> — the case wasn't reached, or the sheet lacks its details</>,
        ]} />
      </>,
    },
    {
      id: 'coverage', step: 'coverage', focus: [717, 300, 1.28],
      title: 'See how much of the sheet was reached',
      body: <>
        <p><b>Coverage</b> is the share of the sheet the AI players actually got to: <b>{VERIFY.coverage}%</b> of {VERIFY.inFile}.</p>
        <p>A case they never reached is <b>not verified</b>. It is not a failure — it means no session ever got there.</p>
      </>,
    },
    {
      id: 'list', step: 'list', focus: [717, 300, 1.28],
      title: 'Find any case',
      body: <>
        <p>Under the scores is every case that ran, one row each: its ID, the case, its category, the <b>reason</b> for the outcome and the status.</p>
        <TextLink to="functional-test">The report, part by part, in Functional Test →</TextLink>
      </>,
    },
    {
      id: 'case', step: 'case', focus: [717, 300, 1.28],
      title: 'Watch what the AI player did',
      body: <>
        <p>Open any case. The video is marked <b>Played by an AI player</b>. <b>Specified</b> shows what your sheet expects; <b>Observed</b> shows what happened.</p>
        <p>Each of your steps shows the moment it happened. Click one and the video jumps there.</p>
      </>,
    },
    {
      id: 'export', step: 'export', focus: [717, 250, 1.28],
      title: 'Export as CSV',
      body: <>
        <p><b>Export CSV</b> gives every case with your IDs, the status, the reason, the steps with their timestamps, and the clip.</p>
        <TextLink to="#recap">See the recap ↓</TextLink>
      </>,
    },
  ],

  Screen,

  recap: {
    title: 'Your test cases, played by AI players.',
    head: <RecapFlow items={['Upload or pick a build', 'Add test cases', { strong: 'AI players run every case' }, ['Result', 'Coverage', 'Case detail'], 'Export CSV']} />,
    quotes: [
      'Hand over a build and your test cases; AI players run them and show you what failed.',
      "Every result comes with the video of the AI player's attempt.",
      'No testers to book: the AI players play the build for you.',
    ],
    faqs: [
      ['What do we need to provide?', 'An Android build (APK, up to 500 MB) and a spreadsheet of test cases (CSV or XLSX). Instructions are optional.'],
      ['How is this different from Functional Test?', 'Functional Test checks recordings your testers already made. Here, AI players play the build and make the recordings themselves.'],
      ['What if a run fails?', 'The row in Run history turns red and says why. Open it to see the details and start the run again.'],
      ['Does it work on iOS?', 'Not today. Builds are Android APKs.'],
      ['Can we compare two builds?', 'Not in this version. Each run has its own report.'],
    ],
    next: { to: 'oracle', kicker: 'Next · Intelligence', text: 'Oracle — ask about your players' },
  },
});
