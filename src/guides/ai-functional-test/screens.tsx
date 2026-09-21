// AI Functional Test pages: new run (build + test cases + instructions), the build picker,
// submit → run history, the report, and the case detail with the AI player's video.
import { AIF_RUN, CASE_AIF, CASES, VERIFY } from '../../data/verify';
import { Layer, useScenes } from '../../shell/scenes';
import { BuildDialog } from '../../ui/testing/ai';
import { Button, PageHeader, PageLayer } from '../../ui/testing/app';
import { Apk, CaseFile, ColumnsNote, FilledTile, InputTile, Picked, RunDetails, Scroller, TileRow } from '../../ui/testing/composer';
import { TIcon } from '../../ui/testing/icons';
import { Crumb, GhostButton } from '../../ui/testing/report';
import { ClickTarget, HistoryTable, RunRow, RunTabs, SubmitSequence } from '../../ui/testing/run';
import { CaseFilters, CaseModal, CaseTable, Scorecard, VerifiedAgainst, VerifyHeader } from '../../ui/testing/verify';
import { Click } from '../../ui/Click';

const b = AIF_RUN.build;
const INTRO = 'Each run keeps its own build, test cases and report.';
const DETAILS_SUB = 'A clear name makes the run easy to find later.';
const NAME_PH = 'e.g. Season 9 — core loop';
const INSTRUCTIONS_PH = 'e.g. Start from a fresh install. Skip the tutorial for cases TC-10 onward. Use the test account bp_tester_03.';

const Build = ({ show }: { show?: string }) => (
  <FilledTile label="Build" show={show} links={<a>Change build</a>}>
    <Picked badge={<Apk />} name={b.version}>{b.file} · {b.size} · uploaded {b.uploaded} · newest</Picked>
  </FilledTile>
);

const TestCases = ({ show }: { show?: string }) => (
  <FilledTile label="Test cases" show={show} links={<><a>+ Add another file</a><a>See a sample sheet</a></>}>
    <div className="s-filecount"><b>1 file</b> · {VERIFY.inFile} cases</div>
    <CaseFile name={VERIFY.file} cases={VERIFY.inFile} />
  </FilledTile>
);

/** New run: build and test cases fill in, then the page scrolls to name and instructions. */
export function NewRun() {
  const { at } = useScenes();
  return (
    <PageLayer show="open..details">
      <Scroller stops={[['details', 130]]}>
        <PageHeader page="aiFunctional" />
        <RunTabs runs={2} />
        <p className="s-intro">{INTRO}</p>
        <TileRow
          left={<>
            <InputTile icon="uploadTray" title="Choose a build" formats={['APK']} show="..build">Upload an APK, or pick one you uploaded before.</InputTile>
            <Build show="cases.." />
          </>}
          right={<>
            <InputTile icon="upload" title="Add your test cases" formats={['CSV', 'XLSX']} show="..cases" hl="cases" note={<ColumnsNote />}>
              Upload a spreadsheet of test cases — one row per case.
            </InputTile>
            <TestCases show="details" />
          </>}
        />
        <RunDetails
          sub={DETAILS_SUB}
          name={{ placeholder: NAME_PH, value: AIF_RUN.name, empty: '..cases', typed: 'details' }}
          instructions={{ placeholder: INSTRUCTIONS_PH, value: AIF_RUN.instructions, empty: '..cases', typed: 'details' }}
          hlInstructions="details"
          summary={<><span {...at('..cases')}>Choose a build and add the test cases to run.</span><span {...at('details')}>1 file · {b.version}</span></>}
          submit={<><Button tone="dis" show="..cases">Run test</Button><Button tone="primary" show="details">Run test</Button></>}
        />
      </Scroller>
    </PageLayer>
  );
}

/** "Select a build", opened from Choose a build. */
export function BuildPicker() {
  return (
    <Layer show="build">
      <div className="backdrop" />
      <BuildDialog hlList="build" />
    </Layer>
  );
}

/** Run test → Run history, where the run goes from In progress to its four counts. */
export function Submit() {
  return (
    <PageLayer show="submit">
      <SubmitSequence
        play="submit"
        form={<div style={{ transform: 'translateY(-130px)' }}>
          <PageHeader page="aiFunctional" />
          <RunTabs runs={2} />
          <p className="s-intro">{INTRO}</p>
          <TileRow left={<Build />} right={<TestCases />} />
          <RunDetails
            sub={DETAILS_SUB}
            name={{ placeholder: NAME_PH, value: AIF_RUN.name }}
            instructions={{ placeholder: INSTRUCTIONS_PH, value: AIF_RUN.instructions }}
            summary={`1 file · ${b.version}`}
            submit={<ClickTarget><Button tone="primary">Run test</Button></ClickTarget>}
          />
        </div>}
        history={<>
          <PageHeader page="aiFunctional" />
          <RunTabs history runs={3} />
          <HistoryTable cols={['Run', 'Build', 'Result', 'Date']} variant="counts">
            <RunRow state="submitted" name={AIF_RUN.name} sub={`${VERIFY.inFile} cases · ${VERIFY.file}`} third={<span className="s-plain">{b.version}</span>} result={{ outcomes: VERIFY.chips }} date="Sep 18" />
            <RunRow name="Season 8 — core loop" sub={`1,904 cases · ${VERIFY.file}`} third={<span className="s-plain">v2.2.9</span>} result={{ outcomes: [1102, 44, 20, 31] }} date="Aug 29" />
            <RunRow name="Battle Pass v2 — store" sub="5 cases · battlepass-cases.csv" third={<span className="s-plain">v2.3.0</span>} result={{ outcomes: [4, 1, 0, 0] }} date="Aug 28" />
          </HistoryTable>
        </>}
      />
    </PageLayer>
  );
}

/** The report, the same layout as Functional Test's, with the build it ran on. */
export function Report() {
  const { at } = useScenes();
  return (
    <PageLayer show="report..export">
      <Crumb back trail="AI functional test ·" name={AIF_RUN.name}><Click on="export"><GhostButton download hl="export">Export CSV</GhostButton></Click></Crumb>
      <Scroller stops={[['case', 300]]}>
        <div className="s-vcard">
          <VerifyHeader kind="AI functional test report" name={AIF_RUN.name} />
          <Scorecard hlResult="report" />
        </div>
        <VerifiedAgainst build={b.version} />
        <CaseFilters />
        <CaseTable cases={CASES} open={{ id: CASE_AIF.id, when: 'report', click: 'report' }} />
      </Scroller>
      <div className="toast" {...at('export')} style={{ top: '78px', right: '28px' }}>
        <TIcon name="check" stroke="#5BD08A" width={2.4} />CSV ready — {AIF_RUN.name.replace(' — ', '-').replace(/ /g, '-').toLowerCase()}.csv
      </div>
    </PageLayer>
  );
}

/** The case detail, with the "Played by an AI player" marker. */
export function CaseLayer() {
  return (
    <Layer show="case" style={{ zIndex: 10 }}>
      <div className="backdrop" style={{ borderRadius: '18px' }} />
      <CaseModal detail={CASE_AIF} ai hlStep="case" />
    </Layer>
  );
}
