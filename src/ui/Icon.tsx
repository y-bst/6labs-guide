// Icons come from one SVG sprite (icons.svg). Most are the 6labs prototype's own icons.
//   <Icon name="oracle" />            18px
//   <Icon name="clock" size={12} />
// Pages that use icons include <IconSprite /> once, at the top of <body>.
import { readFileSync } from 'node:fs';
import type { SVGProps } from 'react';

export type IconName =
  | 'new' | 'oracle' | 'radio' | 'fore' | 'docs' | 'conn'
  | 'export' | 'like' | 'dislike' | 'plus' | 'back' | 'chev' | 'down' | 'up' | 'copy' | 'bulb'
  | 'clock' | 'cal' | 'filter' | 'x' | 'sparkle' | 'file' | 'img' | 'sheet' | 'ppt' | 'trash'
  | 'robot' | 'upload' | 'play' | 'vol' | 'full' | 'info' | 'edit' | 'check' | 'lock'
  | 'playlist' | 'events' | 'stats' | 'user' | 'pc' | 'mobile' | 'lib'
  /* brand marks */
  | 'yt' | 'bs' | 'g' | 'snow' | 'hash' | 'chat' | 'ticket' | 'flyer';

export function Icon({ name, size = 18, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return <svg width={size} height={size} {...rest}><use href={`#i-${name}`} /></svg>;
}

const sprite = readFileSync(new URL('./icons.svg', import.meta.url), 'utf8');
const symbols = sprite.slice(sprite.indexOf('>') + 1, sprite.lastIndexOf('</svg>'));

export function IconSprite() {
  return <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: symbols }} />;
}
