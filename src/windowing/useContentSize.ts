import { useMemo } from 'react'
import type { LayoutProvider } from '../layout/LayoutProvider'
import type { ContentSize } from './ContentSize'

export function useContentSize(
  provider: LayoutProvider
): ContentSize {
  return useMemo(
    () => ({ height: provider.getContentHeight() }),
    [provider]
  )
}
