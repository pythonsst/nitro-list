# 🚀 NitroList (RecyclerList)

**Nitro-powered RecyclerList for React Native New Architecture**

A high-performance, recycler-based list built from the ground up for  
**Fabric + Nitro (JSI)** — no legacy bridge, no hidden overhead.

---

## Preview

![NitroList Preview](./NitroList.png)

**Blazing-fast • Deterministic • Architecture-correct**

Built for teams that care about **FPS, memory stability, and correctness**.

---

## ✨ What is NitroList?

**NitroList** (public component: `RecyclerList`) is a **FlashList-class virtualized list**, designed with a stricter architectural philosophy:

- New Architecture only (Fabric)
- Nitro / JSI friendly
- True view recycling
- Explicit layout ownership
- Predictable memory usage

NitroList is **not a beginner abstraction**.  
It is **infrastructure-level UI**, meant for performance-critical React Native apps.

---

## 🧠 Core Design Principles

NitroList enforces strict separation of responsibilities:

| Responsibility | Owner |
|----------------|------|
| Layout truth | MutableLinearLayout (outside React) |
| Windowing | Pure binary-search windowing |
| Recycling | Physical cell reuse |
| Rendering | React (placement only) |
| Observers | Viewability / Prefetch (read-only) |

### Key invariants

- React never owns layout state  
- React never decides what exists  
- Layout is a mutable truth outside React  

This separation is the foundation of stable performance.

---

## ⚡ Why NitroList over FlatList?

### Problems with FlatList

- Recreates views instead of recycling
- Layout is implicit and fragile
- Memory grows with scroll depth
- Blank cells under pressure
- Designed for the legacy bridge

### NitroList Advantages

- True view recycling
- Absolute positioning (no reflow)
- Deterministic windowing
- Stable memory footprint
- No legacy bridge usage
- Architecture designed for scale

---

## 🆚 NitroList vs FlashList

| Feature | FlashList v2 | NitroList |
|------|-------------|-----------|
| New Architecture | Yes | Yes |
| Legacy bridge | No | No |
| Recycler model | Yes | Yes |
| Layout ownership | Internal | Explicit & controllable |
| Nitro / JSI ready | No | Yes |
| Deterministic memory | Partial | Strict |
| Architecture clarity | Medium | Very high |

### Why NitroList Exists

FlashList v2 is excellent — but:

- Layout is internal and opaque
- Hard to integrate with Nitro / JSI native logic
- Less control over measurement and relayout
- Harder to reason about invariants

NitroList is built for:

- Native-heavy apps
- Nitro / JSI pipelines
- Custom layout engines
- Predictable performance at scale

---

## 🧩 Features

### Implemented

- Recycler-based rendering
- Binary-search windowing
- Adaptive render buffer
- Deterministic layout engine
- Viewability tracking
- Prefetch hooks
- Full TypeScript safety
- Unit-tested windowing logic

### Partially Implemented

- Dynamic measurement pipeline
- Incremental relayout

### Planned

- scrollToIndex
- Sticky headers
- Masonry layout
- Native measurement via Nitro
- Benchmark harness

---

## 📦 Installation

```bash
npm install react-native-nitro-list
```

> Requires React Native New Architecture  
> NitroList will not run on the legacy bridge.

---

## 🧑‍💻 Usage

### Basic Usage

```tsx
import { RecyclerList } from 'react-native-nitro-list'

<RecyclerList
  containerWidth={width}
  itemCount={10000}
  estimatedItemHeight={80}
  renderItem={(index) => <Row index={index} />}
/>
```

### Fixed Heights

```tsx
<RecyclerList
  containerWidth={width}
  itemHeights={heights}
  renderItem={renderItem}
/>
```

---

## 👀 Viewability

```tsx
<RecyclerList
  onViewableItemsChanged={({ viewableItems, changed }) => {
    console.log(viewableItems, changed)
  }}
/>
```

- Percentage-based visibility
- Deterministic enter / exit events
- Zero layout mutation

---

## ⚡ Prefetching

```tsx
<RecyclerList
  onPrefetch={(indices) => {
    preloadData(indices)
  }}
/>
```

- Runs ahead of the visible window
- Deduplicated
- Safe and repeatable
- Observer-only (never mutates layout)

---

## 🧪 Testing Philosophy

NitroList focuses on pure logic tests:

- Windowing correctness
- Buffer expansion
- Boundary conditions
- Off-by-one safety

No flaky UI snapshot tests.  
No renderer-dependent assertions.

---

## 🧠 When Should You Use NitroList?

### Use NitroList if:

- You are on Fabric / New Architecture
- You care about memory stability
- You plan to integrate Nitro / JSI
- You want explicit control over layout
- You are building performance-critical screens

### Don’t use NitroList if:

- You need legacy bridge support
- You want a beginner-friendly abstraction
- Your lists are small (less than 500 items)
- FlatList performance is already sufficient

---

## 🗺️ Roadmap

- v0.2 → measurement pipeline
- v0.3 → scrollToIndex
- v0.4 → native measurement (Nitro)
- v1.0 → production-hardened API

---

## 🤝 Philosophy

NitroList optimizes for:

- Correctness over magic
- Predictability over heuristics
- Architecture over convenience

This library is for engineers who value control.

---

## 📄 License

MIT
