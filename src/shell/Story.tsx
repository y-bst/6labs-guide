// The pinned scroll story: step bar, one explanation card per scene, and the product screen.
import type { ComponentType, CSSProperties, ReactNode } from 'react';
import { SceneProvider } from './scenes';

export interface Step {
  id: string;
  label: string;
}

export interface Scene {
  /** Name used by screens: at('home'), fx({ hl: 'source' }). */
  id: string;
  /** Step in the bar at the top. */
  step: string;
  /** Small label above the title. Defaults to the step label, plus "· 2 of 3" when a step has several scenes. */
  chapter?: string;
  title: ReactNode;
  body: ReactNode;
  /** Zoom the screen onto x, y (canvas pixels) at the given scale. */
  focus?: [x: number, y: number, zoom: number];
}

export function Story({ label, steps, scenes, Screen, width = 1180, height = 780 }: {
  label: string;
  steps: Step[];
  scenes: Scene[];
  Screen: ComponentType;
  width?: number;
  height?: number;
}) {
  const ids = scenes.map(s => s.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) throw new Error(`${label}: duplicate scene ids ${dupes.join(', ')}`);
  for (const s of scenes) if (!steps.some(st => st.id === s.step)) throw new Error(`${label}: scene "${s.id}" uses unknown step "${s.step}"`);

  return (
    <SceneProvider ids={ids}>
      <section className="story" data-story="" data-scenes={ids.join(',')} aria-label={label}>
        <div className="stage">
          <div className="progress"><i /></div>
          <ol className="flow" aria-label="Where you are">
            {steps.map((s, i) => (
              <li key={s.id} data-node={s.id}><button type="button"><i>{i + 1}</i>{s.label}</button></li>
            ))}
          </ol>
          <div className="side">
            <div className="cards">
              {scenes.map(s => <Card key={s.id} scene={s} chapter={chapterOf(s, scenes, steps)} />)}
            </div>
          </div>
          <div className="visual">
            <div className="shot" style={{ '--w': `${width}px`, '--h': `${height}px` } as CSSProperties}>
              <div className="shot-canvas">
                <div className="cam">
                  <Screen />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SceneProvider>
  );
}

function chapterOf(scene: Scene, scenes: Scene[], steps: Step[]) {
  if (scene.chapter) return scene.chapter;
  const label = steps.find(s => s.id === scene.step)!.label;
  const same = scenes.filter(s => s.step === scene.step);
  return same.length > 1 ? `${label} · ${same.indexOf(scene) + 1} of ${same.length}` : label;
}

function Card({ scene, chapter }: { scene: Scene; chapter: string }) {
  return (
    <article className="card" data-node={scene.step} data-focus={scene.focus?.join(' ')}>
      <div className="count" data-chapter={chapter} />
      <h2>{scene.title}</h2>
      {scene.body}
    </article>
  );
}
