import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native'

type ListCardProps = {
  index: number
  title: string
  subtitle: string
  description?: string
  imageUrl?: string
}

export function ListCard({
  index,
  title,
  subtitle,
  description,
  imageUrl,
}: ListCardProps) {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {index}
          </Text>
        </View>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            {title}
          </Text>
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
      </View>

      {/* Optional image (dynamic height) */}
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* Optional description (dynamic height) */}
      {description && (
        <Text style={styles.description}>
          {description}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    // Android shadow
    elevation: 4,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontWeight: '600',
    color: '#4F46E5',
  },

  headerText: {
    marginLeft: 12,
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  image: {
    width: '100%',
    height: 180, // ⬅️ image height only (content-driven)
    borderRadius: 12,
    marginTop: 12,
  },

  description: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
})
