// The three video sources side by side; the one being explained grows, the others shrink aside.
import { LIBRARY_MINI } from '../../data/testing';
import { Layer, useScenes, type Fx } from '../../shell/scenes';
import { Button, Input, Label, PageHeader, Row, UploadButton } from '../../ui/testing/app';
import { TIcon } from '../../ui/testing/icons';
import { Pill, VideoGrid } from '../../ui/testing/library';
import { Click } from '../../ui/Click';

/** Where each panel sits per scene: eq = three equal columns, big = in focus, s1/s2 = shrunk aside. */
const PLACE: Fx[] = [
  { eq1: '..sources', big: 'rec-setup..rec-upload', s1: 'up-open..' },
  { eq2: '..sources', s1: 'rec-setup..rec-upload', big: 'up-open..up-drop', s2: 'cli..' },
  { eq3: '..sources', s2: 'rec-setup..up-drop', big: 'cli..' },
];

const USER = <div className="rw-kv"><span>USER</span>elena@studio.com<span>GAME</span>Don't Let it Die</div>;

/** The 6labs Gameplay Recorder App window through setup → waiting → recording → stop → upload. */
function RecorderApp() {
  const { at, cls } = useScenes();
  return (
    <div className="rwin2">
      <div className="rw-title"><span className="logo" />6labs Gameplay Recorder<span className="wc"><span>—</span><span>✕</span></span></div>

      <div className="rw-body" {...at('..rec-setup')}>
        <span className="rw-pill setup">SETUP</span>
        <div className="rw-h">Enter your details</div>
        <p className="rw-sub">Auto-records gameplay and uploads to your 6labs Gameplay Library.</p>
        <div className="rw-lab">Work email (optional)</div>
        <div className="rw-in">elena@studio.com</div>
        <div className="rw-lab">App ID</div>
        <div className="rw-in">10007</div>
        <div className="rw-ok">Don't Let it Die</div>
        <div className="rw-lab">Are you in mainland China?</div>
        <div className="rw-yn"><span>Yes</span><span className="on">No</span></div>
        <div className="rw-div" />
        <div className="rw-lab" style={{ marginTop: '0' }}>On this device</div>
        <div className="rw-row">Keep local copies<span className="rw-tog" /></div>
        <div className="rw-path">C:\Users\admin\AppData\Local\6Labs\GameLibrary\recordings ↗</div>
        <div className="rw-foot">
          <span className="v">v1.4.0</span>
          <span className="rw-btn">Clear</span>
          <span {...cls('rw-btn pri', { hl: 'rec-setup' })}>Save &amp; Start</span>
        </div>
      </div>

      <div className="rw-body" {...at('rec-wait')}>
        <span className="rw-pill ready">READY</span>
        <div className="rw-h">Waiting for Don't Let it Die</div>
        <p className="rw-sub">Launch the game — recording starts on its own.</p>
        <div className="rw-div" />
        {USER}
        <span className="rw-link">Settings</span>
        <div className="rw-muted">Uploaded 4 min ago</div>
        <div className="rw-foot"><span className="v">v1.4.0</span><span className="rw-btn">Pause</span></div>
      </div>

      <div className="rw-body" {...at('rec-play..rec-close')}>
        <span className="rw-pill rec">REC</span>
        {/* counted up by script.js */}
        <div className="rw-timer" id="rec-time">0:00</div>
        <div className="rw-div" style={{ marginTop: '0' }} />
        {USER}
        <div className="rw-foot">
          <span className="v">v1.4.0</span>
          <span {...cls('rw-btn stop', { hl: 'rec-close' })}>Stop recording</span>
        </div>
      </div>

      <div className="rw-body" {...at('rec-upload..')}>
        <span className="rw-pill up">UPLOADING</span>
        <div className="rw-h">Uploading session</div>
        <p className="rw-sub">84 MB · 38%</p>
        <div className="rw-bar"><i /></div>
        <div className="rw-div" />
        {USER}
        <div className="rw-muted">Uploaded 5 min ago</div>
        <div className="rw-foot"><span className="v">v1.4.0</span></div>
      </div>

      <div className="rw-dim" {...at('rec-close')}>
        <div className="rw-dialog">
          <b>Stop recording?</b>
          <span className="pri">Stop &amp; upload</span>
          <span className="red">Stop &amp; discard</span>
          <span>Cancel</span>
        </div>
      </div>
    </div>
  );
}

function UploadDialog() {
  const { cls } = useScenes();
  return (
    <div className="s-modal upmodal">
      <span className="s-x">✕</span>
      <h2>Upload videos</h2>
      <p>Add gameplay clips for your agents to reference. Tag them so they're easy to find later.</p>
      <div className="s-seg" style={{ margin: '16px 0' }}><span className="on">Upload files</span><span>Bulk via CLI</span></div>
      <div {...cls('s-drop', { hl: 'up-drop' })}>
        <TIcon name="uploadTray" size={26} stroke="#1770EF" />
        <b>Drop videos here or click to browse</b>
        <span>MP4, MOV, WEBM, AVI, MKV · max 500 MB each · select many at once</span>
      </div>
      <div className="s-label" style={{ margin: '20px 0 10px' }}>Tags for all videos</div>
      <Input style={{ gap: '6px' }}>
        <span className="s-utag">Build V2.2</span>
        <span className="s-utag">onboarding</span>
        <span style={{ color: 'var(--ph)', fontSize: '14px' }}>e.g. tutorial, boss-fight</span>
      </Input>
      <p style={{ fontSize: '13px', marginTop: '8px' }}>Press Enter or comma to add. Tags apply to every video in this upload.</p>
      <Row style={{ justifyContent: 'flex-end', marginTop: '16px' }}>
        <Button tone="ghost" sm>Cancel</Button>
        <Button tone="primary" sm>Upload videos</Button>
      </Row>
    </div>
  );
}

const CLI_UPLOAD = `6labs videos upload ./gameplay/*.mp4 \\
  --tags "Build V2.2,onboarding" \\
  --game-name "Don't Let it Die" \\
  --app-id "10007" \\
  --concurrency 4`;

function CliDialog() {
  return (
    <div className="s-modal clitab">
      <span className="s-x">✕</span>
      <h2>Upload videos</h2>
      <div className="s-seg" style={{ margin: '12px 0' }}><span>Upload files</span><span className="on">Bulk via CLI</span></div>
      <p style={{ margin: '0 0 12px' }}>Uploading hundreds of clips? Push them straight from your machine with the 6labs CLI — it runs in the background, retries on failure, and resumes interrupted uploads.</p>
      <div className="s-col" style={{ gap: '10px' }}>
        <div className="s-code"><Label>1 · Install</Label><pre>npm install -g @6labs/cli</pre></div>
        <div className="s-code"><Label>2 · Authenticate</Label><span className="help">Opens your browser to authorize this machine.</span><pre>6labs login</pre></div>
        <div className="s-code"><Label>3 · Upload a folder</Label><pre>{CLI_UPLOAD}</pre></div>
        <p className="hint">Globs like ./gameplay/**/*.mp4 upload nested folders. --concurrency controls parallel uploads. Clips appear in the library as each one finishes.</p>
      </div>
      <Row style={{ justifyContent: 'flex-end', marginTop: '12px' }}><Button tone="primary" sm>Done</Button></Row>
    </div>
  );
}

export function Sources() {
  const { fx } = useScenes();
  return (
    <Layer show="sources..cli" className="srcscene">
      <div className="srcpanel" {...fx(PLACE[0])}>
        <div className="wall" />
        <RecorderApp />
      </div>

      <div className="srcpanel" {...fx(PLACE[1])}>
        <div className="minipage">
          <PageHeader page="library" small sub="Every recording, from every source." action={<Click on="up-open"><UploadButton hl="up-open" /></Click>} />
          <div className="s-panel">
            <div className="s-panel-top">
              <Pill label="Build V2.2" n={5} />
              <Pill label="Build V2.1" n={3} />
              <Pill label="Last 24h" n={4} />
            </div>
            <VideoGrid videos={LIBRARY_MINI} />
          </div>
          <Layer show="up-drop..">
            <div className="backdrop" />
            <UploadDialog />
          </Layer>
        </div>
      </div>

      <div className="srcpanel" {...fx(PLACE[2])}>
        <div className="minipage">
          <PageHeader page="library" small sub={false} />
          <div className="backdrop" />
          <CliDialog />
        </div>
      </div>

      <span className="srclabel" {...fx(PLACE[0])}><i>1</i>Gameplay Recorder App <span className="soon">· PC</span></span>
      <span className="srclabel" {...fx(PLACE[1])}><i>2</i>Browser upload</span>
      <span className="srclabel" {...fx(PLACE[2])}><i>3</i>CLI</span>
    </Layer>
  );
}
