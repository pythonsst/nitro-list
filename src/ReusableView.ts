// src/ReusableView.ts

/**
 * Represents a physical view slot that can be reused
 * for different data indices while scrolling.
 */
export type ReusableView = {
  /** Stable identity for React reconciliation */
  readonly key: string;

  /** Current data index this slot represents */
  index: number;
};
