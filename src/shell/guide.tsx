// A guide is data plus one screen component. defineGuide() describes it, GuidePage renders it.
import type { ComponentType, ReactNode } from 'react';
import { guide as meta } from '../registry';
import { IconSprite } from '../ui/Icon';
import { Recap, type RecapProps } from './content';
import { BackToTop, Glance, Intro, Page, TopBar } from './layout';
import { Story, type Scene, type Step } from './Story';

export interface GuideDef {
  /** Registry slug; sets the file name, number, area and title. */
  slug: string;
  /** <title>. Defaults to "<title> Guide". */
  pageTitle?: string;
  /** Inter weights to load (see Page). */
  fonts?: 'full' | 'light';
  /** Include the icon sprite (Intelligence screens use it). */
  icons?: boolean;
  hero: ReactNode;
  lede: ReactNode;
  glance?: { title: ReactNode; note: ReactNode; map: ReactNode };
  /** aria-label of the story. Defaults to "<title> walkthrough". */
  storyLabel?: string;
  steps: Step[];
  scenes: Scene[];
  /** The pinned product screen. Uses useScenes() to react to the current scene. */
  Screen: ComponentType;
  recap: RecapProps;
}

export const defineGuide = (g: GuideDef) => g;

export function GuidePage({ guide, css, js }: { guide: GuideDef; css: string; js: string }) {
  const m = meta(guide.slug);
  return (
    <Page title={guide.pageTitle ?? `${m.title} Guide`} css={css} js={js} fonts={guide.fonts}>
      {guide.icons && <IconSprite />}
      <TopBar area={m.area} current={m.slug} />
      <Intro meta={m} hero={guide.hero} lede={guide.lede} />
      {guide.glance && <Glance title={guide.glance.title} note={guide.glance.note}>{guide.glance.map}</Glance>}
      <Story label={guide.storyLabel ?? `${m.title} walkthrough`} steps={guide.steps} scenes={guide.scenes} Screen={guide.Screen} />
      <Recap {...guide.recap} />
      <BackToTop />
    </Page>
  );
}
