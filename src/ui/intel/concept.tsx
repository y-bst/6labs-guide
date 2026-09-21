// Diagrams drawn inside the main area instead of a product screen (e.g. "Two agents, one flow").
// Positions are in main-area pixels: 936 × 780.
import type { CSSProperties, ReactNode } from 'react';
import type { PageId } from '../../data/intel';
import { Layer, useScenes, type SceneSpec, type Toggle } from '../../shell/scenes';
import { Tile } from './app';

export function ConceptScene({ show, animate, title, titleTop, children }: {
  show: SceneSpec;
  /** Run the dashed-line flow animation. */
  animate?: Toggle;
  title?: ReactNode;
  titleTop?: number;
  children: ReactNode;
}) {
  return (
    <Layer show={show} className="k-scene" toggles={{ play: animate }}>
      {title && <div className="k-title" style={titleTop ? { top: `${titleTop}px` } : undefined}>{title}</div>}
      {children}
    </Layer>
  );
}

/** Connector lines behind the boxes. Paths use main-area coordinates. */
export function Lines({ children }: { children: ReactNode }) {
  return <svg className="k-lines" viewBox="0 0 936 780" preserveAspectRatio="none">{children}</svg>;
}

/** White card placed by its class or style. `show` limits it to some scenes. */
export function ConceptBox({ className, style, show, children }: { className?: string; style?: CSSProperties; show?: SceneSpec; children: ReactNode }) {
  const { at } = useScenes();
  return <div className={className ? `k-box ${className}` : 'k-box'} style={style} {...at(show)}>{children}</div>;
}

/** Box heading with an agent or page tile. */
export function BoxTitle({ page, children }: { page: PageId; children: ReactNode }) {
  return <h4><Tile page={page} />{children}</h4>;
}
