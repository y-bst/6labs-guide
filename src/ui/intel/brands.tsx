// Marks for the tools a studio can connect.
import type { BrandId } from '../../data/intel';
import { Icon, type IconName } from '../Icon';

export const BRANDS: Record<BrandId, { name: string; bg: string; icon?: IconName; text?: string; tileIcon?: number }> = {
  bigquery: { name: 'BigQuery', bg: '#F1F3F4', icon: 'g', tileIcon: 22 },
  snowflake: { name: 'Snowflake', bg: '#29B5E8', icon: 'snow' },
  appsflyer: { name: 'AppsFlyer', bg: '#0B1F3A', icon: 'flyer' },
  jira: { name: 'Jira', bg: '#2684FF', icon: 'ticket' },
  slack: { name: 'Slack', bg: '#4A154B', icon: 'hash' },
  discord: { name: 'Discord', bg: '#5865F2', icon: 'chat' },
  facebook: { name: 'Facebook Ads', bg: '#1877F2', text: 'f' },
};

/** Small mark for lists and menus (16–18px). Google's G stands alone; others sit on a coloured square. */
export function BrandMark({ brand, size = 18 }: { brand: BrandId; size?: number }) {
  const b = BRANDS[brand];
  if (brand === 'bigquery') return <Icon name="g" size={size} />;
  return (
    <span style={{ width: `${size}px`, height: `${size}px`, borderRadius: `${Math.round(size / 3.6)}px`, background: b.bg, display: 'grid', placeItems: 'center', color: '#fff' }}>
      <Icon name={b.icon!} size={Math.round(size * 0.67)} />
    </span>
  );
}

/** 36px logo tile on connector cards. */
export function BrandLogo({ brand }: { brand: BrandId }) {
  const b = BRANDS[brand];
  return (
    <span className="c-logo" style={{ background: b.bg }}>
      {b.icon ? <Icon name={b.icon} size={b.tileIcon ?? 20} /> : b.text}
    </span>
  );
}
