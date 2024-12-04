import { formatPercentage } from '@/domain/common/format'
import { Token } from '@/domain/types/Token'
import { cn } from '@/ui/utils/style'
import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'

interface MarketOverviewChartProps {
  data: { value: number; color: string }[]
  token: Token
  marketSize: NormalizedUnitNumber
  borrowed: NormalizedUnitNumber
  utilizationRate: Percentage
  className?: string
}

export function MarketOverviewChart({
  data: _data,
  token,
  marketSize,
  borrowed,
  utilizationRate,
  className,
}: MarketOverviewChartProps) {
  const totalValue = _data.reduce((acc, curr) => acc + curr.value, 0)
  const data = _data.filter(({ value }) => value / totalValue > 0.005) // @note: filter out values that are smaller than 0.5% of total

  const radius = 175
  const strokeWidth = 30
  const arcs = getArcs({ data, cx: 200, cy: 200, radius })
  const separators = getSeparators({
    data,
    dataWasFiltered: data.length !== _data.length,
    cx: 200,
    cy: 200,
    radius,
    mainStrokeWidth: strokeWidth,
  })

  return (
    <div
      className={cn('relative isolate h-fit w-full', className)}
      style={{
        container: 'sidebar / inline-size',
      }}
    >
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 400 400">
        {arcs.map((point) => {
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
      <div className="-z-10 absolute inset-0">
        <div className="flex h-full w-full flex-col items-center justify-center gap-[2cqw] text-primary-inverse">
          <div className="font-roobert text-[4.5cqw] text-tertiary">Utilization rate</div>
          <div className="text-[14cqw] text-primary-inverse">{formatPercentage(utilizationRate)}</div>
          <div className="font-roobert text-[4.5cqw] text-tertiary">
            {token.formatUSD(borrowed, { compact: true })} of {token.formatUSD(marketSize, { compact: true })}
          </div>
        </div>
      </div>
    </div>
  )
}

export const colors = {
  borrow: '#FD895C',
  available: '#00D9B1',
  sky: '#6A4DFF',
}

interface ChartItem {
  value: number
  color: string
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

interface GetSeparatorsParams {
  data: ChartItem[]
  dataWasFiltered: boolean
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
function getSeparators({ data, dataWasFiltered, cx, cy, radius, mainStrokeWidth }: GetSeparatorsParams): Separator[] {
  if (data.length === 1) {
    if (dataWasFiltered) {
      // this is needed to avoid the full circle and pretend small elements are there
      return [
        {
          x1: cx,
          y1: cy - radius - mainStrokeWidth / 2,
          x2: cx,
          y2: cy - radius + mainStrokeWidth / 2,
        },
      ]
    }
    return []
  }

  const starts = getArcs({ data, cx, cy, radius: radius - mainStrokeWidth / 2 })
  const ends = getArcs({ data, cx, cy, radius: radius + mainStrokeWidth / 2 })

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
