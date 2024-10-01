import { AxisBottom, AxisLeft } from '@visx/axis'
import { curveStepAfter } from '@visx/curve'
import { localPoint } from '@visx/event'
import { LinearGradient } from '@visx/gradient'
import { GridRows } from '@visx/grid'
import { Group } from '@visx/group'
import { ContinuousDomain, scaleLinear, scaleTime } from '@visx/scale'
import { AreaClosed, Bar, Line, LinePath } from '@visx/shape'
import { TooltipWithBounds, withTooltip } from '@visx/tooltip'
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip'
import { extent, max, min, minIndex } from 'd3-array'
import { MouseEvent, TouchEvent } from 'react'

import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { useParentSize } from '@/ui/utils/useParentSize'
import { Circle } from 'lucide-react'
import { Margins, defaultMargins } from '../../defaults'
import { formatDateTick, formatPercentageTick, formatTooltipDate } from '../../utils'

export interface GraphDataPoint {
  date: Date
  rate: Percentage
}

interface Colors {
  primary: string
  backgroundLine: string
  axisTickLabel: string
  tooltipLine: string
  dot: string
  dotStroke: string
}

const colors = {
  tooltipLine: '#6A7692',
  dot: '#0B2140',
  dotStroke: 'white',
  backgroundLine: '#D9D9D9',
  axisTickLabel: '#6A7692',
  primary: '#6EC275',
}

export interface SavingsRateGraphProps {
  height: number
  margins?: Margins
  xAxisNumTicks?: number
  yAxisNumTicks?: number
  data: GraphDataPoint[]
  tooltipLabel: string
}

function SavingsRateGraph({
  height,
  margins = defaultMargins,
  xAxisNumTicks = 5,
  yAxisNumTicks = 5,
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipLeft = 0,
  data,
  tooltipLabel,
}: SavingsRateGraphProps & WithTooltipProvidedProps<GraphDataPoint>) {
  const [ref, { width }] = useParentSize()

  const innerWidth = width - margins.left - margins.right
  const innerHeight = height - margins.top - margins.bottom

  const xValueScale = scaleTime({
    range: [0, innerWidth],
    domain: extent(data, ({ date }) => date) as [Date, Date],
  })
  const yValueScale = scaleLinear({
    range: [innerHeight, 0],
    domain: calculateRateDomain(data),
    nice: true,
  })

  function handleTooltip(event: TouchEvent<SVGRectElement> | MouseEvent<SVGRectElement>): void {
    const point = localPoint(event) || { x: 0 }
    const x = point.x - margins.left
    const domainX = xValueScale.invert(x)

    const tooltipElement = data[minIndex(data, (d) => Math.abs(d.date.getTime() - domainX.getTime()))]

    showTooltip({
      tooltipData: tooltipElement,
      tooltipLeft: x,
    })
  }

  return (
    <div ref={ref}>
      <svg width={width} height={height}>
        <Group left={margins.left} top={margins.top}>
          <GridRows
            scale={yValueScale}
            width={innerWidth}
            strokeDasharray="3"
            stroke={colors.backgroundLine}
            strokeWidth={1}
            pointerEvents="none"
          />

          <LinearGradient
            id="area-gradient"
            from={colors.primary}
            to={colors.primary}
            fromOpacity={0.5}
            toOpacity={0}
          />

          <AreaClosed
            strokeWidth={2}
            data={data}
            x={(data) => xValueScale(data.date)}
            y={(data) => yValueScale(data.rate.toNumber())}
            yScale={yValueScale}
            curve={curveStepAfter}
            fill="url(#area-gradient)"
          />

          <LinePath
            stroke={colors.primary}
            strokeWidth={2}
            data={data}
            x={(data) => xValueScale(data.date)}
            y={(data) => yValueScale(data.rate.toNumber())}
            curve={curveStepAfter}
          />

          <AxisBottom
            top={innerHeight - margins.bottom / 4}
            scale={xValueScale}
            strokeWidth={0}
            tickFormat={formatDateTick}
            numTicks={xAxisNumTicks}
            tickLabelProps={() => ({
              fill: colors.axisTickLabel,
              fontSize: 10,
              textAnchor: 'middle',
              dy: 4,
            })}
          />

          <AxisLeft
            left={0}
            scale={yValueScale}
            strokeWidth={0}
            numTicks={yAxisNumTicks}
            tickFormat={formatPercentageTick}
            tickLabelProps={() => ({
              fill: colors.axisTickLabel,
              fontSize: 10,
              dx: -margins.left + 10,
              dy: 3,
            })}
          />

          <Bar
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={hideTooltip}
          />

          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: 0 }}
                to={{ x: tooltipLeft, y: innerHeight }}
                stroke={colors.tooltipLine}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="3"
              />
              <circle
                cx={tooltipLeft}
                cy={yValueScale(tooltipData.rate.toNumber())}
                r={8}
                fill={colors.primary}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={yValueScale(tooltipData.rate.toNumber())}
                r={4}
                fill={colors.dot}
                stroke={colors.dotStroke}
                strokeWidth={3}
                pointerEvents="none"
              />
            </g>
          )}
        </Group>
      </svg>

      {tooltipData && (
        <TooltipWithBounds top={20} left={tooltipLeft + 40} unstyled applyPositionStyle>
          <TooltipContent data={tooltipData} colors={colors} tooltipLabel={tooltipLabel} />
        </TooltipWithBounds>
      )}
    </div>
  )
}

function TooltipContent({
  data,
  colors,
  tooltipLabel,
}: { data: GraphDataPoint; colors: Colors; tooltipLabel: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-700/10 bg-white p-3 shadow">
      <div className="flex flex-col gap-3 text-slate-500 text-xs leading-none">{formatTooltipDate(data.date)}</div>
      <div className="flex items-center gap-1.5 text-sm leading-none">
        <Circle size={8} fill={colors.primary} stroke="0" />
        <div>
          {tooltipLabel}:{' '}
          <span className="font-semibold">{formatPercentage(data.rate, { minimumFractionDigits: 0 })}</span>
        </div>
      </div>
    </div>
  )
}

function calculateRateDomain(data: GraphDataPoint[]): ContinuousDomain {
  const minRate = min(data, (d) => d.rate.toNumber()) || 0
  const maxRate = max(data, (d) => d.rate.toNumber()) || 0

  if (minRate === maxRate) {
    return [minRate - 0.01, maxRate + 0.01]
  }

  return [minRate * 0.9, maxRate * 1.1] // 10% padding on top
}

const SavingsRateGraphWithTooltip = withTooltip<SavingsRateGraphProps, GraphDataPoint>(SavingsRateGraph)

export { SavingsRateGraphWithTooltip as SavingsRateGraph }
