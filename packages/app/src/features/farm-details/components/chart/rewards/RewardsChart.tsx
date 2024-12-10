import { formatPercentage } from '@/domain/common/format'
import { ChartTooltipContent } from '@/ui/charts/ChartTooltipContent'
import { colors as colorsPreset } from '@/ui/charts/colors'
import { Margins, defaultMargins } from '@/ui/charts/defaults'
import { formatPercentageTick, formatTooltipDate, getVerticalDomainWithPadding } from '@/ui/charts/utils'
import { Percentage } from '@marsfoundation/common-universal'
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

export interface ChartDataPoint {
  date: Date
  apr: Percentage
}

export const colors = {
  ...colorsPreset,
  primary: '#FA43BD',
}

export interface ChartProps {
  height: number
  width: number
  margins?: Margins
  xAxisNumTicks?: number
  yAxisNumTicks?: number
  data: ChartDataPoint[]
}

function Chart({
  height,
  width,
  margins = defaultMargins,
  xAxisNumTicks = 5,
  yAxisNumTicks = 5,
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipLeft = 0,
  data,
}: ChartProps & WithTooltipProvidedProps<ChartDataPoint>) {
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
        null as ChartDataPoint | null,
      ) || data[0]
    showTooltip({
      tooltipData: lastSmallerElement,
      tooltipLeft: x,
    })
  }

  return (
    <div>
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
        <TooltipWithBounds top={20} left={tooltipLeft + 40} unstyled applyPositionStyle className="pointer-events-none">
          <TooltipContent data={tooltipData} />
        </TooltipWithBounds>
      )}
    </div>
  )
}

function TooltipContent({ data }: { data: ChartDataPoint }) {
  return (
    <ChartTooltipContent>
      <ChartTooltipContent.Date>{formatTooltipDate(data.date)}</ChartTooltipContent.Date>
      <ChartTooltipContent.Value dotColor={colors.primary}>
        APY: {formatPercentage(data.apr, { minimumFractionDigits: 0 })}
      </ChartTooltipContent.Value>
    </ChartTooltipContent>
  )
}

function calculateAprDomain(data: ChartDataPoint[]): ContinuousDomain {
  const minApr = min(data, (d) => d.apr.toNumber()) || 0
  const maxApr = max(data, (d) => d.apr.toNumber()) || 0

  return getVerticalDomainWithPadding(minApr, maxApr)
}

const ChartWithTooltip = withTooltip<ChartProps, ChartDataPoint>(Chart)
export { ChartWithTooltip as RewardsChart }
