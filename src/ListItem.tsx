import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import type { RecyclerListTheme } from './theme'

type ListItemProps = {
  index: number
  theme: RecyclerListTheme
}

export const ListItem = React.memo(({ index, theme }: ListItemProps) => {
  const styles = createStyles(theme)

  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{index + 1}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>List Item #{index}</Text>
        <Text style={styles.subtitle}>
          Recycled native view · Nitro layout
        </Text>
      </View>
    </View>
  )
})

function createStyles(theme: RecyclerListTheme) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: theme.spacing.screenPadding,
      marginVertical: theme.spacing.itemGap,
      padding: theme.spacing.cardPadding,
      borderRadius: theme.spacing.cardRadius,
      backgroundColor: theme.colors.card,

      shadowColor: theme.shadow.color,
      shadowOpacity: theme.shadow.opacity,
      shadowRadius: theme.shadow.radius,
      shadowOffset: { width: 0, height: theme.shadow.offsetY },
      elevation: theme.shadow.elevation,
    },

    badge: {
      width: theme.spacing.badgeSize,
      height: theme.spacing.badgeSize,
      borderRadius: theme.spacing.badgeSize / 2,
      backgroundColor: theme.colors.accent + '22',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },

    badgeText: {
      fontSize: theme.typography.indexSize,
      fontWeight: '700',
      color: theme.colors.accent,
    },

    content: {
      flex: 1,
    },

    title: {
      fontSize: theme.typography.titleSize,
      fontWeight: theme.typography.titleWeight,
      color: theme.colors.primaryText,
    },

    subtitle: {
      marginTop: 4,
      fontSize: theme.typography.subtitleSize,
      color: theme.colors.secondaryText,
    },
  })
}
