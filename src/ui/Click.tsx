// A cursor moves onto a control and taps it.
//
// Put it around the control that causes the *next* scene, with `on` set to the scene before
// the result. The reader then sees the control, sees it clicked, and only then sees what the
// click did — instead of the screen jumping straight to the result.
//
//   <Click on="ask"><SendButton /></Click>        clicked during "ask", result lands in the next scene
//   <Click on="pick" from="left">…</Click>        cursor comes in from the left
import type { ReactNode } from 'react';
import { useScenes, type SceneSpec } from '../shell/scenes';

/** Where the cursor travels in from. Pick the side with room, so it does not cross the control. */
export type ClickFrom = 'below' | 'left' | 'right' | 'above';

export function Click({ on, from = 'below', block, children }: {
  on: SceneSpec;
  from?: ClickFrom;
  /** For a control that is a block, e.g. a drop zone or a card, not an inline button. */
  block?: boolean;
  children: ReactNode;
}) {
  const { cls } = useScenes();
  return (
    <span {...cls(`s-tap ${from}${block ? ' block' : ''}`, { tapping: on })}>
      {children}
      <span className="s-tap-ring" aria-hidden="true" />
      <svg className="s-tap-cursor" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 3l14 8-6 1.5L10 19z" fill="var(--ink)" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
