import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { ChartTooltipContent } from '@/ui/charts/ChartTooltipContent'
import { colors } from '@/ui/charts/colors'
import { Margins, defaultMargins } from '@/ui/charts/defaults'
import { formatTooltipDate, formatUSDTicks } from '@/ui/charts/utils'
import { useParentSize } from '@/ui/utils/useParentSize'
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
  totalStaked: NormalizedUnitNumber
}

export interface ChartProps {
  height?: number
  margins?: Margins
  xAxisNumTicks?: number
  yAxisNumTicks?: number
  data: ChartDataPoint[]
}

function Chart({
  height = 300, // @todo: will be refactored/extended
  margins = defaultMargins,
  xAxisNumTicks = 5,
  yAxisNumTicks = 5,
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipLeft = 0,
  data,
}: ChartProps & WithTooltipProvidedProps<ChartDataPoint>) {
  const [ref, { width }] = useParentSize()

  const innerWidth = width - margins.left - margins.right
  const innerHeight = height - margins.top - margins.bottom

  const xValueScale = scaleTime({
    range: [0, innerWidth],
    domain: extent(data, ({ date }) => date) as [Date, Date],
  })
  const yValueScale = scaleLinear({
    range: [innerHeight, 0],
    domain: calculateTvlDomain(data),
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
            y={(data) => yValueScale(data.totalStaked.toNumber())}
            curve={curveStepAfter}
          />
          <AreaClosed
            strokeWidth={2}
            data={data}
            x={(data) => xValueScale(data.date)}
            y={(data) => yValueScale(data.totalStaked.toNumber())}
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
            tickFormat={formatUSDTicks}
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
                  cy={yValueScale(tooltipData.totalStaked.toNumber())}
                  r={8}
                  fill={colors.primary}
                  pointerEvents="none"
                />
                <circle
                  cx={tooltipLeft}
                  cy={yValueScale(tooltipData.totalStaked.toNumber())}
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

function TooltipContent({ data }: { data: ChartDataPoint }) {
  return (
    <ChartTooltipContent>
      <ChartTooltipContent.Date>{formatTooltipDate(data.date)}</ChartTooltipContent.Date>
      <ChartTooltipContent.Value dotColor={colors.primary}>
        TVL: <span className="font-semibold">{USD_MOCK_TOKEN.formatUSD(data.totalStaked)}</span>
      </ChartTooltipContent.Value>
    </ChartTooltipContent>
  )
}

function calculateTvlDomain(data: ChartDataPoint[]): ContinuousDomain {
  const minTvl = min(data, (d) => d.totalStaked.toNumber()) || 0
  const maxTvl = max(data, (d) => d.totalStaked.toNumber()) || 0

  if (minTvl === maxTvl) {
    return [minTvl - 0.1, maxTvl + 0.1]
  }

  return [minTvl, maxTvl * 1.1] // 10% padding on top
}

const ChartWithTooltip = withTooltip<ChartProps, ChartDataPoint>(Chart)
export { ChartWithTooltip as TvlChart }
