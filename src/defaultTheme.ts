import type { RecyclerListTheme } from './theme'

export const defaultRecyclerListTheme: RecyclerListTheme = {
  colors: {
    background: '#F5F7FA',
    card: '#FFFFFF',
    primaryText: '#0F172A',
    secondaryText: '#64748B',
    accent: '#6366F1',
  },

  typography: {
    titleSize: 16,
    titleWeight: '600',
    subtitleSize: 13,
    indexSize: 14,
  },

  spacing: {
    screenPadding: 16,
    cardPadding: 16,
    cardRadius: 16,
    itemGap: 8,
    badgeSize: 44,
  },

  shadow: {
    color: '#000',
    opacity: 0.06,
    radius: 12,
    offsetY: 6,
    elevation: 3,
  },
}
