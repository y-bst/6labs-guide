// Sample data for AI Behavioural Test: the Frost Festival run, 12 new players and 8 whales on v2.3.1.

export interface Persona {
  name: string;
  /** Short line next to the name. */
  note: string;
  /** Dot and bar colour. */
  color: string;
}

export const PERSONAS: Persona[] = [
  { name: 'Generic', note: 'no persona — plays the build as-is', color: '#818696' },
  { name: 'New player', note: 'day 0–3', color: '#16A34A' },
  { name: 'Core', note: 'day 7–30', color: '#0E99BF' },
  { name: 'Whale', note: 'top 2% spend', color: '#7B4CFF' },
  { name: 'Lapsed', note: 'returning after 14d', color: '#DB2777' },
  { name: 'Competitive', note: 'PvP-first, rally-heavy', color: '#F59E0B' },
  { name: 'Casual', note: 'short sessions, no spend', color: '#1770EF' },
  { name: 'Explorer', note: 'opens every screen', color: '#0E8F6B' },
];

export const NEW_PLAYER = PERSONAS[1];
export const WHALE = PERSONAS[3];

export const AIB_RUN = {
  name: 'Frost Festival',
  id: 'run #AIB-FROST',
  build: 'v2.3.1',
  length: '30 min',
  sessions: 20,
  /** Agents per persona. */
  mix: [[NEW_PLAYER, 12], [WHALE, 8]] as [Persona, number][],
  instructions: 'Focus on the Frost Festival event. Try the battle pass upgrade path if it appears.',
  generated: 'Sep 18',
};

export const AIB_TILES: { value: string; label: string; dot?: 'red' | 'amber' }[] = [
  { value: '2', label: 'personas' },
  { value: '20', label: 'sessions played' },
  { value: '10h', label: 'footage reviewed' },
  { value: '3', label: 'bugs', dot: 'red' },
  { value: '6', label: 'friction points', dot: 'amber' },
];

export const AIB_SUMMARY = '20 AI players played 30 min each on v2.3.1. 9 findings across 280 screens, ranked by how many agents hit them.';

export const AIB_CATEGORIES: { name: string; dot: 'red' | 'amber'; findings: number; sessions: number; blocking: number }[] = [
  { name: 'Bug — technical', dot: 'red', findings: 2, sessions: 9, blocking: 2 },
  { name: 'Bug — visual', dot: 'red', findings: 1, sessions: 4, blocking: 0 },
  { name: 'Friction — usability', dot: 'amber', findings: 3, sessions: 7, blocking: 0 },
  { name: 'Friction — flow', dot: 'amber', findings: 1, sessions: 4, blocking: 0 },
  { name: 'Friction — monetization', dot: 'amber', findings: 2, sessions: 3, blocking: 0 },
];

export interface AgentFinding {
  title: string;
  agents: number;
  severity: 'Blocking' | 'Disruptive' | 'Cosmetic';
  screen: string;
  /** Agents per persona who hit it. */
  split: [Persona, number, number][];
  text: string;
  recommendation: string;
}

export const AIB_FINDING: AgentFinding = {
  title: '“Upgrade Furnace” button unresponsive while tutorial hint is showing',
  agents: 16,
  severity: 'Blocking',
  screen: 'Tutorial › Furnace upgrade · step 4 of 11',
  split: [[NEW_PLAYER, 10, 12], [WHALE, 6, 8]],
  text: 'At tutorial step 4 the hint overlay sits over the Upgrade Furnace button, so taps do nothing until the overlay times out. Agents tapped 3 to 7 times before it responded, and 3 closed the app right there.',
  recommendation: 'Let the hint overlay pass taps through to the highlighted control, or dismiss the hint on the first tap of its target.',
};

/** One agent's session, shown on the video page. */
export const AGENT = {
  title: 'New player · agent 1 of 20',
  about: 'Day 0–3 · first session, no prior knowledge',
  screen: 5,
  screens: 14,
  time: '0:41',
  place: 'Tutorial › Furnace',
  saw: 'Tutorial overlay; a pointer highlights the Upgrade Furnace button.',
  reasoning: 'As a first-time player I follow the highlighted action.',
  did: 'Tap Upgrade Furnace',
  observed: 'Watched for 5 s · no change on screen',
  frames: ['0:12', '0:28', '0:41', '0:58', '1:24'],
};
