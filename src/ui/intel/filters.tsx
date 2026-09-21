// Radiologist's Filters dialog, open on Match Context with "Winner" picked.
import { useScenes, type SceneSpec } from '../../shell/scenes';
import { Icon } from '../Icon';

const CATEGORIES = ['Source & Tags', 'Match Context', 'Combat Performance', 'Monetization Patterns', 'Player Behaviour', 'Team Dynamics', 'Frustration Markers'];
const ACTIVE = 'Match Context';

const CHOICES: { name: string; chips: string[]; picked?: string }[] = [
  { name: 'GAME MODE', chips: ['Training', 'Social Island', 'Battle Royale', 'Clash Squad', 'Lone Wolf', 'Custom', 'Ranked Battle Royale'] },
  { name: 'MAP', chips: ['Bermuda', 'Alpine', 'Purgatory', 'Nexterra', 'Kalahari', 'Solara'] },
];
const PLACEMENT = { name: 'PLACEMENT', chips: ['Winner', 'Top 3', 'Top 10', 'Top 25', 'Bottom 50%', 'Loser'], picked: 'Winner' };

function Group({ name, chips, picked }: { name: string; chips: string[]; picked?: string }) {
  return (
    <>
      <small>{name}</small>
      <div className="r-chips">{chips.map(c => <span key={c} className={c === picked ? 'on' : undefined}>{c}</span>)}</div>
    </>
  );
}

/** The dialog over a dimmed screen. `placementHl` pulses the Placement group. */
export function FiltersDialog({ show, placementHl }: { show: SceneSpec; placementHl?: SceneSpec }) {
  const { at, cls } = useScenes();
  return (
    <div {...at(show)}>
      <div className="r-dim" />
      <div className="r-filters">
        <div className="r-fh">Filters<Icon name="x" /></div>
        <div className="r-fbody">
          <div className="r-fcats">
            {CATEGORIES.map(c => <span key={c} className={c === ACTIVE ? 'on' : undefined}><i />{c}</span>)}
          </div>
          <div className="r-fpane">
            {CHOICES.map(g => <div key={g.name} className="r-fgrp"><Group {...g} /></div>)}
            <div className="r-fgrp">
              <small>MATCH DURATION</small>
              <div className="r-range" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--ink-4)', marginTop: '10px' }}><span>1 min</span><span>60 min</span></div>
            </div>
            <div {...cls('r-fgrp', { hl: placementHl })}><Group {...PLACEMENT} /></div>
          </div>
        </div>
        <div className="r-ff">
          <span className="i-btn">Clear all</span>
          <span style={{ flex: '1' }} />
          <span className="i-btn">Cancel</span>
          <span className="i-btn pri">Apply</span>
        </div>
      </div>
    </div>
  );
}
