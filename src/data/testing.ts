// Sample data shown on the Testing screens (Gameplay Library, User Test).

export type VideoSource = 'Recorder app' | 'Browser upload' | 'CLI';

export interface Video {
  title: string;
  source: VideoSource;
  /** Thumbnail gradient, g1–g6. */
  g: 1 | 2 | 3 | 4 | 5 | 6;
  duration?: string;
  /** Who added it. */
  who: string;
  /** Avatar initials; without them the avatar is a plain gradient dot. */
  initials?: string;
  date?: string;
  /** System tag, e.g. "Build V2.2". */
  batch?: string;
  /** A tag the user added, or true for the "+ Add tags" button. */
  tag?: string | true;
}

/* ---------- Gameplay Library guide ---------- */

/** The library page itself. */
export const LIBRARY: Video[] = [
  { title: 'ut-0912 — first session walkthrough.mp4', source: 'Recorder app', g: 1, duration: '12:04', who: 'Elena Roth', initials: 'ER', date: 'Sep 17, 2026', batch: 'Build V2.2', tag: 'onboarding' },
  { title: 'ut-0911 — first session.mp4', source: 'Recorder app', g: 4, duration: '9:41', who: 'Arjun Mehta', initials: 'AM', date: 'Sep 17, 2026', batch: 'Build V2.2', tag: true },
  { title: 'ut-0910 — tutorial complete.mp4', source: 'Browser upload', g: 3, duration: '8:20', who: 'You', initials: 'JW', date: 'Sep 17, 2026', batch: 'Build V2.2', tag: 'onboarding' },
  { title: 'ut-0908 — returning player.mp4', source: 'CLI', g: 2, duration: '15:22', who: 'Dan Whitfield', initials: 'DW', date: 'Sep 16, 2026', batch: 'Build V2.1', tag: 'frost-festival' },
  { title: 'ut-0904 — first session.mp4', source: 'Recorder app', g: 6, duration: '11:18', who: 'Elena Roth', initials: 'ER', date: 'Sep 16, 2026', batch: 'Build V2.2' },
  { title: 'ut-0899 — tutorial exit.mp4', source: 'CLI', g: 5, duration: '7:52', who: 'Mohit Sharma', initials: 'MS', date: 'Sep 16, 2026', batch: 'Build V2.1' },
];

/** The small library page behind the upload dialog. */
export const LIBRARY_MINI: Video[] = [
  { title: 'ut-0912 — first session.mp4', source: 'Recorder app', g: 1, who: 'Elena Roth', initials: 'ER' },
  { title: 'ut-0911 — first session.mp4', source: 'Recorder app', g: 4, who: 'Arjun Mehta', initials: 'AM' },
  { title: 'ut-0910 — tutorial.mp4', source: 'Browser upload', g: 3, who: 'You', initials: 'JW' },
  { title: 'ut-0908 — returning player.mp4', source: 'CLI', g: 2, who: 'Dan Whitfield', initials: 'DW' },
  { title: 'ut-0904 — first session.mp4', source: 'Recorder app', g: 6, who: 'Elena Roth', initials: 'ER' },
  { title: 'ut-0899 — tutorial exit.mp4', source: 'CLI', g: 5, who: 'Mohit Sharma', initials: 'MS' },
];

/** Videos landing in the library in the "every source, one library" animation. */
export const INTAKE: Video[] = [
  { title: 'ut-0912 — first session.mp4', source: 'Recorder app', g: 1, who: 'Elena Roth', initials: 'ER' },
  { title: 'ut-0910 — tutorial.mp4', source: 'Browser upload', g: 3, who: 'You', initials: 'JW' },
  { title: 'ut-0908 — returning.mp4', source: 'CLI', g: 2, who: 'Dan Whitfield', initials: 'DW' },
  { title: 'ut-0904 — first session.mp4', source: 'Recorder app', g: 6, who: 'Arjun Mehta', initials: 'AM' },
  { title: 'ut-0901 — store browse.mp4', source: 'Browser upload', g: 4, who: 'You', initials: 'JW' },
  { title: 'ut-0899 — tutorial exit.mp4', source: 'CLI', g: 5, who: 'Mohit Sharma', initials: 'MS' },
];

/* ---------- User Test guide ---------- */

/** The 10-session Build V2.2 playtest (first six shown). */
export const PLAYTEST: Video[] = [
  { title: 'ut-0912 — first session.mp4', source: 'Recorder app', g: 1, duration: '12:04', who: 'tester01@studio.com', date: 'Sep 17' },
  { title: 'ut-0911 — first session.mp4', source: 'Recorder app', g: 2, duration: '9:41', who: 'tester02@studio.com', date: 'Sep 17' },
  { title: 'ut-0910 — tutorial complete.mp4', source: 'Browser upload', g: 3, duration: '8:20', who: 'Elena Roth', date: 'Sep 17' },
  { title: 'ut-0904 — first session.mp4', source: 'Recorder app', g: 6, duration: '11:18', who: 'tester03@studio.com', date: 'Sep 16' },
  { title: 'ut-0876 — first session.mp4', source: 'CLI', g: 4, duration: '13:12', who: 'Dan Whitfield', date: 'Sep 16' },
  { title: 'ut-0887 — first session.mp4', source: 'CLI', g: 5, duration: '10:05', who: 'Mohit Sharma', date: 'Sep 16' },
];

export const RUN = {
  name: 'Build V2.2 — Sep 17',
  id: 'run #UT-0412',
  videos: 10,
  context: 'Onboarding flow v3',
  generated: 'Sep 17, 2026',
  question: 'Which testers quit before finishing onboarding?',
};

export const TILES: { value: string; label: string; dot?: 'red' | 'amber' }[] = [
  { value: '10', label: 'sessions analysed' },
  { value: '2h 14m', label: 'footage reviewed' },
  { value: '3', label: 'bugs', dot: 'red' },
  { value: '4', label: 'friction points', dot: 'amber' },
];

export const CATEGORIES: { name: string; dot: 'red' | 'amber'; findings: number; sessions: number; blocking: number }[] = [
  { name: 'Bug — functional', dot: 'red', findings: 1, sessions: 7, blocking: 1 },
  { name: 'Bug — visual', dot: 'red', findings: 1, sessions: 4, blocking: 1 },
  { name: 'Bug — technical', dot: 'red', findings: 1, sessions: 3, blocking: 0 },
  { name: 'Friction — usability', dot: 'amber', findings: 2, sessions: 6, blocking: 0 },
  { name: 'Friction — struggle', dot: 'amber', findings: 2, sessions: 5, blocking: 0 },
];

export interface TopFindingData {
  title: string;
  text: string;
  severity: 'Blocking' | 'Disruptive';
  kind: 'Bug' | 'Friction';
  screen: string;
  sessions: number;
}

export const TOP_FINDINGS: TopFindingData[] = [
  { title: '“Upgrade Furnace” button doesn\'t respond while the hint shows', text: 'The hint overlay blocks the tap; testers tap 3–7 times before it works.', severity: 'Blocking', kind: 'Bug', screen: 'Tutorial › Furnace upgrade', sessions: 7 },
  { title: 'Reward dialog opens on top of the chapter-complete popup', text: 'Two dialogs stack; the close button sits off-screen on tall phones.', severity: 'Blocking', kind: 'Bug', screen: 'Chapter 1 › Completion', sessions: 4 },
  { title: 'Players go back and forth looking for Alliance', text: 'Testers open Alliance, leave, and return within 15 seconds.', severity: 'Disruptive', kind: 'Friction', screen: 'Post-tutorial › Alliance', sessions: 4 },
];

export const SUMMARY = {
  takeaway: 'The Upgrade Furnace button stalled 7 of 10 sessions — the biggest problem in this build. Most other issues are friction players recover from after the tutorial.',
  report: '7 of 10 sessions hit the unresponsive Upgrade Furnace button at tutorial step 4. Two findings blocked progress, both in the tutorial or at Chapter 1 completion; the other five are friction players recover from.',
};

/** Answer to RUN.question: testers who quit, when, and on which screen. */
export const QUITS: [tester: string, time: string, screen: string][] = [
  ['tester_06', '03:57', 'Tutorial › Furnace upgrade'],
  ['tester_10', '07:44', 'Chapter 1 › Completion'],
  ['tester_02', '11:40', 'Chapter 1 › Completion'],
];
export const QUIT_SUMMARY = '3 of 10 testers quit before finishing onboarding — all of them at the Furnace button or the Chapter 1 reward dialog.';
