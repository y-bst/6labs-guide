// Documents (the Uploads page): drop zone, add bar, and files moving through upload → describe → saved.
import type { CSSProperties, ReactNode } from 'react';
import type { FileKind, UploadFile } from '../../data/intel';
import { useScenes, type SceneSpec, type Toggle } from '../../shell/scenes';
import { Click } from '../Click';
import { Icon } from '../Icon';

const FORMATS: [label: string, icon: 'file' | 'sheet' | 'img', colour: string][] = [
  ['PDF', 'file', 'var(--red-2)'], ['DOC', 'file', 'var(--brand)'], ['CSV', 'sheet', 'var(--green)'],
  ['Images', 'img', 'var(--violet)'], ['TXT', 'file', 'var(--ink-4)'],
];

/** Wraps the zone in a cursor tap when the guide asks for one. */
const Tap = ({ click, children }: { click?: SceneSpec; children: ReactNode }) =>
  (click ? <Click on={click} block>{children}</Click> : <>{children}</>);

/** The empty page: heading, explanation and the big drop zone. */
export function DropZone({ hl, click }: {
  hl?: Toggle;
  /** Scenes in which a cursor taps the zone, so the files do not just appear. */
  click?: SceneSpec;
}) {
  const { cls } = useScenes();
  return (
    <>
      <h4 className="d-h2">Help your agents think like your team</h4>
      <p className="d-sub">Share GDDs, live-ops plans, player research, balance logs, strategy docs, or anything that gives them deeper context about your game.</p>
      <Tap click={click}>
        <div {...cls('d-drop', { hl })}>
        <b>Drop files here or click to upload</b>
        <p>Any format our agents can learn from</p>
        <div className="d-fmts">{FORMATS.map(([f, icon, c]) => (
          <span key={f} style={{ '--c': c } as CSSProperties}><Icon name={icon} size={14} />{f}</span>
        ))}</div>
        <div className="d-max">MAX 30MB</div>
        </div>
      </Tap>
    </>
  );
}

/** Compact uploader above the file list once files exist. */
export function AddFilesBar() {
  return (
    <div className="d-add">
      <Icon name="plus" size={22} />
      <span><b>Add more files</b><small>PDF, DOC, CSV, TXT and images</small></span>
      <span className="max">MAX 30MB</span>
    </div>
  );
}

export function FileListHeading({ count }: { count: number }) {
  return <div className="d-list-h">Uploaded Files <span>{count}</span></div>;
}

const KIND: Record<FileKind, { cls: string; icon: 'file' | 'sheet' | 'img' }> = {
  doc: { cls: 'd-ic', icon: 'file' },
  sheet: { cls: 'd-ic sheet', icon: 'sheet' },
  img: { cls: 'd-ic img', icon: 'img' },
};

/**
 * One stage of a file's life during the story.
 *   uploading  blue badge, optional progress bar
 *   uploaded   green badge and the "what should agents know" box, typed in
 *   saved      no badge; the description sits under the name
 */
export interface FilePhase {
  show: SceneSpec;
  status: 'uploading' | 'uploaded' | 'saved';
  /** Progress bar: fill width, and optional delay / duration of the fill animation. */
  bar?: { w: string; delay?: string; duration?: string };
}

export function FileItem({ file, phases, hl }: { file: UploadFile; phases: FilePhase[]; hl?: Toggle }) {
  const { at, cls } = useScenes();
  const k = KIND[file.kind];
  return (
    <div {...cls('d-file', { hl })}>
      <div className="d-row">
        <span className={k.cls}><Icon name={k.icon} size={20} /></span>
        <span><b>{file.name}</b><small>{file.meta}</small></span>
        {phases.map(p => p.status === 'uploading'
          ? <span key={p.show} className="d-st up" {...at(p.show)}><Icon name="upload" size={11} />UPLOADING</span>
          : p.status === 'uploaded'
            ? <span key={p.show} className="d-st ok" {...at(p.show)}><Icon name="check" size={11} />UPLOADED</span>
            : <span key={p.show} {...at(p.show)} />)}
        <Icon name="trash" />
        {phases.filter(p => p.bar).map(p => (
          <span key={p.show} className="d-bar" {...at(p.show)}>
            <i style={{ '--w': p.bar!.w, ...(p.bar!.delay ? { '--dl': p.bar!.delay } : {}), ...(p.bar!.duration ? { '--t': p.bar!.duration } : {}) } as CSSProperties} />
          </span>
        ))}
      </div>
      {phases.filter(p => p.status === 'uploaded').map(p => (
        <div key={p.show} className="d-desc" {...at(p.show)}>
          <div className="d-ta typed">{file.description}</div>
          <div className="d-acts"><span className="i-btn brand">Skip</span><span className="i-btn pri"><Icon name="check" size={14} />Save</span></div>
        </div>
      ))}
      {phases.filter(p => p.status === 'saved').map(p => (
        <div key={p.show} className="d-saved" {...at(p.show)}>{file.description}<Icon name="edit" size={15} /></div>
      ))}
    </div>
  );
}
