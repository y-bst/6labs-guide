// The landing page: every area, its groups and guide cards, straight from the registry.
import { AREAS, CATALOG, guide, guideFile, type CatalogItem } from '../registry';
import { Page } from '../shell/layout';

function Card({ item }: { item: CatalogItem }) {
  if (typeof item !== 'string') {
    return (
      <article className="guide later">
        <div className="hero-icon" aria-hidden="true">{item.icon}</div>
        <div>
          <span className="tag">Coming soon</span>
          <h4>{item.soon}</h4>
        </div>
      </article>
    );
  }
  const g = guide(item);
  return (
    <article className="guide">
      <div className={`hero-icon ${g.tone}`} aria-hidden="true">{g.icon}</div>
      <div>
        <h4>{g.title}</h4>
        <p>{g.summary}</p>
      </div>
      <div className="open"><a className="btn primary" href={guideFile(g)}>Open guide</a></div>
    </article>
  );
}

export function IndexPage({ css }: { css: string }) {
  return (
    <Page title="6labs Studio Guides" css={css} fonts="light" layout={null}>
      <section className="intro">
        <div className="label">6labs Studio</div>
        <h1>Guides</h1>
        <p className="lede">How 6labs Studio works, one flow at a time. <b>Testing</b> checks your builds with real players and AI players. <b>Intelligence</b> answers questions about your game.</p>
      </section>

      <main className="guides">
        {CATALOG.map(a => (
          <section key={a.area} className="area" aria-labelledby={`h-${a.area}`}>
            <div className="area-h">
              <div className="label">{a.kicker}</div>
              <h2 id={`h-${a.area}`}>{AREAS[a.area].name}</h2>
              <p>{a.intro}</p>
            </div>
            {a.groups.map(grp => (
              <section key={grp.id} className={`group ${grp.tone}`} aria-labelledby={`h-${grp.id}`}>
                <div className="group-h"><h3 id={`h-${grp.id}`}>{grp.title}</h3><p>{grp.note}</p></div>
                {grp.items.length > 1
                  ? <div className="cards2">{grp.items.map((it, i) => <Card key={i} item={it} />)}</div>
                  : <Card item={grp.items[0]} />}
              </section>
            ))}
          </section>
        ))}
      </main>
    </Page>
  );
}
