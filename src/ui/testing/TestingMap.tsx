// "Testing at a glance": two lanes — real players and AI players — each feeding two tests,
// and what each test gives back. The current guide's path is the only one in colour.
import { GlanceCard, GlanceLine, type GlanceNode } from '../GlanceMap';
import { TIcon, type TIconName } from './icons';

const ic = (name: TIconName) => <TIcon name={name} size={18} width={1.7} />;

type Test = 'userTest' | 'functional' | 'aiBehavioural' | 'aiFunctional';

interface Row { id: Test; test: GlanceNode; out: GlanceNode; cases?: boolean }
interface Lane { id: 'human' | 'ai'; tone: 'brand' | 'green'; kicker: string; source: GlanceNode; hub: GlanceNode; rows: [Row, Row] }

const LANES: Lane[] = [
  {
    id: 'human', tone: 'brand', kicker: 'Real players',
    source: { icon: ic('people'), title: 'Testers play', desc: 'Recorder app, upload or CLI' },
    hub: { icon: ic('library'), title: 'Gameplay Library', desc: 'every session, one shelf' },
    rows: [
      {
        id: 'userTest',
        test: { icon: ic('userTest'), title: 'User Test', desc: 'free play → problems' },
        out: { icon: ic('report'), title: 'Findings with clips', desc: 'where players struggle' },
      },
      {
        id: 'functional', cases: true,
        test: { icon: ic('flaskDoc'), title: 'Functional Test', desc: 'your cases vs the recordings' },
        out: { icon: ic('check'), title: 'A verdict for every case', desc: 'with the clip that shows it' },
      },
    ],
  },
  {
    id: 'ai', tone: 'green', kicker: 'AI players',
    source: { icon: ic('upload'), title: 'Your build', desc: 'an APK, up to 500 MB' },
    hub: { icon: ic('nodes'), title: 'AI players', desc: 'install and play it' },
    rows: [
      {
        id: 'aiBehavioural',
        test: { icon: ic('aiPerson'), title: 'AI Behavioural Test', desc: 'AI personas play freely' },
        out: { icon: ic('report'), title: 'Findings by persona', desc: 'where the build blocks or loses them' },
      },
      {
        id: 'aiFunctional', cases: true,
        test: { icon: ic('aiDoc'), title: 'AI Functional Test', desc: 'AI players run your cases' },
        out: { icon: ic('check'), title: 'A verdict for every case', desc: "with the AI player's video" },
      },
    ],
  },
];

const LABEL = 'Testers play and their sessions go into the Gameplay Library, which User Test and Functional Test read. Your build goes to AI players, which run AI Behavioural Test and AI Functional Test. A test case sheet feeds both functional tests. User Test and AI Behavioural Test return findings with clips; the functional tests return a verdict for every case.';

/** The sheet of test cases the two functional tests read, shown on the test instead of a line. */
const cases = <><TIcon name="sheet" size={12} width={1.8} />test cases</>;

export function TestingMap({ highlight }: { highlight: Test }) {
  const tone = LANES.find(l => l.rows.some(r => r.id === highlight))!.tone;
  return (
    <div className={`gm ${tone}`} data-reveal="" role="img" aria-label={LABEL}>
      {LANES.map(lane => {
        const here = lane.rows.some(r => r.id === highlight);
        return (
          <div key={lane.id} className="gm-lane">
            <span className={here ? 'gm-k on' : 'gm-k'}>{lane.kicker}</span>
            <div className="gm-flow">
              <GlanceCard node={lane.source} step={0} state={here ? 'near' : undefined} />
              <GlanceLine step={0} on={here} />
              <GlanceCard node={lane.hub} step={1} state={here ? 'near' : undefined} />
              <i className={here ? 'gm-branch on' : 'gm-branch'} style={{ ['--step' as string]: 1 }}><b /><b /></i>
              <div className="gm-rows">
                {lane.rows.map(r => {
                  const on = r.id === highlight;
                  return (
                    <div key={r.id} className="gm-row">
                      <GlanceCard node={r.test} step={2} state={on ? 'on' : undefined} lead chip={r.cases ? cases : undefined} />
                      <GlanceLine step={2} on={on} />
                      <GlanceCard node={r.out} step={3} state={on ? 'on' : undefined} here={on} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
