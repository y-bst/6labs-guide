// The pieces both "at a glance" maps are built from — the diagram at the top of a guide.
// Styled by ui/map.css. Each area supplies its own icons and its own arrangement.
import type { CSSProperties, ReactNode } from 'react';

export interface GlanceNode { icon: ReactNode; title: string; desc: string }

/** on = the step this guide is about · near = the rest of the path it belongs to. */
export type GlanceState = 'on' | 'near' | undefined;

const at = (step: number, style?: CSSProperties) => ({ ['--step']: step, ...style }) as CSSProperties;

export function GlanceCard({ node, step, state, lead, chip, here, style }: {
  node: GlanceNode;
  /** Entrance order, so a flow arrives left to right. */
  step: number;
  state?: GlanceState;
  /** The card that carries the guide's own name: tinted, not just outlined. */
  lead?: boolean;
  /** A second input this card needs, shown on the card instead of a line crossing the map. */
  chip?: ReactNode;
  /** Put the "this guide" marker on this card. */
  here?: boolean;
  style?: CSSProperties;
}) {
  const className = ['gm-node', state, lead && state === 'on' ? 'lead' : ''].filter(Boolean).join(' ');
  return (
    <div className={className} style={at(step, style)}>
      <span className="gm-ic">{node.icon}</span>
      <span><b>{node.title}</b><small>{node.desc}</small></span>
      {chip && <span className="gm-chip">{chip}</span>}
      {here && <span className="gm-here">This guide</span>}
    </div>
  );
}

export function GlanceLine({ step, on, style }: { step: number; on?: boolean; style?: CSSProperties }) {
  return <i className={on ? 'gm-line on' : 'gm-line'} style={at(step, style)} />;
}
