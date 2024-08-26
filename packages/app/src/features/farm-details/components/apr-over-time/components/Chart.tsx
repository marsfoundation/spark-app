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
import { extent, max, min } from 'd3-array'
import { Fragment, MouseEvent, TouchEvent } from 'react'

import { formatPercentage } from '@/domain/common/format'
import { useParentSize } from '@/ui/utils/useParentSize'
import { Circle } from 'lucide-react'
import { colors } from '../colors'
import { Margins, defaultMargins } from '../defaults'
import { GraphDataPoint } from '../types'

export interface ChartProps {
  height: number
  margins?: Margins
  xAxisNumTicks?: number
  yAxisNumTicks?: number
  data: GraphDataPoint[]
}

function Chart({
  height,
  margins = defaultMargins,
  xAxisNumTicks = 5,
  yAxisNumTicks = 5,
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipLeft = 0,
  data,
}: ChartProps & WithTooltipProvidedProps<GraphDataPoint>) {
  const [ref, { width }] = useParentSize()

  const innerWidth = width - margins.left - margins.right
  const innerHeight = height - margins.top - margins.bottom

  const xValueScale = scaleTime({
    range: [0, innerWidth],
    domain: extent(data, ({ date }) => date) as [Date, Date],
  })
  const yValueScale = scaleLinear({
    range: [innerHeight, 0],
    domain: calculateAprDomain(data),
    nice: true,
  })

  function handleTooltip(event: TouchEvent<SVGRectElement> | MouseEvent<SVGRectElement>): void {
    const point = localPoint(event) || { x: 0 }
    const x = point.x - margins.left
    const domainX = xValueScale.invert(x)
    const lastSmallerElement =
      data.reduce(
        (prev, curr) => (curr.date.getTime() < domainX.getTime() ? curr : prev),
        null as GraphDataPoint | null,
      ) || data[0]
    showTooltip({
      tooltipData: lastSmallerElement,
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
            numTicks={yAxisNumTicks}
          />

          <LinearGradient
            id="area-gradient"
            from={colors.primary}
            to={colors.primary}
            fromOpacity={0.5}
            toOpacity={0}
          />
          <LinePath
            stroke={colors.primary}
            strokeWidth={2}
            data={data}
            x={(data) => xValueScale(data.date)}
            y={(data) => yValueScale(data.apr.toNumber())}
            curve={curveStepAfter}
          />
          <AreaClosed
            strokeWidth={2}
            data={data}
            x={(data) => xValueScale(data.date)}
            y={(data) => yValueScale(data.apr.toNumber())}
            yScale={yValueScale}
            curve={curveStepAfter}
            fill="url(#area-gradient)"
          />

          <AxisBottom
            top={innerHeight - margins.bottom / 4}
            scale={xValueScale}
            strokeWidth={0}
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
            tickFormat={formatYTicks}
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
              <Fragment>
                <circle
                  cx={tooltipLeft}
                  cy={yValueScale(tooltipData.apr.toNumber())}
                  r={8}
                  fill={colors.primary}
                  pointerEvents="none"
                />
                <circle
                  cx={tooltipLeft}
                  cy={yValueScale(tooltipData.apr.toNumber())}
                  r={4}
                  fill={colors.dot}
                  stroke={colors.dotStroke}
                  strokeWidth={3}
                  pointerEvents="none"
                />
              </Fragment>
            </g>
          )}
        </Group>
      </svg>

      {tooltipData && (
        <TooltipWithBounds top={20} left={tooltipLeft + 40} unstyled applyPositionStyle>
          <TooltipContent data={tooltipData} />
        </TooltipWithBounds>
      )}
    </div>
  )
}

function TooltipContent({ data }: { data: GraphDataPoint }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-700/10 bg-white p-3 shadow">
      <div className="flex flex-col gap-3 text-slate-500 text-xs leading-none">{formatTooltipDate(data.date)}</div>
      <div className="flex items-center gap-1.5 text-sm leading-none">
        <Circle size={8} fill={colors.primary} stroke="0" />
        <div>
          APR: <span className="font-semibold">{formatPercentage(data.apr, { minimumFractionDigits: 0 })}</span>
        </div>
      </div>
    </div>
  )
}

function formatTooltipDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const year = date.getFullYear()

  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')

  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  const hoursString = String(hours).padStart(2, '0')

  return `${day}.${month}.${year} ${hoursString}:${minutes} ${ampm}`
}

const tickFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
})

function formatYTicks(value: { valueOf(): number }) {
  return `${tickFormatter.format(value.valueOf() * 100)}%`
}

function calculateAprDomain(data: GraphDataPoint[]): ContinuousDomain {
  const minApr = min(data, (d) => d.apr.toNumber()) || 0
  const maxApr = max(data, (d) => d.apr.toNumber()) || 0

  if (minApr === maxApr) {
    return [minApr - 0.1, maxApr + 0.1]
  }

  return [minApr, maxApr * 1.1] // 10% padding on top
}

const ChartWithTooltip = withTooltip<ChartProps, GraphDataPoint>(Chart)
export { ChartWithTooltip as Chart }
