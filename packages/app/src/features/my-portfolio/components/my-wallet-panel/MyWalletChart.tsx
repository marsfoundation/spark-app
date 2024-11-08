import { ChartItem } from './types'

export interface MyWalletChartProps {
  data: ChartItem[]
  highlightedIndex: number | undefined
  setHighlightedIndex: (index: number | undefined) => void
}

export function MyWalletChart({ data, highlightedIndex, setHighlightedIndex }: MyWalletChartProps) {
  const radius = 175
  const auxiliaryRadius = radius - 40
  const strokeWidth = 50
  const arcs = getArcs({ data, cx: 200, cy: 200, radius })
  const auxillaryArcs = getArcs({ data, cx: 200, cy: 200, radius: auxiliaryRadius, marginAngle: 1 })
  const separators = getSeparators({ data, cx: 200, cy: 200, radius, mainStrokeWidth: strokeWidth })

  return (
    <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 400 400">
      {arcs.map((point, index) => {
        if (point.angle <= 0) {
          return null
        }

        return (
          <path
            d={`M${point.x1} ${point.y1} A${radius} ${radius} 0 ${point.angle > Math.PI ? '1' : '0'} 1 ${point.x2} ${point.y2}`}
            fill="none"
            stroke={point.color}
            strokeWidth={strokeWidth}
            key={`${point.x1}${point.y1}${point.x2}${point.y2}`}
            onMouseEnter={() => {
              setHighlightedIndex(index)
            }}
            onMouseLeave={() => {
              setHighlightedIndex(undefined)
            }}
          />
        )
      })}
      {auxillaryArcs.map((point, index) => {
        if (point.angle <= 0) {
          return null
        }

        return (
          <path
            d={`M${point.x1} ${point.y1} A${auxiliaryRadius} ${auxiliaryRadius} 0 ${point.angle > Math.PI ? '1' : '0'} 1 ${point.x2} ${point.y2}`}
            fill="none"
            stroke={highlightedIndex === index ? '#FFFFFF' : '#58585B'}
            strokeWidth={2}
            key={`${point.x1}${point.y1}${point.x2}${point.y2}`}
          />
        )
      })}
      {separators.map((separator) => (
        <path
          d={`M${separator.x1} ${separator.y1} L${separator.x2} ${separator.y2}`}
          fill="none"
          stroke="black"
          strokeWidth={2}
          key={`${separator.x1}${separator.y1}${separator.x2}${separator.y2}`}
        />
      ))}
    </svg>
  )
}

interface GetSeparatorsParams {
  data: ChartItem[]
  cx: number
  cy: number
  radius: number
  mainStrokeWidth: number
}
interface Separator {
  x1: number
  y1: number
  x2: number
  y2: number
}
function getSeparators({ data, cx, cy, radius, mainStrokeWidth }: GetSeparatorsParams): Separator[] {
  const starts = getArcs({ data, cx, cy, radius: radius - mainStrokeWidth })
  const ends = getArcs({ data, cx, cy, radius: radius + mainStrokeWidth })

  return starts
    .map((start, index) => {
      if (start.angle <= 0) {
        return null
      }

      const end = ends[index]!
      return {
        x1: start.x1,
        y1: start.y1,
        x2: end.x1,
        y2: end.y1,
      }
    })
    .filter(Boolean)
}

interface Arc {
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  angle: number
}
interface GetArcsParams {
  data: ChartItem[]
  cx: number
  cy: number
  radius: number
  marginAngle?: number
}
function getArcs({ data, cx, cy, radius, marginAngle = 0 }: GetArcsParams): Arc[] {
  const zeroAngle = 0.5 * Math.PI
  // 0.00001 is added to avoid the full circle (when full circle, start and end angles are the same, and the arc is not drawn)
  const fullAngle = -3.5 * Math.PI + 0.00001

  const marginAnglRadians = (marginAngle * Math.PI) / 180
  const total = data.reduce((acc, curr) => acc + curr.value, 0)

  if (total === 0) {
    return [
      getArc({
        startAngle: zeroAngle,
        endAngle: fullAngle,
        color: '#E5E5E5',
        cx,
        cy,
        radius,
      }),
    ]
  }

  if (data.length === 1) {
    return [
      getArc({
        startAngle: zeroAngle,
        endAngle: fullAngle,
        color: data[0]!.color,
        cx,
        cy,
        radius,
      }),
    ]
  }

  const sums = data.map(
    (
      (sum) => (value) =>
        // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        (sum += value.value)
    )(0),
  )
  return sums.map((sum, i) => {
    const startAngle = Math.PI / 2 - ((sum - data[i]!.value) / total) * 2 * Math.PI - marginAnglRadians
    const endAngle = Math.PI / 2 - (sum / total) * 2 * Math.PI + marginAnglRadians

    return getArc({
      startAngle,
      endAngle,
      color: data[i]!.color,
      cx,
      cy,
      radius,
    })
  })
}

interface GetArcParams {
  startAngle: number
  endAngle: number
  color: string
  cx: number
  cy: number
  radius: number
}
function getArc({ startAngle, endAngle, color, cx, cy, radius }: GetArcParams): Arc {
  return {
    x1: cx + radius * Math.cos(startAngle),
    y1: cy - radius * Math.sin(startAngle),
    x2: cx + radius * Math.cos(endAngle),
    y2: cy - radius * Math.sin(endAngle),
    color,
    angle: Math.abs(endAngle - startAngle),
  }
}
