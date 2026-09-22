// User Test pages inside the app frame: library, new run, picker, submit → run history, export.
import { PLAYTEST, RUN, SUMMARY } from '../../data/testing';
import { Layer, Show, useScenes } from '../../shell/scenes';
import { Button, Divider, Input, Label, PageHeader, PageLayer, Row } from '../../ui/testing/app';
import { TIcon } from '../../ui/testing/icons';
import { LibraryPicker, Pill, VideoGrid } from '../../ui/testing/library';
import { Crumb, GhostButton, ReportHeader, SectionHead } from '../../ui/testing/report';
import { ClickTarget, GameContextButton, HistoryTable, ModeSwitch, RunRow, RunTabs, SelectedVideos, SubmitSequence as RunSubmit } from '../../ui/testing/run';
import { Click } from '../../ui/Click';

const TAGS = [['Build V2.2', 10], ['Build V2.1', 3], ['onboarding', 6], ['Last 24h', 4]] as const;

export function LibraryPage() {
  return (
    <PageLayer show="videos">
      <PageHeader page="library" sub={undefined} />
      <div className="s-panel">
        <div className="s-panel-top">
          <Label>Select by tag</Label>
          {TAGS.map(([t, n], i) => <Pill key={t} label={t} n={n} on={i === 0 || undefined} hl={i === 0 ? 'videos' : undefined} />)}
        </div>
        <VideoGrid videos={PLAYTEST} />
      </div>
    </PageLayer>
  );
}

const CONTEXT_DOCS: [ext: string, name: string, note: string][] = [
  ['PDF', 'Onboarding flow v3.pdf', '12 intended steps · Aug 20'],
  ['DOCX', 'Game design doc v4.docx', 'Full design spec · Jul 2'],
  ['PDF', 'Alliance & rally spec.pdf', 'Join flow and rally rules · Aug 11'],
  ['—', 'None', 'Findings per video, not grouped by step'],
];

/** New run: mode, videos, name, game context. Report mode unless the "mode-ask" scene. */
export function NewRunPage() {
  const { at, cls } = useScenes();
  const reportForm = '..mode-report, add..';
  return (
    <PageLayer show="open..add, context">
      <PageHeader page="userTest" />
      <RunTabs runs={4} />
      <div className="s-runcard runwrap">
        <ModeSwitch report="..mode-report, add.." ask="mode-ask" clickAsk="mode-ask" />
        <Divider />
        <div className="s-dz" {...at('..add')}><Click on="add"><Button tone="primary" hl="open">+ Add videos</Button></Click>Select sessions from your Gameplay Library by tag, source, or date.</div>
        <SelectedVideos show="context.." />
        <Show when={reportForm}>
          <div className="s-col" style={{ gap: '8px', marginTop: '20px' }}>
            <Label>Run name <small>optional</small></Label>
            <Input show="..pick" placeholder="e.g. Onboarding playtest" />
            <Input show="context.." value={RUN.name} />
          </div>
          <Divider />
          <Row style={{ justifyContent: 'space-between' }}>
            <GameContextButton on="context" />
            <Button tone="dis" show="..pick">Generate report</Button>
            <Button tone="primary" show="context..">Generate report</Button>
          </Row>
        </Show>
        <Show when="mode-ask">
          <Input style={{ height: '96px', alignItems: 'flex-start', paddingTop: '14px', marginTop: '16px', fontSize: '17px', color: 'var(--ph)' }} value="Ask anything about these videos…" />
          <Divider />
          <Row style={{ justifyContent: 'space-between' }}>
            <GameContextButton />
            <span className="s-send dis">↑</span>
          </Row>
        </Show>
        <div className="dd" {...at('context')}>
          {CONTEXT_DOCS.map(([ext, name, note], i) => {
            const row = (
              <div className={i === 0 ? 'dd-item sel' : 'dd-item'}>
                <span className="ext">{ext}</span><span><b>{name}</b><span>{note}</span></span>{i === 0 ? <span className="tick">✓</span> : <span />}
              </div>
            );
            return i === 0 ? <Click key={name} on="context" from="right" block>{row}</Click> : <span key={name} style={{ display: 'contents' }}>{row}</span>;
          })}
          <div className="dd-sep" />
          <div {...cls('dd-item up', { hl: 'context' })}>
            <span className="ext">↑</span><span><b>Upload new</b><span>PDF, DOCX, or image</span></span><span />
          </div>
        </div>
      </div>
      <div className="s-note" style={{ marginTop: '16px' }} {...at(reportForm)}>Reports identify UX issues, friction points, frustration markers and drop-off by game step, each with supporting clips. Analysis runs in the background — the report lands in Run history when it is done.</div>
      <Show when="mode-ask">
        <div className="s-note" style={{ marginTop: '16px' }}>Answers are drawn from the selected recordings only, with clips as evidence.</div>
        <div className="s-label" style={{ textAlign: 'center', margin: '18px 0 10px' }}>Try our suggested prompts</div>
        <div className="prompts">
          <span>Where did testers hesitate the longest, and on which screen?</span>
          <span>Which testers quit before finishing onboarding, and what were they doing right before?</span>
        </div>
      </Show>
    </PageLayer>
  );
}

/** The Gameplay Library opened inside User Test, with the Build V2.2 batch picked. */
export function Picker() {
  return (
    <Layer show="pick">
      <div className="backdrop" />
      <LibraryPicker tags={TAGS} videos={PLAYTEST} selected={RUN.videos} playTime="2h 14m" hl="pick" click="pick" />
    </Layer>
  );
}

/** Click Generate report → Run history, where the new run goes from In progress to ready. */
export function SubmitSequence() {
  return (
    <PageLayer show="submit">
      <RunSubmit
        play="submit"
        form={<>
          <PageHeader page="userTest" />
          <RunTabs runs={4} />
          <div className="s-runcard">
            <ModeSwitch report />
            <Divider />
            <SelectedVideos />
            <div className="s-col" style={{ gap: '8px', marginTop: '20px' }}>
              <Label>Run name <small>optional</small></Label>
              <Input value={RUN.name} />
            </div>
            <Divider />
            <Row style={{ justifyContent: 'space-between' }}>
              <GameContextButton picked="Onboarding flow v3.pdf" />
              <ClickTarget><Button tone="primary">Generate report</Button></ClickTarget>
            </Row>
          </div>
        </>}
        history={<>
          <PageHeader page="userTest" />
          <RunTabs history runs={5} />
          <HistoryTable cols={['Report or question', 'Tags', 'Result', 'Date']}>
            <RunRow state="submitted" name={RUN.name} sub={`${RUN.videos} videos`} tags={['Build V2.2']} result={{ findings: 7 }} date="Sep 17" click="submit" />
            <RunRow icon="question" name={RUN.question} sub="6 videos · 3 follow-ups" tags={['Build V2.2']} result={{ text: 'Answered' }} date="Sep 8" action="View answer" />
            <RunRow name="Onboarding flow v3" sub="10 videos" tags={['Build V2.1']} result={{ findings: 7 }} date="Aug 26" />
          </HistoryTable>
        </>}
      />
    </PageLayer>
  );
}

/** Exporting the full report as a PDF. */
export function ExportPage() {
  const { at } = useScenes();
  return (
    <PageLayer show="export">
      <Crumb trail="User Test · Full report · "><Click on="export"><GhostButton download hl="export">Export PDF</GhostButton></Click></Crumb>
      <div className="s-rep">
        <ReportHeader />
        <div className="s-rep-body">
          <SectionHead n="01" title="Summary" />
          <p className="s-para" style={{ margin: '0' }}>{SUMMARY.report}</p>
        </div>
      </div>
      <div className="toast" {...at('export')} style={{ top: '78px', right: '28px' }}>
        <TIcon name="check" stroke="#5BD08A" width={2.4} />PDF ready — {RUN.name}.pdf
      </div>
    </PageLayer>
  );
}
