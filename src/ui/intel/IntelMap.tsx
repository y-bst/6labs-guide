// "Intelligence at a glance": what you put in goes to both agents, Oracle asks Radiologist for
// its evidence, and each agent gives something back. The current guide's part is the only one
// in colour; everything else greys out.
import { GlanceCard, GlanceLine, type GlanceNode, type GlanceState } from '../GlanceMap';
import { Icon, type IconName } from '../Icon';

type Part = 'oracle' | 'radiologist' | 'context';
type CardId = 'data' | 'context' | 'radiologist' | 'oracle' | 'sessions' | 'answer' | 'export';

const ic = (name: IconName) => <Icon name={name} size={18} />;

const CARDS: Record<CardId, GlanceNode> = {
  data: { icon: ic('playlist'), title: 'Gameplay data', desc: 'BlueStacks, YouTube, SDK, Library' },
  context: { icon: ic('docs'), title: 'Your context', desc: 'Documents · Connectors' },
  radiologist: { icon: ic('radio'), title: 'Radiologist', desc: 'finds exact moments' },
  oracle: { icon: ic('oracle'), title: 'Oracle', desc: 'answers questions' },
  sessions: { icon: ic('events'), title: 'Matching sessions', desc: 'summary + every event' },
  answer: { icon: ic('sparkle'), title: 'Answer', desc: 'numbers + source videos' },
  export: { icon: ic('export'), title: 'Follow up · export', desc: 'PDF, image or slides' },
};

/**
 * What this guide is about: `lead` carries its name, `path` is the whole flow it belongs to.
 * Oracle stops at Oracle: the lit "asks Radiologist" link is what shows where its evidence
 * comes from, so the bottom row stays the only flow in colour.
 */
const FOCUS: Record<Part, { lead: CardId; path: CardId[]; tone: string; asks: boolean }> = {
  radiologist: { lead: 'radiologist', path: ['data', 'context', 'radiologist', 'sessions'], tone: 'violet', asks: false },
  oracle: { lead: 'oracle', path: ['data', 'context', 'oracle', 'answer', 'export'], tone: 'teal', asks: true },
  context: { lead: 'context', path: ['context', 'radiologist', 'oracle'], tone: 'jade', asks: false },
};

const LABEL: Record<Part, string> = {
  oracle: 'Gameplay data from BlueStacks, YouTube, the SDK or the Gameplay Library, and your context — documents and connectors — go to both agents. Oracle asks Radiologist for evidence and returns an answer with numbers and source videos, which you can follow up on or export.',
  radiologist: 'Gameplay data from BlueStacks, YouTube, the SDK or the Gameplay Library, and your context — documents and connectors — go to both agents. Radiologist finds matching sessions with a summary and every event. Oracle asks Radiologist for evidence and returns an answer.',
  context: 'Your context — documents and connectors — goes to both agents, together with gameplay data from BlueStacks, YouTube, the SDK or the Gameplay Library. Radiologist finds matching sessions; Oracle asks Radiologist for evidence and returns an answer.',
};

export function IntelMap({ highlight }: { highlight: Part }) {
  const { lead, path, tone, asks } = FOCUS[highlight];
  const on = (id: CardId) => path.includes(id);
  const state = (id: CardId): GlanceState => (id === lead ? 'on' : on(id) ? 'near' : undefined);
  const busOn = (on('data') || on('context')) && (on('radiologist') || on('oracle'));
  const card = (id: CardId, step: number, col: number, row: number) => (
    <GlanceCard key={id} node={CARDS[id]} step={step} state={state(id)} lead here={id === lead} style={{ gridColumn: col, gridRow: row }} />
  );
  const head = (label: string, col: number, lit: boolean) => (
    <span key={label} className={lit ? 'gm-k on' : 'gm-k'} style={{ gridColumn: col }}>{label}</span>
  );
  return (
    <div className={`gm ${tone}`} data-reveal="" role="img" aria-label={LABEL[highlight]}>
      <div className="gm-intel">
        <div className="gm-heads">
          {head('What goes in', 1, on('data') || on('context'))}
          {head('Agents', 3, on('radiologist') || on('oracle'))}
          {head('What you get', 5, on('sessions') || on('answer'))}
        </div>
        <div className="gm-grid">
          {card('data', 0, 1, 1)}
          {card('context', 0, 1, 2)}

          {/* both inputs feed both agents */}
          <i className={busOn ? 'gm-bus on' : 'gm-bus'} style={{ gridColumn: 2, gridRow: '1 / 3', ['--step' as string]: 0 }}>
            <i className={on('data') ? 'l t on' : 'l t'} />
            <i className={on('context') ? 'l b on' : 'l b'} />
            <i className={on('radiologist') ? 'r t on' : 'r t'} />
            <i className={on('oracle') ? 'r b on' : 'r b'} />
          </i>

          <div className="gm-agents">
            {card('radiologist', 1, 1, 1)}
            {card('oracle', 1, 1, 2)}
            <div className={asks ? 'gm-ask on' : 'gm-ask'}>
              <span><Icon name="up" size={11} />Oracle asks Radiologist</span>
            </div>
          </div>

          <GlanceLine step={2} on={on('radiologist') && on('sessions')} style={{ gridColumn: 4, gridRow: 1 }} />
          <GlanceLine step={2} on={on('oracle') && on('answer')} style={{ gridColumn: 4, gridRow: 2 }} />
          {card('sessions', 2, 5, 1)}
          {card('answer', 2, 5, 2)}
          <GlanceLine step={3} on={on('answer') && on('export')} style={{ gridColumn: 6, gridRow: 2 }} />
          {card('export', 3, 7, 2)}
        </div>
      </div>
    </div>
  );
}
