// Every guide, in reading order. The top bar, intro labels, next/previous links and the
// index page are all generated from this list, so adding a guide starts here.
import type { ReactNode } from 'react';
import { TIcon } from './ui/testing/icons';

export type AreaId = 'intel' | 'testing';
export type HeroTone = 'lib' | 'ut' | 'ft' | 'ai' | 'or' | 'ra' | 'cx';

export const AREAS: Record<AreaId, { name: string; guidesLabel: string }> = {
  intel: { name: 'Intelligence', guidesLabel: 'Intelligence guides' },
  testing: { name: 'Testing', guidesLabel: 'Testing guides' },
};

export interface GuideMeta {
  slug: string;
  number: string;
  area: AreaId;
  /** Shown after the number in the intro label, e.g. "Guide 01 · Human testing". */
  section: string;
  title: string;
  /** Top-bar pill label. */
  nav: string;
  tone: HeroTone;
  /** One line for the index card. */
  summary: string;
  /** 28px icon for the index card. */
  icon: ReactNode;
}

const svg = (children: ReactNode, strokeWidth = 1.7, extra: Record<string, string> = {}) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} {...extra}>{children}</svg>
);

export const ICONS = {
  library: <TIcon name="library" size={28} width={1.7} />,
  userTest: <TIcon name="userTest" size={28} width={1.7} />,
  functionalTest: <TIcon name="flaskDoc" size={28} width={1.5} />,
  aiBehavioural: <TIcon name="aiPerson" size={28} width={1.5} />,
  aiFunctional: <TIcon name="aiDoc" size={28} width={1.5} />,
  oracle: svg(<><path d="M12 4.5a3 3 0 0 0-5.6 1.4A3.4 3.4 0 0 0 4 9.5a3.5 3.5 0 0 0 .9 5.6A3 3 0 0 0 9 19a3 3 0 0 0 3-1.5V4.5z" /><path d="M12 4.5a3 3 0 0 1 5.6 1.4A3.4 3.4 0 0 1 20 9.5" /><circle cx="17" cy="16" r="2.6" /><path d="M19 18l2 2" /></>, 1.7, { strokeLinecap: 'round' }),
  radiologist: svg(<><path d="M4 4h12v3H4z" /><path d="M6 7v8a4 4 0 0 0 6.5 3.1M10 7v4H8" /><circle cx="16.5" cy="15.5" r="3" /><path d="M18.8 17.8L21 20" /></>, 1.7, { strokeLinecap: 'round' }),
  context: svg(<path d="M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" />, 1.8, { strokeLinecap: 'round', strokeLinejoin: 'round' }),
};

export const GUIDES: GuideMeta[] = [
  { slug: 'gameplay-library', number: '01', area: 'testing', section: 'Human testing', title: 'Gameplay Library', nav: 'Gameplay Library', tone: 'lib', icon: ICONS.library,
    summary: "How videos come in (Gameplay Recorder App, browser upload, CLI) and how they're organised." },
  { slug: 'user-test', number: '02', area: 'testing', section: 'Human testing', title: 'User Test', nav: 'User Test', tone: 'ut', icon: ICONS.userTest,
    summary: 'Pick videos, get a report or ask a question, with clips behind every finding.' },
  { slug: 'functional-test', number: '03', area: 'testing', section: 'Human testing', title: 'Functional Test', nav: 'Functional Test', tone: 'ft', icon: ICONS.functionalTest,
    summary: 'Upload the test cases your team ran and 6labs checks each one against the recordings, with the clip that shows it.' },
  { slug: 'ai-behavioural-test', number: '04', area: 'testing', section: 'AI player testing', title: 'AI Behavioural Test', nav: 'AI Behavioural', tone: 'ai', icon: ICONS.aiBehavioural,
    summary: 'AI players play your build as personas and report where the game blocks, confuses or loses them.' },
  { slug: 'ai-functional-test', number: '05', area: 'testing', section: 'AI player testing', title: 'AI Functional Test', nav: 'AI Functional', tone: 'ai', icon: ICONS.aiFunctional,
    summary: 'AI players run your test cases on your build and report what passed and what failed, with the video.' },
  { slug: 'oracle', number: '06', area: 'intel', section: 'Intelligence', title: 'Oracle', nav: 'Oracle', tone: 'or', icon: ICONS.oracle,
    summary: 'Ask about your players in plain words and get answers backed by gameplay videos.' },
  { slug: 'radiologist', number: '07', area: 'intel', section: 'Intelligence', title: 'Radiologist', nav: 'Radiologist', tone: 'ra', icon: ICONS.radiologist,
    summary: 'Search for a moment and see every session where it happens, event by event.' },
  { slug: 'context', number: '08', area: 'intel', section: 'Intelligence', title: 'Documents & Connectors', nav: 'Documents & Connectors', tone: 'cx', icon: ICONS.context,
    summary: 'Upload design docs and link the tools your studio uses, so every answer gets sharper.' },
];

export const guideFile = (g: GuideMeta) => `${g.number}-${g.slug}.html`;

export function guide(slug: string): GuideMeta {
  const g = GUIDES.find(x => x.slug === slug);
  if (!g) throw new Error(`No guide "${slug}" in registry`);
  return g;
}

export const href = (slug: string) => guideFile(guide(slug));
export const guidesIn = (area: AreaId) => GUIDES.filter(g => g.area === area);

/* ---------- index page ---------- */

export type CatalogItem = string | { soon: string; icon: ReactNode };

export interface CatalogGroup {
  id: string;
  /** Heading colour class used by the index styles. */
  tone: 'agents' | 'ctx' | 'lib' | 'human' | 'ai';
  title: string;
  note: string;
  /** Two items render side by side; one renders full width. */
  items: CatalogItem[];
}

export interface CatalogArea {
  area: AreaId;
  kicker: string;
  intro: string;
  groups: CatalogGroup[];
}

export const CATALOG: CatalogArea[] = [
  {
    area: 'testing', kicker: 'Area 1',
    intro: 'Gameplay videos go into one library, and testing agents turn them into results. AI players can also play your build for you. Start with the Gameplay Library, since the human tests use it.',
    groups: [
      { id: 'lib', tone: 'lib', title: 'Gameplay Library', note: 'Where the human tests get their videos', items: ['gameplay-library'] },
      { id: 'human', tone: 'human', title: 'Human testing', note: 'Tests on videos recorded by real players', items: ['user-test', 'functional-test'] },
      { id: 'ai', tone: 'ai', title: 'AI player testing', note: 'Tests where 6labs AI players play the build', items: ['ai-behavioural-test', 'ai-functional-test'] },
    ],
  },
  {
    area: 'intel', kicker: 'Area 2',
    intro: 'Agents that read your gameplay and answer questions about it, backed by the videos they used.',
    groups: [
      { id: 'agents', tone: 'agents', title: 'Core agents', note: 'Start from the home screen or the sidebar', items: ['oracle', 'radiologist'] },
      { id: 'ctx', tone: 'ctx', title: 'Context', note: 'What agents know about your game', items: ['context'] },
    ],
  },
];
