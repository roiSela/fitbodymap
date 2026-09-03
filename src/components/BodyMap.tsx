import { BodyView, REGIONS } from '../data/muscles'

interface Props {
  view: BodyView
  highlightedMuscles: Set<string>
  selectedRegionId: string | null
  hoveredRegionId: string | null
  interactive: boolean
  onSelectRegion: (regionId: string) => void
  onHoverRegion: (regionId: string | null) => void
}

function Silhouette() {
  return (
    <g fill="url(#bodyGradient)" stroke="var(--body-stroke)" strokeWidth={1.5} strokeLinejoin="round">
      {/* head + neck */}
      <ellipse cx={100} cy={38} rx={20} ry={22} />
      <rect x={92} y={54} width={16} height={16} rx={6} />
      {/* torso */}
      <path d="M66 68 Q100 58 134 68 L138 168 Q100 182 62 168 Z" />
      {/* arms */}
      <path d="M66 70 Q40 74 32 96 L22 160 Q20 172 30 172 Q40 172 40 160 L48 108 Q52 88 70 78 Z" />
      <path d="M134 70 Q160 74 168 96 L178 160 Q180 172 170 172 Q160 172 160 160 L152 108 Q148 88 130 78 Z" />
      {/* hands */}
      <ellipse cx={26} cy={182} rx={9} ry={11} />
      <ellipse cx={174} cy={182} rx={9} ry={11} />
      {/* hips */}
      <path d="M64 166 Q100 180 136 166 L130 232 Q100 244 70 232 Z" />
      {/* legs */}
      <path d="M72 226 Q64 270 68 320 L72 384 Q86 390 88 380 L84 316 Q88 268 92 228 Z" />
      <path d="M128 226 Q136 270 132 320 L128 384 Q114 390 112 380 L116 316 Q112 268 108 228 Z" />
      {/* feet */}
      <ellipse cx={82} cy={392} rx={13} ry={8} />
      <ellipse cx={118} cy={392} rx={13} ry={8} />
    </g>
  )
}

export default function BodyMap({
  view,
  highlightedMuscles,
  selectedRegionId,
  hoveredRegionId,
  interactive,
  onSelectRegion,
  onHoverRegion,
}: Props) {
  const regions = REGIONS.filter((r) => r.view === view)
  const activeLabel = REGIONS.find((r) => r.id === (hoveredRegionId ?? selectedRegionId))?.label

  return (
    <div className="body-map">
      <svg viewBox="0 0 200 400" width="100%" height="100%" role="img" aria-label={`Body diagram, ${view} view`}>
        <defs>
          <linearGradient id="bodyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--body-fill-top)" />
            <stop offset="100%" stopColor="var(--body-fill-bottom)" />
          </linearGradient>
        </defs>
        <Silhouette />
        {regions.map((r) => {
          const isHighlighted = r.muscles.some((m) => highlightedMuscles.has(m))
          const isSelected = r.id === selectedRegionId
          const isHovered = r.id === hoveredRegionId
          const active = isHighlighted || isSelected
          const fill = active ? 'var(--accent-strong)' : isHovered ? 'var(--accent-dim)' : 'transparent'
          const common = {
            'data-region-id': r.id,
            fill,
            stroke: active ? 'var(--accent-strong)' : isHovered ? 'var(--accent)' : 'var(--region-stroke)',
            strokeWidth: active ? 2 : 1.25,
            opacity: active ? 0.88 : isHovered ? 0.6 : 0.28,
            style: interactive ? ({ cursor: 'pointer', transition: 'fill 140ms ease, opacity 140ms ease, stroke 140ms ease' } as const) : undefined,
            onClick: interactive ? () => onSelectRegion(r.id) : undefined,
            onMouseEnter: interactive ? () => onHoverRegion(r.id) : undefined,
            onMouseLeave: interactive ? () => onHoverRegion(null) : undefined,
          }
          return (
            <g key={r.id}>
              {r.shape.kind === 'rect' ? (
                <rect x={r.shape.x} y={r.shape.y} width={r.shape.w} height={r.shape.h} rx={r.shape.rx ?? 6} {...common} />
              ) : (
                <ellipse cx={r.shape.x} cy={r.shape.y} rx={r.shape.w} ry={r.shape.h} {...common} />
              )}
            </g>
          )
        })}
      </svg>
      <div className="body-map-label">{activeLabel ?? ' '}</div>
    </div>
  )
}
