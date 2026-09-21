// Functional Test pages: new run (recordings + test cases), the library picker, submit → run history,
// the verification report, and the case detail popup.
import { PLAYTEST } from '../../data/testing';
import { CASE_FT, CASES, FT_RUN, VERIFY } from '../../data/verify';
import { Layer, useScenes } from '../../shell/scenes';
import { Button, PageHeader, PageLayer } from '../../ui/testing/app';
import { CaseFile, ColumnsNote, FilledTile, InputTile, Picked, RunDetails, Scroller, TileRow } from '../../ui/testing/composer';
import { TIcon } from '../../ui/testing/icons';
import { LibraryPicker } from '../../ui/testing/library';
import { Crumb, GhostButton } from '../../ui/testing/report';
import { ClickTarget, HistoryTable, RunRow, RunTabs, SubmitSequence } from '../../ui/testing/run';
import { CaseFilters, CaseModal, CaseTable, Scorecard, VerifiedAgainst, VerifyHeader } from '../../ui/testing/verify';

const TAGS = [['Build V2.2', FT_RUN.videos], ['Build V2.1', 12], ['Tutorial', 8], ['Last 24h', 4]] as const;
const INTRO = 'Select the recordings and the test cases they were intended to cover. 6labs verifies each case against the footage and reports it as passed, failed, or not verifiable. No tests are re-run.';
const DETAILS_SUB = 'A descriptive name makes the run easy to find later.';

const Recordings = ({ show }: { show?: string }) => (
  <FilledTile label="Recordings" show={show} links={<a>Change selection</a>}>
    <Picked badge={<TIcon name="play" size={14} />} name={`${FT_RUN.videos} videos selected`}>
      <span className="s-thumbs"><i className="g2" /><i className="g1" /><i className="g6" /></span>{FT_RUN.tag}
    </Picked>
  </FilledTile>
);

const TestCases = ({ show }: { show?: string }) => (
  <FilledTile label="Test cases" show={show} links={<><a>+ Add another file</a><a>See a sample sheet</a></>}>
    <div className="s-filecount"><b>1 file</b> · {VERIFY.inFile} cases</div>
    <CaseFile name={VERIFY.file} cases={VERIFY.inFile} />
  </FilledTile>
);

/** New run: the tiles fill in as the reader goes, then the page scrolls to the run name. */
export function NewRun() {
  const { at } = useScenes();
  return (
    <PageLayer show="open..name">
      <Scroller stops={[['name', 120]]}>
        <PageHeader page="functional" />
        <RunTabs runs={2} />
        <p className="s-intro">{INTRO}</p>
        <TileRow
          left={<>
            <InputTile icon="play" title="Select the recordings" show="..videos">Recordings of tests your team has already run. Select a batch by tag.</InputTile>
            <Recordings show="cases.." />
          </>}
          right={<>
            <InputTile icon="upload" title="Add the test cases" formats={['CSV', 'XLSX']} show="..cases" hl="cases" note={<ColumnsNote />}>
              The test cases these recordings were intended to cover — as a spreadsheet of cases.
            </InputTile>
            <TestCases show="name" />
          </>}
        />
        <RunDetails
          sub={DETAILS_SUB}
          name={{ placeholder: 'e.g. Build V2.2 — tutorial regression', value: FT_RUN.name, empty: '..cases', typed: 'name' }}
          hlName="name"
          summary={<><span {...at('..cases')}>Select the recordings and add the test cases to run.</span><span {...at('name')}>{FT_RUN.videos} videos · 1 file</span></>}
          submit={<><Button tone="dis" show="..cases">Verify test cases</Button><Button tone="primary" show="name">Verify test cases</Button></>}
        />
      </Scroller>
    </PageLayer>
  );
}

/** The Gameplay Library inside Functional Test, with the Build V2.2 batch picked. */
export function Picker() {
  return (
    <Layer show="videos">
      <div className="backdrop" />
      <LibraryPicker tags={TAGS} videos={PLAYTEST} selected={FT_RUN.videos} playTime="3h 41m" hl="videos" />
    </Layer>
  );
}

/** Verify test cases → Run history, where the run goes from In progress to its four counts. */
export function Submit() {
  return (
    <PageLayer show="submit">
      <SubmitSequence
        play="submit"
        form={<div style={{ transform: 'translateY(-120px)' }}>
          <PageHeader page="functional" />
          <RunTabs runs={2} />
          <p className="s-intro">{INTRO}</p>
          <TileRow left={<Recordings />} right={<TestCases />} />
          <RunDetails
            sub={DETAILS_SUB}
            name={{ placeholder: '', value: FT_RUN.name }}
            summary={`${FT_RUN.videos} videos · 1 file`}
            submit={<ClickTarget><Button tone="primary">Verify test cases</Button></ClickTarget>}
          />
        </div>}
        history={<>
          <PageHeader page="functional" />
          <RunTabs history runs={3} />
          <HistoryTable cols={['Run', 'Tags', 'Result', 'Date']} variant="counts">
            <RunRow state="submitted" name={FT_RUN.name} sub={`${FT_RUN.videos} videos · ${VERIFY.file}`} tags={[FT_RUN.tag]} result={{ outcomes: VERIFY.chips }} date="Sep 18" />
            <RunRow name="Tutorial regression" sub="8 videos · tutorial-cases.xlsx" tags={['Build V2.1', 'Tutorial']} result={{ outcomes: [42, 3, 2, 1] }} date="Sep 5" />
            <RunRow name="Store smoke check" sub="6 videos · store-cases.csv" tags={['Build V2.1']} result={{ outcomes: [22, 1, 0, 2] }} date="Aug 28" />
          </HistoryTable>
        </>}
      />
    </PageLayer>
  );
}

/** The report: result and coverage, the file, then the case list further down. */
export function Report() {
  const { at } = useScenes();
  return (
    <PageLayer show="result..export">
      <Crumb back trail="Functional test ·" name={FT_RUN.name}><GhostButton download hl="export">Export CSV</GhostButton></Crumb>
      <Scroller stops={[['list..steps', 300]]}>
        <div className="s-vcard">
          <VerifyHeader kind="Functional test report" name={FT_RUN.name} />
          <Scorecard hlResult="result" hlCoverage="coverage" />
        </div>
        <VerifiedAgainst />
        <CaseFilters hl="list" />
        <CaseTable cases={CASES} />
      </Scroller>
      <div className="toast" {...at('export')} style={{ top: '78px', right: '28px' }}>
        <TIcon name="check" stroke="#5BD08A" width={2.4} />CSV ready — {VERIFY.file.replace('.xlsx', '')}-results.csv
      </div>
    </PageLayer>
  );
}

/** The case detail popup over the whole app. */
export function CaseLayer() {
  return (
    <Layer show="case..steps" style={{ zIndex: 10 }}>
      <div className="backdrop" style={{ borderRadius: '18px' }} />
      <CaseModal detail={CASE_FT} hlStep="steps" />
    </Layer>
  );
}
