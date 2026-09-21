// Scenes are referred to by name, never by number.
//
// A screen element says which scenes it belongs to, and the build turns names into
// the beat numbers story.js reads. Adding or reordering scenes never breaks a screen.
//
//   const { at, fx } = useScenes();
//   <div className="layer" {...at('thinking..export')}>        visible from "thinking" to "export"
//   <span {...fx({ hl: 'source', on: 'ask..' })}>               class "hl" on one scene, "on" from "ask" to the end
//
// Spec syntax: 'a'  ·  'a..b'  ·  'a..' (to the end)  ·  '..b' (from the start)  ·  'a, c..d'
import { createContext, useContext, type CSSProperties, type ReactNode } from 'react';

export type SceneSpec = string;
export type Fx = Record<string, SceneSpec | undefined>;

const SceneIds = createContext<readonly string[] | null>(null);

export function SceneProvider({ ids, children }: { ids: readonly string[]; children: ReactNode }) {
  return <SceneIds.Provider value={ids}>{children}</SceneIds.Provider>;
}

export function toBeats(ids: readonly string[], spec: SceneSpec): string {
  const index = (id: string) => {
    const i = ids.indexOf(id);
    if (i < 0) throw new Error(`Unknown scene "${id}". Scenes: ${ids.join(', ')}`);
    return i;
  };
  return spec.split(',').map(part => {
    const p = part.trim();
    if (!p.includes('..')) return String(index(p));
    const [a, b] = p.split('..').map(s => s.trim());
    const from = a ? index(a) : 0;
    const to = b ? index(b) : ids.length - 1;
    if (to < from) throw new Error(`Scene range "${p}" runs backwards`);
    return from === to ? String(from) : `${from}-${to}`;
  }).join(',');
}

/**
 * A full-size layer of the screen, shown only during some scenes. Layers fade in and out,
 * so several can share the same spot.
 */
export function Layer({ show, className, toggles, style, children }: {
  show: SceneSpec;
  className?: string;
  toggles?: Record<string, Toggle>;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const { at, cls } = useScenes();
  return <div {...cls(className ? `layer ${className}` : 'layer', toggles)} {...at(show)} style={style}>{children}</div>;
}

/** A plain block inside a layer, shown only during some scenes. */
export function Show({ when, children }: { when: SceneSpec; children: ReactNode }) {
  const { at } = useScenes();
  return <div {...at(when)}>{children}</div>;
}

/** A class that is always on (true), on during some scenes (spec), or off (undefined). */
export type Toggle = SceneSpec | true | undefined;

export function useScenes() {
  const ids = useContext(SceneIds);
  if (!ids) throw new Error('useScenes() must be used inside a <Story>');
  const fx = (rules: Fx) => {
    const parts = Object.entries(rules).filter(([, s]) => s).map(([cls, s]) => `${cls}:${toBeats(ids, s!)}`);
    return parts.length ? { 'data-fx': parts.join(' ') } : {};
  };
  return {
    /** Show the element only during these scenes. Undefined means always. */
    at: (spec?: SceneSpec) => (spec ? { 'data-at': toBeats(ids, spec) } : {}),
    /** Toggle classes by scene, e.g. fx({ hl: 'source', on: 'ask..' }). Undefined entries are skipped. */
    fx,
    /** className plus scene toggles: cls('i-plus', { hl: 'add' }) or cls('i-plus', { hl: true }). */
    cls: (base: string, toggles: Record<string, Toggle> = {}) => {
      const always = Object.entries(toggles).filter(([, t]) => t === true).map(([c]) => c);
      const byScene = Object.fromEntries(Object.entries(toggles).filter(([, t]) => typeof t === 'string')) as Fx;
      const className = [base, ...always].filter(Boolean).join(' ');
      return { ...(className ? { className } : {}), ...fx(byScene) };
    },
  };
}
