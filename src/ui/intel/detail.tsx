// A session opened full-page: big player, every detected event, and the player's playlist.
import { EVENTS, PLAYLIST, SESSION_DETAIL, SESSIONS, type Session } from '../../data/intel';
import { useScenes, type Toggle } from '../../shell/scenes';
import { Icon } from '../Icon';
import { ScreenBar } from './app';
import { EventRow, PanelSection, PlayerControls, TileGrid, Timeline } from './panel';
import { Duration } from './sessions';

/** Other recordings by the same player, grouped by play session. The open one is marked. */
export function Playlist({ hl }: { hl?: Toggle }) {
  const { cls } = useScenes();
  return (
    <div {...cls('r-pl', { hl })}>
      <div className="r-pl-h"><Icon name="playlist" style={{ color: 'var(--violet)' }} />User's Playlist</div>
      {PLAYLIST.map(group => [
        <div key={group.label} className="r-grp">{group.label}</div>,
        ...group.items.map(item => {
          const s = SESSIONS[item.id];
          return (
            <div key={group.label + item.id} className={item.note ? 'r-pi on' : 'r-pi'}>
              <div className="t"><span className="r-dur">{s.duration}</span></div>
              <div><b>Session #{s.id}</b><small>{item.note ? `${s.date} · ${item.note}` : s.date}</small><span className="r-tag">{item.tag}</span></div>
            </div>
          );
        }),
      ])}
    </div>
  );
}

export function SessionDetail({ session, eventsHl, playlistHl }: { session: Session; eventsHl?: Toggle; playlistHl?: Toggle }) {
  const { cls } = useScenes();
  const d = SESSION_DETAIL;
  return (
    <>
      <ScreenBar title={`Session #${session.id}`} />
      <div className="r-detail">
        <div className="r-dl">
          <div className="r-big"><Duration>{session.duration}</Duration></div>
          <Timeline />
          <PlayerControls duration={session.duration} />
          <div {...cls('r-devents', { hl: eventsHl })}>
            <div className="r-evh">Detected Events ({EVENTS.length})</div>
            {EVENTS.map(e => <EventRow key={e.type} event={e} />)}
          </div>
        </div>
        <div className="r-dm">
          <PanelSection icon="sparkle" title="AI Summary"><p>{d.summary}</p></PanelSection>
          <PanelSection icon="stats" title="Session Info"><TileGrid tiles={d.info} /></PanelSection>
          <PanelSection icon="user" title="User Profile"><TileGrid tiles={d.profile.tiles} /></PanelSection>
        </div>
        <Playlist hl={playlistHl} />
      </div>
    </>
  );
}
