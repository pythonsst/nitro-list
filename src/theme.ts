export type RecyclerListTheme = {
  colors: {
    background: string
    card: string
    primaryText: string
    secondaryText: string
    accent: string
  }

  typography: {
    titleSize: number
    titleWeight: '400' | '500' | '600' | '700' | '800'
    subtitleSize: number
    indexSize: number
  }

  spacing: {
    screenPadding: number
    cardPadding: number
    cardRadius: number
    itemGap: number
    badgeSize: number
  }

  shadow: {
    color: string
    opacity: number
    radius: number
    offsetY: number
    elevation: number
  }
}
