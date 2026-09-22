// Sample data shown on the Intelligence screens. One place, so the same session or
// question looks identical in every guide. The game is Free Fire, as in the prototype.

export const HISTORY = [
  'Show me players who got booyah',
  'Where are players getting stuck in the tutorial?',
  'Show me players who played the most matches',
  'Show me players with the best squad win rate',
];

/** Radiologist searches for a moment, so its prompts are things to look for, not questions. */
export const PROMPTS_RADIOLOGIST = [
  'Players asking their guild for help.',
  'Shop visits that end without a purchase.',
  'Repeated deaths in the same place.',
  'Long waits in the lobby before a match.',
];

export const PROMPTS = [
  'Show the top five most intense close-range fights.',
  "Summarize the player's rotations: drop spot, key moves, final zone path.",
  'List all loot and upgrade moments and gloo wall usage.',
  'Where did the player lose the most HP, and what caused it?',
];

/* ---------- agents & pages ---------- */

export type PageId = 'oracle' | 'radiologist' | 'uploads' | 'connectors';

export const PAGES: Record<PageId, { tile: 'or' | 'ra' | 'dc' | 'cn'; icon: 'oracle' | 'radio' | 'docs' | 'conn'; title: string; sub: string }> = {
  oracle: { tile: 'or', icon: 'oracle', title: 'Oracle', sub: 'Ask complex questions about player behavior across sessions and cohorts' },
  radiologist: { tile: 'ra', icon: 'radio', title: 'Radiologist', sub: 'Examine gameplay moment-by-moment with video-backed evidence' },
  uploads: { tile: 'dc', icon: 'docs', title: 'Uploads', sub: 'Upload game documents to give AI agents richer context and sharper insights' },
  connectors: { tile: 'cn', icon: 'conn', title: 'Connectors', sub: 'Connect your tools so 6labs agents can push insights and pull data automatically.' },
};

export const PLACEHOLDERS = {
  home: 'Ask Oracle anything about your game data…',
  oracle: 'Type in a prompt or select a suggested prompt. e.g., Summarize the video and provide timecode',
  radiologist: 'Search for actions, objects and events in your game…',
  followUp: 'Ask a follow-up question…',
};

/* ---------- the booyah question (Oracle) ---------- */

export interface ThinkingStep {
  title: string;
  time: string;
  text: string;
  hit?: [strong: string, rest: string];
  /** Still running: spinner instead of a check. */
  running?: boolean;
}

export const BOOYAH = {
  question: 'Show me players who got booyah',
  steps: [
    { title: 'Understanding your question', time: '1.8s', text: 'Booyah finishes, and what the winners did differently' },
    { title: 'Recalling context', time: '1.0s', text: 'No prior context found in this thread' },
    { title: 'Building reasoning plan', time: '0.7s', text: '3 reasoning paths: landing and rotation, squad play, final circle' },
    { title: 'Querying your data', time: '1.3s', text: 'Your warehouse tables, joined with BlueStacks session records', hit: ['412 booyah finishes found', ' — across 13,290 ranked matches'] },
    { title: 'Evaluating relevance', time: '1.0s', text: "Each finish compared with the matches that didn't win", hit: ['412 winning matches', " vs. 12,878 that didn't win"] },
    { title: 'Generating insights', time: '1.0s', text: 'What winners share, ranked by how often it happens' },
    { title: 'Validating response', time: '2.4s', text: 'Confirming accuracy against source data…', running: true },
  ] satisfies ThinkingStep[],
  sources: ['4:38', '5:02', '3:57'],
  credits: 20,
  related: [
    'Compare booyah squads against squads that placed top 5 but did not win',
    'Which weapon loadouts appear most often in booyah finishes?',
    'Do booyah players return the next day at a higher rate?',
  ],
};

/* ---------- Radiologist sessions ---------- */

export interface Session {
  id: string;
  duration: string;
  date: string;
  desc?: string;
  /** Tags added by AI (shown with ✦). */
  ai?: string[];
  /** Tags from the upload or run. */
  tags?: string[];
}

export const SESSIONS: Record<string, Session> = {
  '2851': { id: '2851', duration: '4:05', date: '10/12/25' },
  '2850': { id: '2850', duration: '6:12', date: '10/12/25', tags: ['Ranked'] },
  '2849': { id: '2849', duration: '3:48', date: '10/12/25' },
  '2847': { id: '2847', duration: '4:05', date: '10/11/25', desc: 'Player opened the Guild menu between matches and answered two help requests before queueing.', ai: ['items looted', 'shop opened'], tags: ['Smoke test'] },
  '2846': { id: '2846', duration: '4:05', date: '10/11/25', desc: 'A full guild loop in one session: guild page, then Help Requests, cleared one member at a time.', ai: ['menu hesitation', 'fast completion'], tags: ['Smoke test'] },
  '2845': { id: '2845', duration: '3:12', date: '10/11/25', desc: 'Player asked the guild for help after dying twice in the same spot, then tried again.', ai: ['repeated death'], tags: ['Manual', 'bug-repro'] },
  '2844': { id: '2844', duration: '5:40', date: '10/11/25', desc: 'A long lobby wait spent in the Guild tab, reading help requests without answering them.', ai: ['long queue', 'lobby idle'], tags: ['Manual'] },
  '2843': { id: '2843', duration: '7:03', date: '10/11/25', desc: 'Squad match. The player checked guild requests mid-session, right before the game crashed.', ai: ['game crashed'], tags: ['Ranked', 'Squad'] },
  '2842': { id: '2842', duration: '4:26', date: '10/11/25', desc: 'Solo match. The player cleared guild help requests in the lobby, then looted a supply crate.', ai: ['items looted'], tags: ['Ranked', 'Solo'] },
};

export const sessions = (...ids: string[]) => ids.map(id => SESSIONS[id]);

export type EventTone = 'teal' | 'blue' | 'red' | 'violet' | 'amber' | 'green';

export interface GameEvent {
  type: string;
  tone: EventTone;
  time: string;
  /** Position on the timeline, as a percentage of the recording. */
  at: number;
  text: string;
}

/** Everything detected in session #2846. */
export const EVENTS: GameEvent[] = [
  { type: 'Customization', tone: 'teal', time: '0:15', at: 6, text: 'Player customized their loadout' },
  { type: 'Match Start', tone: 'blue', time: '0:21', at: 9, text: 'Match started' },
  { type: 'Loading Error', tone: 'red', time: '0:48', at: 20, text: 'Player stuck at loading screen' },
  { type: 'Kill', tone: 'violet', time: '1:30', at: 37, text: 'Player eliminated an opponent with a headshot' },
  { type: 'Loot', tone: 'amber', time: '2:05', at: 51, text: 'Player looted a supply crate near the warehouse' },
  { type: 'Winner', tone: 'green', time: '3:45', at: 92, text: 'Player got the booyah' },
];

export interface Tile { label: string; value: string; wide?: boolean }

/** What the side panel and detail page show for session #2846. */
export const SESSION_DETAIL = {
  why: {
    facts: [['Game mode', 'Guild & Progression'], ['Session length', '899 seconds'], ['Account level', '92'], ['Ad to gameplay', 'Mainly gameplay']] as [string, string][],
    text: 'This clip shows a player working through a full guild loop in a single session. They open the Guild menu from the right-hand panel, review the guild page, then move into Help Requests and clear the queue one member at a time.',
  },
  summary: 'The AI player cleared six guild help requests, pausing on the Guild menu, then played one full match at a relaxed pace and won it.',
  instructions: { given: 'GIVEN TO AI PLAYER · CASUAL', text: 'Act as a returning casual player. Open the Guild menu and answer every pending help request, then play one full match at a relaxed pace.' },
  info: [
    { label: 'Duration', value: '4:05' },
    { label: 'Region', value: 'USA' },
    { label: 'Platform', value: 'AI-Cloud' },
    { label: 'Game Mode', value: 'Battle Royale' },
  ] as Tile[],
  stats: [
    { value: '10', label: 'Eliminations', good: true },
    { value: '2', label: 'Deaths', good: false },
    { value: 'Winner', label: 'Placement', good: true },
  ],
  profile: {
    name: '6labs AI Player', kind: 'AI AGENT', style: 'Casual',
    tiles: [{ label: 'Build', value: 'v2.3.1' }, { label: 'Runs', value: '12 Sessions' }, { label: 'Region', value: 'AI-Cloud' }, { label: 'Playstyle', value: 'Casual' }] as Tile[],
  },
};

/** The player's other sessions, grouped by play session, for the detail page playlist. */
export const PLAYLIST: { label: string; items: { id: string; tag: string; note?: string }[] }[] = [
  { label: 'SESSION · OCT 11 · 58 MIN', items: [{ id: '2847', tag: 'Agent run' }, { id: '2846', tag: 'Agent run', note: 'playing' }, { id: '2845', tag: 'Manual' }, { id: '2844', tag: 'Manual' }] },
  { label: 'SESSION · OCT 11 · 34 MIN', items: [{ id: '2843', tag: 'Ranked' }, { id: '2842', tag: 'Ranked' }] },
  { label: 'SESSION · OCT 12 · 128 MIN', items: [{ id: '2850', tag: 'Ranked' }] },
];

/* ---------- Documents ---------- */

export type FileKind = 'doc' | 'sheet' | 'img';

export interface UploadFile {
  name: string;
  kind: FileKind;
  meta: string;
  description: string;
}

export const FILES: UploadFile[] = [
  { name: 'Game design doc v4.pdf', kind: 'doc', meta: '2.4 MB · Sep 8, 2026', description: 'Full design intent for Build V2.2 — systems, progression and the tutorial beats.' },
  { name: 'Economy balance sheet.xlsx', kind: 'sheet', meta: '840 KB · Sep 8, 2026', description: 'Soft and hard currency sinks per level band, with the intended sink/source ratio.' },
  { name: 'Tutorial storyboard.png', kind: 'img', meta: '1.1 MB · Sep 8, 2026', description: 'Intended first-session flow, screen by screen, as handed to the art team.' },
];

/* ---------- Connectors ---------- */

export type BrandId = 'bigquery' | 'snowflake' | 'appsflyer' | 'jira' | 'slack' | 'discord' | 'facebook';

export interface Connector {
  brand: BrandId;
  /** Which way data flows: in to 6labs, or out to the team. */
  kind: 'in' | 'out';
  desc: string;
  /** Owners' initials, for active connectors. */
  owners?: ('A' | 'Y')[];
}

export const ACTIVE_CONNECTORS: Connector[] = [
  { brand: 'bigquery', kind: 'in', owners: ['A', 'Y'], desc: 'Pull warehouse tables into Oracle so agents can answer questions against your live analytics — campaigns, monetization, retention, anything you ETL into BQ.' },
  { brand: 'snowflake', kind: 'in', owners: ['A'], desc: 'Connect your Snowflake warehouse with secure key-pair auth — no passwords exchanged. Oracle queries your live tables read-only.' },
];

export const AVAILABLE_CONNECTORS: Connector[] = [
  { brand: 'appsflyer', kind: 'in', desc: 'Ingest attribution and campaign data to detect UA fraud, verify installs, and protect ad spend across all your campaigns.' },
  { brand: 'jira', kind: 'out', desc: "Automatically create and track issues from agent findings. Turn gameplay insights into tickets in your team's workflow." },
  { brand: 'slack', kind: 'out', desc: "Push real-time alerts, weekly digests, and video evidence directly to your team's Slack channels." },
  { brand: 'discord', kind: 'out', desc: 'Send formatted alerts and gameplay reports to your Discord server.' },
  { brand: 'facebook', kind: 'in', desc: 'Pull campaign performance and creative metrics to compare ad spend with in-game behaviour.' },
];

export const COLUMNS: { name: string; type: string; desc?: string }[] = [
  { name: 'guid', type: 'STRING', desc: 'Unique user or device GUID' },
  { name: 'app_pkg', type: 'STRING', desc: 'Name of the app that was clicked or launched' },
  { name: 'created_at', type: 'TIMESTAMP', desc: 'Event time in UTC when the click was recorded' },
  { name: 'user_state', type: 'STRING' },
  { name: 'app_type', type: 'STRING' },
];
