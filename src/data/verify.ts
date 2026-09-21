// Sample data for test-case verification: Functional Test (recordings) and AI Functional Test (AI players).
// One set of numbers everywhere: 1,186 + 31 + 12 + 18 = 1,247 cases ran, of 1,956 in the file.

export type Outcome = 'pass' | 'failed' | 'review' | 'nv';

export const OUTCOME: Record<Outcome, { label: string; tone: string }> = {
  pass: { label: 'Pass', tone: 'p' },
  failed: { label: 'Failed', tone: 'f' },
  review: { label: 'Need review', tone: 'r' },
  nv: { label: 'Not verified', tone: 'n' },
};

export const VERIFY = {
  file: 'regression-suite.xlsx',
  inFile: '1,956',
  ran: '1,247',
  recordings: 18,
  passRate: 95,
  coverage: 64,
  unreached: 709,
  counts: { pass: '1,186', failed: '31', review: '12', nv: '18' } as Record<Outcome, string>,
  /** The same counts as plain numbers, for run history chips. */
  chips: [1186, 31, 12, 18] as [number, number, number, number],
  /** Stacked bar widths, % of the cases that ran. */
  bar: [95.1, 2.5, 1, 1.4],
};

export interface Case {
  id: string;
  title: string;
  category: string;
  path: string;
  reason: string;
  outcome: Outcome;
}

/** First page of the case list, in file order. */
export const CASES: Case[] = [
  { id: 'TC-8889', title: 'Privacy notice close button exits with a toast', category: 'Startup notices', path: 'Launch › First run', reason: 'Game closed with no toast shown.', outcome: 'failed' },
  { id: 'TC-8810', title: 'Age-14 popup is not shown in non-KR locales', category: 'Startup notices', path: 'Launch › First run', reason: 'Popup shown where the case requires it be suppressed.', outcome: 'failed' },
  { id: 'TC-8821', title: 'Game Center login restores the existing account', category: 'Title screen', path: 'Launch › Title screen', reason: 'Account restored, but a duplicate profile was created.', outcome: 'review' },
  { id: 'TC-8898', title: 'Skill cooldown prevents an immediate second use', category: 'Skills', path: 'Combat › Skills', reason: 'Cooldown enforced correctly.', outcome: 'pass' },
  { id: 'TC-8822', title: 'Revive item cannot be used twice in one encounter', category: 'Encounter', path: 'Combat › Encounter', reason: 'Second revive was accepted.', outcome: 'failed' },
  { id: 'TC-8839', title: 'Combat rewards match the listed drop table', category: 'Encounter', path: 'Combat › Encounter', reason: 'Only two clears present — cannot establish a drop table.', outcome: 'review' },
  { id: 'TC-1102', title: 'Alliance join request is sent', category: 'Alliance', path: 'Post-tutorial › Alliance', reason: 'Request sent and acknowledged.', outcome: 'pass' },
  { id: 'TC-86', title: 'Battle Pass premium purchase', category: 'Store', path: 'Store › Purchase', reason: 'Purchase confirmed but entitlement not granted.', outcome: 'failed' },
  { id: 'TC-14', title: 'Furnace upgrade from tutorial hint', category: 'Progression', path: 'Tutorial › Furnace', reason: 'Button unresponsive until the hint overlay times out.', outcome: 'failed' },
  { id: 'TC-15', title: 'Daily quest reset at 00:00 UTC', category: 'Progression', path: 'Systems › Daily', reason: 'Reset time could not be reached in the session.', outcome: 'nv' },
  { id: 'TC-81', title: 'Complete the tutorial on a fresh install', category: 'Onboarding', path: 'Launch › First run', reason: 'Completed cleanly.', outcome: 'pass' },
  { id: 'TC-19', title: 'Leave alliance during rally', category: 'Alliance', path: 'Alliance › Rally', reason: 'Left mid-rally; state after leaving unclear.', outcome: 'review' },
];

/** The case navigator in the case detail: categories with their cases. */
export const RAIL: [category: string, cases: [id: string, title: string, outcome: Outcome][]][] = [
  ['Startup notices', [['TC-8889', 'Privacy notice close button exits with a toast', 'failed'], ['TC-8810', 'Age-14 popup is not shown in non-KR locales', 'failed']]],
  ['Title screen', [['TC-8821', 'Game Center login restores the existing account', 'review']]],
  ['Skills', [['TC-8898', 'Skill cooldown prevents an immediate second use', 'pass'], ['TC-8896', 'Hero swap mid-encounter keeps the accumulated rage', 'pass']]],
  ['Progression', [['TC-14', 'Furnace upgrade from tutorial hint', 'failed'], ['TC-15', 'Daily quest reset at 00:00 UTC', 'nv']]],
];

export interface CaseDetail {
  id: string;
  title: string;
  crumb: string;
  clip: string;
  duration: string;
  precondition: string;
  expected: string;
  outcome: Outcome;
  result: string;
  steps: [step: string, time: string][];
  /** Position in the list, e.g. "9 of 1,247". */
  position: string;
}

/** Functional Test: a tester's recording. */
export const CASE_FT: CaseDetail = {
  id: 'TC-14', title: 'Furnace upgrade from tutorial hint', crumb: 'Progression · Tutorial › Furnace',
  clip: '06:41–07:12', duration: '0:31',
  precondition: 'Tutorial reached the Furnace upgrade step',
  expected: 'The upgrade button responds as soon as the hint points at it.',
  outcome: 'failed', result: 'Button unresponsive until the hint overlay times out.',
  steps: [['Tap Upgrade while the hint pointer is showing', '06:41'], ['Tap again after the overlay clears', '06:58']],
  position: '9 of 1,247',
};

/** AI Functional Test: an AI player's run. */
export const CASE_AIF: CaseDetail = {
  id: 'TC-8889', title: 'Privacy notice close button exits with a toast', crumb: 'Startup notices · Launch › First run',
  clip: '01:14–01:31', duration: '0:17',
  precondition: 'Resource download complete',
  expected: 'Toast is shown, then the game closes.',
  outcome: 'failed', result: 'Game closed with no toast shown.',
  steps: [['Tap close on the privacy notice', '01:14']],
  position: '1 of 1,247',
};

export interface Build {
  version: string;
  file: string;
  size: string;
  uploaded: string;
}

export const BUILDS: Build[] = [
  { version: 'v2.3.1', file: 'whiteout-2.3.1-release.apk', size: '312 MB', uploaded: 'Aug 29' },
  { version: 'v2.3.0', file: 'whiteout-2.3.0-release.apk', size: '308 MB', uploaded: 'Aug 22' },
  { version: 'v2.2.9', file: 'whiteout-2.2.9-release.apk', size: '301 MB', uploaded: 'Aug 14' },
];

export const FT_RUN = { name: 'Build V2.2 — tutorial regression', tag: 'Build V2.2', videos: 18 };
export const AIF_RUN = { name: 'Season 9 — core loop', build: BUILDS[0], instructions: 'Start from a fresh install. Skip the tutorial for cases TC-10 onward. Use the test account bp_tester_03.' };
