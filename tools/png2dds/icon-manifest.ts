// Single source of truth for our icon name/size pairs, shared by gen-icon-sources.ts,
// gen-tex.ts, and gen-xlp.ts so the two lists never drift apart from each other.
export const civilizationIconSizes = [22, 30, 32, 36, 44, 45, 48, 50, 64, 80, 128, 256] as const;
export const leaderIconSizes = [32, 45, 48, 50, 55, 64, 80, 256] as const;

export function civilizationIconName(size: number): string {
  return `ICON_CIVILIZATION_REGLOSS_ICHIJOU_${size}`;
}

export function leaderIconName(size: number): string {
  return `ICON_LEADER_REGLOSS_ICHIJOU_RIRIKA_${size}`;
}
