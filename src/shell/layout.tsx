// The page around a guide: document head, top bar, intro and the "at a glance" section.
import type { ReactNode } from 'react';
import { AREAS, guideFile, guidesIn, type AreaId, type GuideMeta } from '../registry';
import { LogoMark } from '../ui/Logo';

const FONTS_FULL = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:wght@300;400;500;600;700&family=Roboto+Mono:wght@500;600&display=swap';
const FONTS_LIGHT = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600&family=Roboto+Mono:wght@500;600&display=swap';

export function Page({ title, css, js, fonts = 'full', layout = 'scroll', children }: {
  title: string;
  css: string;
  js?: string;
  /** Inter weights: 'full' loads 300–700, 'light' loads 400–600. */
  fonts?: 'full' | 'light';
  /** data-layout on <body>; the index page has none. */
  layout?: 'scroll' | 'steps' | null;
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>{title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={fonts === 'full' ? FONTS_FULL : FONTS_LIGHT} />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body data-layout={layout ?? undefined}>
        {children}
        {js && <script dangerouslySetInnerHTML={{ __html: js }} />}
      </body>
    </html>
  );
}

/**
 * Back to the top bar, from anywhere down the page. story.js shows it once the intro has
 * scrolled away; without JS it stays hidden, and the page reads the same.
 */
export const BackToTop = () => (
  <button type="button" className="totop" data-totop aria-label="Back to top">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  </button>
);

export function TopBar({ area, current }: { area: AreaId; current: string }) {
  return (
    <header className="topbar">
      <a className="mark" href="index.html"><LogoMark size={26} />6labs Studio <span>{AREAS[area].guidesLabel}</span></a>
      <nav className="navs" aria-label="Guides">
        {guidesIn(area).map(g => (
          <a key={g.slug} className="docpill" data-doc="" href={guideFile(g)} aria-current={g.slug === current ? 'page' : undefined}>
            <span className="n">{g.number}</span>{g.nav}
          </a>
        ))}
      </nav>
    </header>
  );
}

export function Intro({ meta, hero, lede }: { meta: GuideMeta; hero: ReactNode; lede: ReactNode }) {
  return (
    <section className="intro">
      <div className={`hero-icon ${meta.tone}`} aria-hidden="true">{hero}</div>
      <div className="label">Guide {meta.number} · {meta.section}</div>
      <h1>{meta.title}</h1>
      <p className="lede">{lede}</p>
      <div className="hero-actions">
        <span className="scrollcue">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 5v14m-6-6l6 6 6-6" /></svg>
          Scroll to start
        </span>
      </div>
    </section>
  );
}

/** "Quick reminder" section with a flow map above the story. */
export function Glance({ title, note, children }: { title: ReactNode; note: ReactNode; children: ReactNode }) {
  return (
    <section className="glance" aria-labelledby="glance-title">
      <div className="glance-head">
        <div>
          <div className="label">Quick reminder</div>
          <h2 id="glance-title">{title}</h2>
        </div>
        <p>{note}</p>
      </div>
      <div className="glance-map">{children}</div>
    </section>
  );
}
