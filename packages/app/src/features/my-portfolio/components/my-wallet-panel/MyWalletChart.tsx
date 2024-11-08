import { TokenWithBalance } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { getTokenColor, getTokenImage } from '@/ui/assets'
import { getRandomColor } from '@/ui/utils/get-random-color'
import { useState } from 'react'
import { ChartItem } from './types'

export interface MyWalletChartProps {
  assets: TokenWithBalance[]
  className?: string
}

export function MyWalletChart({ assets, className }: MyWalletChartProps) {
  const totalUsd = assets.reduce(
    (acc, asset) => NormalizedUnitNumber(acc.plus(asset.token.toUSD(asset.balance))),
    NormalizedUnitNumber(0),
  )
  const nonZeroAssets = assets.filter((asset) => asset.balance.gt(0))
  const data = nonZeroAssets.map((asset) => ({
    value: asset.token.toUSD(asset.balance).toNumber(),
    color: getTokenColor(asset.token.symbol, { fallback: getRandomColor() }),
  }))
  const [highlightedIndex, setHighlightedIndex] = useState<number | undefined>(undefined)
  const highlightedAsset = highlightedIndex === undefined ? undefined : nonZeroAssets[highlightedIndex]

  const radius = 175
  const auxiliaryRadius = radius - 40
  const strokeWidth = 50
  const arcs = getArcs({ data, cx: 200, cy: 200, radius })
  const auxillaryArcs = getArcs({ data, cx: 200, cy: 200, radius: auxiliaryRadius, marginAngle: 1 })
  const separators = getSeparators({ data, cx: 200, cy: 200, radius, mainStrokeWidth: strokeWidth })

  return (
    <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 400 400" className={className}>
      <foreignObject width="100%" height="100%">
        <div
          className="flex h-full w-full animate-reveal flex-col items-center justify-center text-primary-inverse duration-500 ease-out"
          key={nonZeroAssets.length > 0 ? highlightedIndex : undefined}
        >
          {highlightedAsset === undefined ? (
            <div className="flex flex-col items-center gap-1.5">
              <div className="font-roobert text-[14px]">TOTAL</div>
              <div className="text-[28px]">{USD_MOCK_TOKEN.formatUSD(totalUsd)}</div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-primary-inverse">
              <div className="flex items-center gap-2">
                <img src={getTokenImage(highlightedAsset.token.symbol)} className="h-6 w-6" />
                <div className="font-roobert text-[14px]">{highlightedAsset.token.symbol}</div>
              </div>
              <div className="text-[28px]">
                {highlightedAsset.token.format(highlightedAsset.balance, { style: 'auto' })}
              </div>
              <div className="font-roobert text-[14px] text-secondary">
                {highlightedAsset.token.formatUSD(highlightedAsset.balance)}
              </div>
            </div>
          )}
        </div>
      </foreignObject>

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
      {nonZeroAssets.length > 0 &&
        auxillaryArcs.map((point, index) => {
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
      {separators.length > 1 &&
        separators.map((separator) => (
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
