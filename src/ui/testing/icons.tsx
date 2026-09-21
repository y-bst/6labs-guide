// Line icons used on the Testing screens (inline SVG, 24×24 grid, stroke = currentColor by default).
import type { ReactNode } from 'react';

const PATHS = {
  library: <><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M10 10.5v5l4-2.5z" fill="currentColor" stroke="none" /></>,
  userTest: <><circle cx="9" cy="8" r="3.2" /><path d="M3 19c.8-3.2 3.2-5 6-5s5.2 1.8 6 5" /><circle cx="17" cy="9" r="2.4" /><path d="M16.5 14c2.3.2 4 1.8 4.5 4.5" /></>,
  /** Report page with lines: "Generate report", "View full report". */
  report: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h6M10 17h4" /></>,
  /** Blank page: a document or a finished run. */
  doc: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /></>,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  question: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5M12 17h.01" /></>,
  /** Upload into a tray, one stroke (buttons, drop zone). */
  uploadTray: <path d="M12 16V4m0 0L7 9m5-5l5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />,
  /** Same shape in two strokes (source tiles). */
  upload: <><path d="M12 16V4m0 0L7 9m5-5l5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></>,
  download: <path d="M12 4v11m0 0l-5-5m5 5l5-5M5 20h14" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />,
  edit: <path d="M4 20h4L19 9l-4-4L4 16z" />,
  record: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" /></>,
  cli: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9l3 3-3 3M13 15h4" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  arrowUp: <path d="M12 20V5m-6 6l6-6 6 6" />,

  /* sidebar and page icons, as drawn in the prototype (draw them with width 1.5) */
  overview: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  folderPlay: <g transform="scale(1.2)"><path d="M3.25 3h4.5c.47 0 .92.22 1.2.6l.68.9c.47.63 1.21 1 2 1h5.12c.83 0 1.5.67 1.5 1.5v8.5c0 .83-.67 1.5-1.5 1.5H3.25c-.83 0-1.5-.67-1.5-1.5v-11c0-.83.67-1.5 1.5-1.5z" strokeWidth="1" /><path d="M5.45 8.4c-.2-.12-.45.02-.45.25v5.2c0 .23.25.37.45.25l4.33-2.6a.3.3 0 0 0 0-.5z" fill="currentColor" stroke="none" /></g>,
  people: <g fill="currentColor" stroke="none"><path d="M18.53 19.66a.75.75 0 0 1-.74-.74v-1.57c0-.64-.25-1.25-.71-1.71a2.4 2.4 0 0 0-1.7-.71H9.09c-.64 0-1.25.25-1.7.71a2.4 2.4 0 0 0-.71 1.71v1.57a.75.75 0 0 1-1.49 0v-1.57c0-1.02.42-2.03 1.14-2.75a3.9 3.9 0 0 1 2.75-1.14h6.29c1.02 0 2.03.42 2.75 1.14a3.9 3.9 0 0 1 1.14 2.75v1.57a.75.75 0 0 1-.74.74z" /><path d="M12.24 11.78a3.89 3.89 0 1 1 0-7.78 3.89 3.89 0 0 1 0 7.78zm0-6.29a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z" /><path d="M23.26 19.65a.75.75 0 0 1-.75-.74v-1.58c0-.53-.18-1.06-.5-1.48a2.6 2.6 0 0 0-1.3-.85.75.75 0 1 1 .37-1.43c.83.22 1.57.71 2.1 1.38.53.67.82 1.53.82 2.38v1.58a.75.75 0 0 1-.74.74zM17.75 11.7a.74.74 0 0 1-.72-.55.74.74 0 0 1 .53-.9c.52-.13.97-.43 1.31-.85.32-.42.5-.95.5-1.48s-.18-1.06-.5-1.48a2.4 2.4 0 0 0-1.31-.85.75.75 0 1 1 .37-1.43c.83.22 1.59.71 2.1 1.38.53.67.82 1.53.82 2.39s-.29 1.71-.82 2.38a3.9 3.9 0 0 1-2.1 1.38c-.06.01-.12.02-.18.02zM.74 19.65c.41 0 .75-.34.75-.74v-1.58c0-.53.18-1.06.5-1.48.33-.42.8-.72 1.3-.85a.75.75 0 1 0-.37-1.43c-.83.22-1.57.71-2.1 1.38A3.9 3.9 0 0 0 0 17.35v1.57c0 .41.34.74.74.74zM6.25 11.7c.34 0 .64-.23.72-.55a.74.74 0 0 0-.53-.9 2.4 2.4 0 0 1-1.31-.85c-.32-.42-.5-.95-.5-1.48s.18-1.06.5-1.48c.32-.42.79-.72 1.31-.85a.75.75 0 1 0-.37-1.45c-.83.22-1.59.71-2.1 1.38-.53.67-.82 1.53-.82 2.39s.29 1.71.82 2.38c.53.68 1.27 1.17 2.1 1.38.06.01.12.02.18.02z" /></g>,
  flaskDoc: <><path d="M11.5 21H4.7A1.7 1.7 0 0 1 3 19.4V4.6A1.7 1.7 0 0 1 4.7 3h14.6A1.7 1.7 0 0 1 21 4.6V9" strokeLinecap="round" /><path d="M16 8l-5.3 6L8 11.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M22.7 20.3L20 16.05v-3.2h.75V12h-4.5v.85H17v3.2l-2.7 4.25a1.6 1.6 0 0 0 1.2 2.7h6a1.6 1.6 0 0 0 1.2-2.7zM17.75 16.33v-3.48h1.5v3.48l1 1.56h-3.5zM21.5 22.15h-6a.75.75 0 0 1-.6-1.37l1.3-2.04h4.6l1.3 2.04a.75.75 0 0 1-.6 1.37z" fill="currentColor" stroke="none" /></>,
  aiPerson: <><path d="M13 3c-.47 0-.97 0-1.5 0C7 3 4.8 3 3.4 4.4 2 5.8 2 8 2 12.5s0 6.7 1.4 8.1C4.8 22 7 22 11.5 22s6.7 0 8.1-1.4C21 19.2 21 17 21 12.5c0-.53 0-1.03 0-1.5" strokeLinecap="round" /><path d="M18.5 2l.26.7c.34.91.5 1.37.84 1.7.33.34.79.5 1.7.84L22 5.5l-.7.26c-.91.34-1.37.5-1.7.84-.34.33-.5.79-.84 1.7L18.5 9l-.26-.7c-.34-.91-.5-1.37-.84-1.7-.33-.34-.79-.5-1.7-.84L15 5.5l.7-.26c.91-.34 1.37-.5 1.7-.84.34-.33.5-.79.84-1.7z" strokeLinejoin="round" /><path d="M7 17.5c2.33-2.44 6.64-2.56 9 0M14 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" strokeLinecap="round" /></>,
  aiDoc: <><path d="M13 21H4.7A1.7 1.7 0 0 1 3 19.4V4.6A1.7 1.7 0 0 1 4.7 3h14.6A1.7 1.7 0 0 1 21 4.6v5.9" strokeLinecap="round" /><path d="M16 8l-5.3 6L8 11.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M18.5 14l.26.7c.34.91.5 1.37.84 1.7.33.34.79.5 1.7.84l.7.26-.7.26c-.91.34-1.37.5-1.7.84-.34.33-.5.79-.84 1.7L18.5 21l-.26-.7c-.34-.91-.5-1.37-.84-1.7-.33-.34-.79-.5-1.7-.84L15 17.5l.7-.26c.91-.34 1.37-.5 1.7-.84.34-.33.5-.79.84-1.7z" strokeLinejoin="round" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></>,
  chart: <path d="M4 19V5M4 19h16M7 15l4-5 3 3 5-7" strokeLinecap="round" strokeLinejoin="round" />,
  nodes: <><circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /><circle cx="12" cy="12" r="2.5" /><path d="M8 7.5L10 10M16 7.5L14 10M8 16.5L10 14M16 16.5L14 14" strokeLinecap="round" /></>,
  checklist: <path d="M8 6h13M8 12h13M8 18h13M3 6l1 1 2-2M3 12l1 1 2-2M3 18l1 1 2-2" strokeLinecap="round" strokeLinejoin="round" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,

  /* small UI glyphs */
  alert: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5h.01" strokeLinecap="round" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5M12 7.5h.01" strokeLinecap="round" /></>,
  chevDown: <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />,
  chevLeft: <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />,
  chevRight: <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />,
  close: <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />,
  play: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none" />,
  /** Spreadsheet file (test cases). */
  sheet: <><path d="M7 3h7l5 5v13H7z" strokeLinejoin="round" /><path d="M14 3v5h5M10 12.5h6M10 16h6M13 11v7" /></>,
  arrowRight: <path d="M5 12h14m-6-6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />,
} satisfies Record<string, ReactNode>;

export type TIconName = keyof typeof PATHS;

export function TIcon({ name, size = 18, width = 1.8, stroke = 'currentColor', round, className }: {
  name: TIconName;
  size?: number;
  /** Stroke width. */
  width?: number;
  stroke?: string;
  round?: boolean;
  className?: string;
}) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={width} strokeLinecap={round ? 'round' : undefined}>
      {PATHS[name]}
    </svg>
  );
}
