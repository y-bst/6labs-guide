// "What you get": summary, full report and ask-about-the-report as three panels.
// The panel being explained grows; the others shrink aside.
import type { CSSProperties } from 'react';
import { RUN, SUMMARY, TOP_FINDINGS } from '../../data/testing';
import { Layer, useScenes, type Fx } from '../../shell/scenes';
import { AgentHeader, CategoryTable, Crumb, FullReportCta, GhostButton, QuitAnswer, ReportHeader, ReportTiles, SectionHead, SourcesBar, TopFinding } from '../../ui/testing/report';
import { ModeSwitch, SelectedVideos } from '../../ui/testing/run';
import { Button, Divider, Input, Label, PageLayer, Row } from '../../ui/testing/app';
import { Click } from '../../ui/Click';

const PLACE: Fx[] = [
  { eq1: 'results', big: 'summary..top-problems', s1: 'full-open..' },
  { eq2: 'results', s1: 'summary..top-problems', big: 'full-open..clip', s2: 'ask..' },
  { eq3: 'results', s2: 'summary..clip', big: 'ask..' },
];

function AskBox({ text, typed, hl, style, textStyle, sendOff = true, sendStyle }: {
  text: string; typed?: boolean; hl?: string; style: CSSProperties; textStyle?: CSSProperties; sendOff?: boolean; sendStyle?: CSSProperties;
}) {
  const { cls } = useScenes();
  return (
    <div {...cls('s-askbox', { hl })} style={style}>
      <div className={typed ? 'typed' : 'ph'} style={textStyle}>{text}</div>
      <div className="ctl"><span className="s-round">+</span><span className={sendOff ? 's-send dis' : 's-send'} style={sendStyle}>↑</span></div>
    </div>
  );
}

const TopThree = () => <>{TOP_FINDINGS.map((f, i) => <TopFinding key={f.title} finding={f} rank={i + 1} />)}</>;

function SummaryPanel() {
  const { cls } = useScenes();
  return (
    <div className="layer s-pg">
      <Crumb trail="User Test · "><Button tone="ghost" sm>Export</Button></Crumb>
      <div {...cls('scrollwrap', { mid: 'summary', down: 'top-problems' })}>
        <div className="s-ububble" style={{ marginBottom: '16px' }}>Analyse {RUN.videos} sessions<small>tagged Build V2.2 · context: {RUN.context}</small></div>
        <div className="s-agent">
          <AgentHeader sub={`Analysed ${RUN.videos} tester sessions · ${RUN.context}`} />
          <SourcesBar />
          <div className="s-sec">
            <SectionHead n="01" title="Summary" />
            <ReportTiles hl="summary" style={{ borderRadius: '10px' }} />
            <p className="s-para">{SUMMARY.takeaway}</p>
            <CategoryTable hl="summary" />
          </div>
          <div className="s-sec">
            <SectionHead n="02" title="Top findings" />
            <div {...cls('', { hl: 'top-problems' })} style={{ borderRadius: '10px' }}><TopThree /></div>
          </div>
          <FullReportCta />
        </div>
      </div>
      <div className="askdock">
        <AskBox text={`Ask User Test about these ${RUN.videos} sessions…`} style={{ padding: '12px 18px' }} textStyle={{ minHeight: '28px' }} />
      </div>
    </div>
  );
}

function FullReportPanel() {
  const { at, cls } = useScenes();
  const evidence = [1, 2, 3, 4, 5, 6, 7];
  return (
    <>
      <PageLayer show="full-open">
        <Crumb trail="User Test · "><Button tone="ghost" sm>Export</Button></Crumb>
        <div className="above"><span>↑ Summary above</span></div>
        <div className="s-agent">
          <div className="s-sec">
            <SectionHead n="02" title="Top findings" />
            <TopThree />
          </div>
          <FullReportCta button={
            <span className="btnwrap">
              <span className="pointer">Click to open<svg width="26" height="18" viewBox="0 0 26 18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M2 9h20m-7-7l7 7-7 7" /></svg></span>
              <Click on="full-open"><Button tone="primary" sm hl="full-open">Open the full report</Button></Click>
            </span>
          } />
        </div>
      </PageLayer>

      <PageLayer show="..top-problems, full-report..">
        <Crumb trail="User Test · Full report · "><Button tone="ghost" sm>Export PDF</Button></Crumb>
        <div {...cls('repscroll', { tour: 'full-report', detail: 'findings..clip' })}>
          <div className="s-rep">
            <ReportHeader />
            <div className="s-rep-body">
              <SectionHead n="01" title="Summary" />
              <p className="s-para" style={{ margin: '0 0 18px' }}>{SUMMARY.report}</p>
              <Label>Findings by category</Label>
              <CategoryTable />
              <div className="s-rep-div" />
              <SectionHead n="02" title="Findings" />
              <Row style={{ gap: '8px', marginBottom: '16px' }}>
                {[['Functional', 1], ['Visual', 1], ['Technical', 1], ['Usability', 2], ['Struggle', 2]].map(([k, n]) => <span key={k} className="s-pill">{k} <span className="n">{n}</span></span>)}
              </Row>
              <div className="s-agent">
                <div className="s-band"><b>Functional defects</b><span>1 finding</span></div>
                <div className="s-finding">
                  <div className="s-finding-h"><b>“Upgrade Furnace” button doesn't respond while the tutorial hint shows</b><span><strong>7</strong> / 10 sessions</span></div>
                  <Row style={{ gap: '8px', marginTop: '8px' }}><span className="s-chip red">Blocking</span><span className="s-screen">Tutorial › Furnace upgrade · step 4 of 11</span></Row>
                  <p>At tutorial step 4 the hint overlay covers the Upgrade Furnace button, so taps do nothing until the hint fades. Testers tapped 3 to 7 times before it worked, and one closed the game right there.</p>
                  <div {...cls('s-evi', { hl: 'findings' })} style={{ borderRadius: '8px' }}>
                    <Label style={{ marginRight: '4px' }}>Evidence</Label>
                    {evidence.map(n => <button key={n} {...cls('', { on: n === 3 ? 'clip' : undefined })}>{n}</button>)}
                  </div>
                  <div className="s-reco"><Label>Recommendation</Label>Let taps pass through the hint to the highlighted button, or close the hint on the first tap. Check tall-screen layouts where the hint covers the whole button.</div>
                </div>
              </div>
              <div className="s-agent" style={{ marginTop: '16px' }}>
                <div className="s-band"><b>Visual defects</b><span>1 finding</span></div>
                <div className="s-finding">
                  <div className="s-finding-h"><b>Reward dialog opens on top of the chapter-complete popup</b><span><strong>4</strong> / 10 sessions</span></div>
                  <Row style={{ gap: '8px', marginTop: '8px' }}><span className="s-chip red">Blocking</span><span className="s-screen">Chapter 1 › Completion</span></Row>
                  <p>Two dialogs stack at the end of Chapter 1, and on tall phones the close button of the top dialog sits off-screen.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayer>

      <div className="layer" {...at('clip')}>
        <div className="backdrop" />
        <div className="s-player clipmodal">
          <div className="s-player-h" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <div><b>“Upgrade Furnace” button doesn't respond while the tutorial hint shows</b><span>tester_03 · 04:05 – 04:46 · clip 3 of 7</span></div>
            <span className="s-x">✕</span>
          </div>
          <div className="s-video"><span className="s-playhead" /><span className="s-dur">0:41</span></div>
          <div className="s-player-f"><span>7 taps with no response — stuck for 41 seconds</span><span className="nav2"><span className="s-round">‹</span><span className="s-round">›</span></span></div>
        </div>
      </div>
    </>
  );
}

function AskPanel() {
  const { cls } = useScenes();
  const cta = { borderTop: '0' };
  return (
    <>
      <PageLayer show="ask">
        <Crumb trail="User Test · "><Button tone="ghost" sm>Export</Button></Crumb>
        <div className="above"><span>↑ Report summary above</span></div>
        <div className="s-agent" style={{ opacity: '.6' }}>
          <div className="s-sec"><TopFinding finding={TOP_FINDINGS[2]} rank={3} brief style={{ borderTop: '0' }} /></div>
          <FullReportCta />
        </div>
        <div className="askdock">
          <AskBox text={RUN.question} typed hl="ask" style={{ padding: '12px 18px' }} sendOff={false} />
        </div>
      </PageLayer>

      <PageLayer show="..clip, answer..">
        <Crumb trail="User Test · "><GhostButton download>Export</GhostButton></Crumb>
        <div className="above"><span>↑ Report summary above</span></div>
        <div className="s-agent" style={{ marginBottom: '16px', opacity: '.6' }}><FullReportCta style={cta} /></div>
        <div {...cls('', { hl: 'answer' })} style={{ borderRadius: '16px' }}>
          <div className="s-qbubble" style={{ marginBottom: '12px' }}>{RUN.question}</div>
          <QuitAnswer sub={`Read ${RUN.videos} sessions · ${RUN.context}`} pad={20} rows={2} />
        </div>
        <div className="askdock" style={{ bottom: '14px' }}>
          <AskBox text="Ask a follow-up…" style={{ padding: '10px 16px' }} textStyle={{ minHeight: '22px', fontSize: '15px' }} sendStyle={{ width: '36px', height: '36px' }} />
        </div>
      </PageLayer>
    </>
  );
}

export function Results() {
  const { fx } = useScenes();
  return (
    <Layer show="results..answer" className="resscene">
      <div className="respanel" {...fx(PLACE[0])}><SummaryPanel /></div>
      <div className="respanel" {...fx(PLACE[1])}><FullReportPanel /></div>
      <div className="respanel" {...fx(PLACE[2])}><AskPanel /></div>
      <span className="reslabel" {...fx(PLACE[0])}><i>1</i>Summary</span>
      <span className="reslabel" {...fx(PLACE[1])}><i>2</i>Full report</span>
      <span className="reslabel" {...fx(PLACE[2])}><i>3</i>Ask about the report</span>
    </Layer>
  );
}

/** "Just ask": the Ask questions mode, question on the left, answer page on the right. */
export function AskMode() {
  return (
    <Layer show="askmode" className="askscene">
      <span className="asklabel" style={{ left: '40px' }}><i>1</i>Choose Ask questions, type, submit</span>
      <span className="asklabel" style={{ left: '615px' }}><i>2</i>Answers only — no report</span>
      <div className="askp" style={{ left: '40px', top: '170px' }}>
        <div className="miniwin">
          <div className="miniwin-h"><span>User Test</span> · New run</div>
          <div className="miniwin-b">
            <ModeSwitch ask />
            <Divider />
            <SelectedVideos />
            <Input style={{ height: '92px', alignItems: 'flex-start', paddingTop: '14px', marginTop: '16px', fontSize: '17px' }} value={RUN.question} />
            <Divider />
            <Row style={{ justifyContent: 'space-between' }}><span className="s-outline">+ Add game context</span><span className="s-send hl">↑</span></Row>
          </div>
        </div>
        <div className="s-note" style={{ marginTop: '14px', background: '#fff' }}>Answers are drawn from the selected recordings only, with clips as evidence.</div>
      </div>
      <div className="askarrow">
        <svg width="44" height="30" viewBox="0 0 44 30" fill="none" stroke="#1770EF" strokeWidth="3" strokeLinecap="round"><path d="M3 15h36m-11-11l11 11-11 11" /></svg>
        <span>Submit</span>
      </div>
      <div className="askp" style={{ left: '615px', top: '170px' }}>
        <div className="miniwin">
          <div className="miniwin-h"><span>User Test</span> · {RUN.question}</div>
          <div className="miniwin-b">
            <div className="s-qbubble" style={{ marginBottom: '12px' }}>{RUN.question}</div>
            <QuitAnswer sub={`Read ${RUN.videos} sessions`} pad={18} sources />
          </div>
        </div>
      </div>
    </Layer>
  );
}
