// "Testing at a glance": real players and AI players, the four tests, and what each returns,
// with the current guide's row boxed.

type Test = 'userTest' | 'functional' | 'aiBehavioural' | 'aiFunctional';

/** Top of each test's row. */
const ROW: Record<Test, number> = { userTest: 40, functional: 160, aiBehavioural: 330, aiFunctional: 450 };

const HUMAN = '#1770EF';
const AI = '#16A34A';
const SHEET = '#178F7C';

const TESTS: { id: Test; title: string; desc: string; out: string; outDesc: string; fill: string; stroke: string }[] = [
  { id: 'userTest', title: 'User Test', desc: 'free play → problems', out: 'Findings with clips', outDesc: 'where players struggle', fill: '#EAF2FE', stroke: HUMAN },
  { id: 'functional', title: 'Functional Test', desc: 'your cases vs the recordings', out: 'A verdict for every case', outDesc: 'with the clip that shows it', fill: '#E7F5F2', stroke: SHEET },
  { id: 'aiBehavioural', title: 'AI Behavioural Test', desc: 'AI personas play freely', out: 'Findings by persona', outDesc: 'where the build blocks or loses them', fill: '#E9F7EF', stroke: AI },
  { id: 'aiFunctional', title: 'AI Functional Test', desc: 'AI players run your cases', out: 'A verdict for every case', outDesc: "with the AI player's video", fill: '#E9F7EF', stroke: AI },
];

const LABEL = 'Testers play and their sessions go into the Gameplay Library, which User Test and Functional Test read. Your build goes to AI players, which run AI Behavioural Test and AI Functional Test. A test case sheet feeds both functional tests. User Test and AI Behavioural Test return findings with clips; the functional tests return a verdict for every case.';

export function TestingMap({ highlight }: { highlight: Test }) {
  const top = ROW[highlight];
  const node = (x: number, y: number, w: number, fill: string, stroke: string, extra: Record<string, string | number> = {}) => (
    <rect x={x} y={y} width={w} height="76" rx="18" fill={fill} stroke={stroke} {...extra} />
  );
  const text = (x: number, y: number, title: string, desc: string) => (
    <><text className="t" x={x} y={y + 33}>{title}</text><text className="d" x={x} y={y + 58}>{desc}</text></>
  );
  return (
    <svg viewBox="0 0 1450 560" role="img" aria-label={LABEL}>
      <rect x="640" y={top - 36} width="790" height="126" rx="22" fill="rgba(23,112,239,.05)" stroke="rgba(23,112,239,.4)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text className="k" x="660" y={top - 13}>THIS GUIDE</text>

      <g fill="none" strokeWidth="5" strokeLinecap="round">
        <path d="M264 138H330" stroke={HUMAN} />
        <path d="M570 138C615 138 615 78 660 78M570 138C615 138 615 198 660 198" stroke={HUMAN} />
        <path d="M264 428H330" stroke={AI} />
        <path d="M570 428C615 428 615 368 660 368M570 428C615 428 615 488 660 488" stroke={AI} />
        {TESTS.map(t => <path key={t.id} d={`M940 ${ROW[t.id] + 38}H1030`} stroke={t.stroke} />)}
      </g>
      <g fill="none" strokeWidth="3" strokeDasharray="8 8" strokeLinecap="round" stroke={SHEET}>
        <path d="M570 283C620 283 612 218 660 218" />
        <path d="M570 283C620 283 612 468 660 468" />
      </g>

      <g strokeWidth="2.5">
        {node(24, 100, 240, '#fff', HUMAN)}
        {node(330, 100, 240, '#fff', '#030D2D', { strokeWidth: 3 })}
        {node(24, 390, 240, '#fff', AI)}
        {node(330, 390, 240, '#fff', AI, { strokeWidth: 3 })}
        {node(330, 245, 240, '#fff', SHEET, { strokeDasharray: '7 6' })}
        {TESTS.map(t => <g key={t.id}>{node(660, ROW[t.id], 280, t.fill, t.stroke, { strokeWidth: 3 })}{node(1030, ROW[t.id], 380, '#fff', t.stroke)}</g>)}
      </g>
      <g textAnchor="middle">
        {text(144, 100, 'Testers play', 'Recorder app, upload or CLI')}
        {text(450, 100, 'Gameplay Library', 'every session, one shelf')}
        {text(144, 390, 'Your build', 'an APK, up to 500 MB')}
        {text(450, 390, 'AI players', 'install and play it')}
        {text(450, 245, 'Test case sheet', 'CSV or XLSX, one row per case')}
        {TESTS.map(t => <g key={t.id}>{text(800, ROW[t.id], t.title, t.desc)}{text(1220, ROW[t.id], t.out, t.outDesc)}</g>)}
      </g>
      <g className="g">
        <text x="24" y="86">REAL PLAYERS</text>
        <text x="24" y="376">AI PLAYERS</text>
      </g>
    </svg>
  );
}
