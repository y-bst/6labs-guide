// "Intelligence at a glance": data → agents → what you get, with the current guide's part boxed.

type Part = 'oracle' | 'radiologist' | 'context';

/** The dashed box around this guide's part, and where its "THIS GUIDE" label sits. */
const BOX: Record<Part, { x: number; y: number; w: number; labelY: number }> = {
  oracle: { x: 430, y: 222, w: 1010, labelY: 248 },
  radiologist: { x: 430, y: 26, w: 680, labelY: 54 },
  context: { x: 10, y: 222, w: 318, labelY: 248 },
};

const LABEL: Record<Part, string> = {
  oracle: 'Gameplay data from BlueStacks, YouTube, the SDK or the Gameplay Library goes to Radiologist, which finds matching sessions. Your context, documents and connectors, goes to both agents. Oracle asks Radiologist for evidence and returns an answer with numbers and source videos, which you can follow up on or export.',
  radiologist: 'Gameplay data from BlueStacks, YouTube, the SDK or the Gameplay Library goes to Radiologist, which finds matching sessions with a summary and every event. Your context, documents and connectors, goes to both agents. Oracle asks Radiologist for evidence and returns an answer with numbers and source videos.',
  context: 'Your context, documents and connectors, goes to both agents. Gameplay data from BlueStacks, YouTube, the SDK or the Gameplay Library goes to Radiologist. Oracle asks Radiologist for evidence and returns an answer with numbers and source videos.',
};

export function IntelMap({ highlight }: { highlight: Part }) {
  const box = BOX[highlight];
  const node = (x: number, y: number, w: number, fill = '#fff', stroke = 'var(--ink)', strong = false) => (
    <rect x={x} y={y} width={w} height="76" rx="18" fill={fill} stroke={stroke} strokeWidth={strong ? 3 : undefined} />
  );
  const text = (x: number, y: number, title: string, desc: string) => (
    <><text className="t" x={x} y={y}>{title}</text><text className="d" x={x} y={y + 25}>{desc}</text></>
  );
  return (
    <svg viewBox="0 0 1450 420" role="img" aria-label={LABEL[highlight]}>
      <rect x={box.x} y={box.y} width={box.w} height="150" rx="22" fill="rgba(23,112,239,.05)" stroke="rgba(23,112,239,.4)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text className="k" x={box.x + 20} y={box.labelY}>THIS GUIDE</text>
      <g fill="none" strokeWidth="5" strokeLinecap="round">
        <path d="M314 108H450" stroke="#7B4CFF" />
        <path d="M314 300H450" stroke="var(--ink)" />
        <path d="M314 300C382 300 382 108 450 108" stroke="var(--ink)" />
        <path d="M680 108H840" stroke="#7B4CFF" />
        <path d="M680 300H840" stroke="#0E99BF" />
        <path d="M1090 300H1170" stroke="#0E99BF" />
        <path d="M565 150V258" stroke="#0E99BF" strokeWidth="3" strokeDasharray="8 8" />
      </g>
      {/* sits above the Oracle box, so it moves up when that box is highlighted */}
      <text className="f" x="582" y={highlight === 'oracle' ? 208 : 218}>Oracle asks Radiologist</text>
      <g strokeWidth="2.5">
        {node(24, 70, 290)}
        {highlight === 'context' ? node(24, 262, 290, '#EEF6F5', '#00A393', true) : node(24, 262, 290)}
        {node(450, 70, 230, '#F4F0FF', '#7B4CFF', true)}
        {node(450, 262, 230, '#E8F6FA', '#0E99BF', true)}
        {node(840, 70, 250, '#fff', '#7B4CFF')}
        {node(840, 262, 250, '#fff', '#0E99BF')}
        {node(1170, 262, 256, '#fff', '#0E99BF')}
      </g>
      <g textAnchor="middle">
        {text(169, 103, 'Gameplay data', 'BlueStacks, YouTube, SDK, Library')}
        {text(169, 295, 'Your context', 'Documents · Connectors')}
        {text(565, 103, 'Radiologist', 'finds exact moments')}
        {text(565, 295, 'Oracle', 'answers questions')}
        {text(965, 103, 'Matching sessions', 'summary + every event')}
        {text(965, 295, 'Answer', 'numbers + source videos')}
        {text(1298, 295, 'Follow up · export', 'PDF, image or slides')}
      </g>
      <g className="g">
        <text x="24" y="404">DATA</text>
        <text x="450" y="404">AGENTS</text>
        <text x="840" y="404">WHAT YOU GET</text>
      </g>
    </svg>
  );
}
