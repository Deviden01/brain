const TAG_COLORS = [
  '#f59e0b', // amber
  '#22d3ee', // cyan
  '#a78bfa', // violet
  '#34d399', // emerald
  '#60a5fa', // blue
  '#f472b6', // pink
  '#fb923c', // orange
  '#4ade80', // green
  '#94a3b8', // slate
  '#e879f9', // fuchsia
]

export function getTagColor(tag: string): string {
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length]
}
