// Guide 01 · Gameplay Library: how videos get in, and how they're organised.
import { LIBRARY } from '../../data/testing';
import { Bullets, Facts, NextButton, RecapFlow } from '../../shell/content';
import { defineGuide } from '../../shell/guide';
import { Layer, useScenes } from '../../shell/scenes';
import { Button, Label, PageHeader, Row, TestingScreen, UploadButton } from '../../ui/testing/app';
import { TIcon } from '../../ui/testing/icons';
import { Pill, VideoCard } from '../../ui/testing/library';
import { CardAnatomy, Intake } from './intake';
import { Sources } from './sources';

/** Arrow and label pointing at a filter, shown in the "Find" scene. */
function FindMark({ label }: { label: string }) {
  const { at } = useScenes();
  return (
    <span className="fmark" {...at('find')}>
      <span className="fm-in"><TIcon name="arrowUp" size={14} stroke="#1770EF" width={3} round /><b>{label}</b></span>
    </span>
  );
}

/** Library → tests hand-off, over the library page. */
function Handoff() {
  return (
    <Layer show="tests">
      <div className="backdrop" style={{ background: 'rgba(245,246,250,.8)' }} />
      <div className="ho">
        <div className="ho-row">
          <div className="ho-lib">
            <div className="s-icon lib"><TIcon name="library" size={28} width={1.7} /></div>
            <b>Gameplay Library</b>
            <span>Stores &amp; organises videos.<br />No tests run here.</span>
          </div>
          <svg className="ho-arrow" width="70" height="24" viewBox="0 0 70 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M2 12h62m-9-9l9 9-9 9" /></svg>
          <div className="ho-agents">
            <div className="ho-agent">
              <div className="s-icon ut sm"><TIcon name="userTest" size={20} /></div>
              <div><b>User Test</b><span>Picks videos, finds where players struggle</span></div>
            </div>
            <div className="ho-agent">
              <div className="s-icon ft sm"><TIcon name="flaskDoc" size={22} width={1.5} /></div>
              <div><b>Functional Test</b><span>Picks videos, checks each test case</span></div>
            </div>
          </div>
        </div>
      </div>
    </Layer>
  );
}

function Screen() {
  const { at, cls } = useScenes();
  return (
    <>
      <TestingScreen sidebar={{ active: { library: true }, highlight: { library: 'overview', userTest: 'tests', functional: 'tests' } }}>
        <PageHeader page="library" action={<UploadButton />} />
        <div className="s-panel">
          <div className="s-panel-top">
            <Label className="fwrap">Select by tag<FindMark label="Tags" /></Label>
            <Pill label="Build V2.2" n={5} on="find" hl="find" />
            <Pill label="Build V2.1" n={3} />
            <Pill label="onboarding" n={2} />
            <Pill label="Last 24h" n={4} />
            <span className="s-sep" />
            <span className="s-pill plain">+10 more ▾</span>
          </div>
          <div className="s-panel-bar">
            <Row style={{ gap: '8px', fontSize: '14px' }}>
              <span {...cls('s-checkbox', { mixed: 'bulk..bulk-2' })} />
              <span {...at('..bulk-2, tests')}>Select all 14</span>
              <span {...at('find')}>Select all 5</span>
            </Row>
            <span className="s-sep" />
            <span className="fwrap" style={{ fontSize: '14px', color: 'var(--ink-3)' }}>Source<FindMark label="Source" /></span>
            <span className="s-seg"><span className="on">All</span><span>Recorder app</span><span>CLI</span><span>Browser upload</span></span>
            <span style={{ flex: '1' }} />
            <span className="s-search fwrap"><TIcon name="search" size={16} width={2} />Search sessions<FindMark label="Search" /></span>
          </div>
          <div className="s-grid">
            {LIBRARY.map((v, i) => (
              <VideoCard key={v.title} video={v} checkbox sel={i === 0 ? 'bulk..bulk-2' : i === 1 ? 'bulk-2' : undefined} show={v.batch === 'Build V2.1' ? '..bulk-2, tests' : undefined} tick={i === 0 ? 'bulk' : i === 1 ? 'bulk-2' : undefined} />
            ))}
          </div>
        </div>

        <div className="bulkdock" {...at('bulk..bulk-2')}>
          <span className="n"><span {...at('bulk')}>1 selected</span><span {...at('bulk-2')}>2 selected</span></span>
          <span className="sep" />
          <Button tone="ghost" sm>+ Add tag</Button>
          <Button sm className="del"><TIcon name="trash" size={15} width={2} />Delete</Button>
          <span className="x">✕</span>
        </div>

        <Handoff />
      </TestingScreen>

      <Intake />
      <CardAnatomy />
      <Sources />
    </>
  );
}

export default defineGuide({
  slug: 'gameplay-library',
  hero: <TIcon name="library" size={34} width={1.7} />,
  lede: <>Before any <b>human test</b> can run, the studio needs gameplay recordings. This guide shows how videos get into 6labs Studio and how they're organised — so tests can use them.</>,

  steps: [
    { id: 'overview', label: 'Overview' },
    { id: 'sources', label: 'Video sources' },
    { id: 'recorder', label: 'Gameplay Recorder' },
    { id: 'upload', label: 'Browser upload' },
    { id: 'cli', label: 'CLI' },
    { id: 'intake', label: 'Into library' },
    { id: 'card', label: 'Video card' },
    { id: 'bulk', label: 'Bulk tagging' },
    { id: 'find', label: 'Find' },
    { id: 'tests', label: 'To tests' },
  ],

  scenes: [
    {
      id: 'overview', step: 'overview', chapter: 'Overview',
      title: 'One home for every gameplay video',
      body: <>
        <p>The Gameplay Library is a page in the <b>Testing</b> mode of 6labs Studio. Every gameplay video the studio has lives here.</p>
        <Bullets items={[
          <><b>Comes in from:</b> the 6labs Gameplay Recorder App, browser upload and CLI</>,
          <><b>Not here:</b> BlueStacks recordings and SDK videos</>,
        ]} />
      </>,
    },
    {
      id: 'sources', step: 'sources', chapter: 'Video sources',
      title: 'Three ways to bring videos in',
      body: <>
        <Bullets items={[
          <><b>Gameplay Recorder App</b> — records testers while they play, then uploads</>,
          <><b>Browser upload</b> — drop in videos you already have</>,
          <><b>CLI</b> — push hundreds of videos from a computer</>,
        ]} />
        <p>Next, each one up close.</p>
      </>,
    },
    {
      id: 'rec-setup', step: 'recorder', chapter: 'Source 1 · Gameplay Recorder App',
      title: 'Set it up once',
      body: <>
        <p>Install the <b>6labs Gameplay Recorder App</b> on the PC testers play on, then enter:</p>
        <Bullets items={[
          <><b>Work email</b> — optional</>,
          <><b>App ID</b> — tells the app which game to record</>,
          <><b>Region</b> — whether you're in mainland China</>,
        ]} />
        <p>Click <b>Save &amp; Start</b>.</p>
        <Facts items={['PC app', 'Android & iOS coming soon']} />
      </>,
    },
    {
      id: 'rec-wait', step: 'recorder', chapter: 'Source 1 · Gameplay Recorder App',
      title: 'It waits for the game',
      body: <>
        <p>The app shows <b>Waiting for</b> the game. When the tester launches the game, recording starts on its own — no button to press.</p>
        <p><b>Pause</b> stops recording until they resume.</p>
      </>,
    },
    {
      id: 'rec-play', step: 'recorder', chapter: 'Source 1 · Gameplay Recorder App',
      title: 'Testers just play',
      body: <p>While the game runs, the app shows <b>REC</b> and a timer. The tester plays as normal.</p>,
    },
    {
      id: 'rec-close', step: 'recorder', chapter: 'Source 1 · Gameplay Recorder App',
      title: 'Close the game — it uploads',
      body: <>
        <p>When the tester closes the game, recording stops and the video starts uploading on its own.</p>
        <p>To stop early, they can click <b>Stop recording</b>: <b>Stop &amp; upload</b> sends it, <b>Stop &amp; discard</b> throws it away.</p>
      </>,
    },
    {
      id: 'rec-upload', step: 'recorder', chapter: 'Source 1 · Gameplay Recorder App',
      title: 'The video uploads itself',
      body: <>
        <p>The app uploads the session and shows its progress.</p>
        <p>Once it's done, the video appears in the Gameplay Library with a <b>Recorder app</b> badge.</p>
      </>,
    },
    {
      id: 'up-open', step: 'upload', chapter: 'Source 2 · Browser upload',
      title: 'Click Upload videos',
      body: <p>On the Gameplay Library page, click <b>Upload videos</b> in the top-right corner.</p>,
    },
    {
      id: 'up-drop', step: 'upload', chapter: 'Source 2 · Browser upload',
      title: 'Drop in files, add tags',
      body: <>
        <p>Drop videos in or click to browse. Tags are optional and apply to every video in the upload.</p>
        <Facts items={['MP4 · MOV · WEBM · AVI · MKV', 'Max 500 MB each', 'Up to 50 per upload']} />
      </>,
    },
    {
      id: 'cli', step: 'cli', chapter: 'Source 3 · CLI',
      title: 'Upload hundreds from the command line',
      body: <>
        <p>For big batches, open <b>Upload videos → Bulk via CLI</b> and follow three steps:</p>
        <Bullets items={[
          <><b>Install</b> the 6labs CLI</>,
          <><b>Log in</b> — authorises the computer in the browser</>,
          <><b>Upload a folder</b> with tags, game name and App ID</>,
        ]} />
        <p>It runs in the background, retries failures and resumes interrupted uploads.</p>
      </>,
    },
    {
      id: 'intake', step: 'intake', chapter: 'All sources',
      title: 'Every video lands in one library',
      body: <p>Gameplay Recorder App, browser upload and CLI all send videos to the same place — the Gameplay Library.</p>,
    },
    {
      id: 'card', step: 'card', chapter: 'Video card',
      title: 'What a video card shows',
      body: <>
        <p>Every video, from any source, becomes a card like this:</p>
        <Bullets items={[
          <><b>Source</b> — where the video came from</>,
          <><b>Username</b> — who added it</>,
          <><b>System tag</b> — added automatically, can't be edited</>,
          <><b>Your tags</b> — labels you add, up to 5</>,
          <><b>Edit &amp; delete</b> — appear when you hover</>,
        ]} />
      </>,
    },
    {
      id: 'bulk', step: 'bulk', chapter: 'Bulk tagging', focus: [706, 560, 1.12],
      title: 'Tick one, the bar appears',
      body: <p>Tick a video's checkbox. A bar slides in at the bottom showing how many are selected — it stays while you keep picking.</p>,
    },
    {
      id: 'bulk-2', step: 'bulk', chapter: 'Bulk tagging', focus: [706, 560, 1.12],
      title: 'Tag many videos at once',
      body: <>
        <p>Tick as many as you want, then use the bar:</p>
        <Bullets items={[
          <><b>Add tag</b> — adds a tag to every selected video</>,
          <><b>Delete</b> — removes them together</>,
        ]} />
      </>,
    },
    {
      id: 'find', step: 'find', chapter: 'Find', focus: [706, 300, 1.15],
      title: 'Find the right batch',
      body: <>
        <p>Three ways to narrow the list:</p>
        <Bullets items={[
          <><b>Tags</b> — tap one or more, like <b>Build V2.2</b>. <b>Last 24h</b> shows new videos.</>,
          <><b>Source</b> — Recorder app, CLI or browser upload</>,
          <><b>Search</b> — by file name or tag</>,
        ]} />
      </>,
    },
    {
      id: 'tests', step: 'tests', chapter: "What's next",
      title: 'Tests pick their videos from here',
      body: <>
        <p>To analyse videos, you open a test such as <b>User Test</b>. It lets you pick videos straight from this library.</p>
        <NextButton to="user-test" />
      </>,
    },
  ],

  Screen,

  recap: {
    title: 'Three ways in. One library. Tests pick from there.',
    head: <RecapFlow items={[['Gameplay Recorder App', 'Browser upload', 'CLI'], { strong: 'Gameplay Library' }, ['User Test', 'Functional Test']]} />,
    quotes: [
      'Your testers just play — recording starts on its own.',
      'Already have recordings? Upload them, or push hundreds with one command.',
      'Tag by build or feature, and pull the right batch in one tap.',
    ],
    faqs: [
      ['Do testers have to press record?', 'No. Recording starts when the game launches and uploads when they close it. They can also stop and upload manually.'],
      ['Does the recorder work on phones?', 'Not yet. The 6labs Gameplay Recorder App is for PC. Android and iOS are coming soon.'],
      ['Can we use recordings we already have?', 'Yes. Upload up to 50 at a time in the browser, or any number with the CLI.'],
      ['Which video formats work?', 'MP4, MOV, WEBM, AVI and MKV, up to 500 MB each.'],
      ['Do BlueStacks or SDK recordings show up here?', 'No. The library holds videos from the Gameplay Recorder App, browser uploads and the CLI.'],
    ],
    next: { to: 'user-test', kicker: 'Next guide', text: 'User Test — from videos to a report' },
  },
});
