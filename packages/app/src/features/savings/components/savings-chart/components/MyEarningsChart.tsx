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
import { MouseEvent, TouchEvent } from 'react'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { Margins, POINT_RADIUS, defaultMargins } from '@/ui/charts/defaults'
import { formatDateTick, formatTooltipDate, formatUSDTicks } from '@/ui/charts/utils'
import { useParentSize } from '@/ui/utils/useParentSize'
import { Circle } from 'lucide-react'

export interface ChartDataPoint {
  balance: NormalizedUnitNumber
  date: Date
}

const colors = {
  tooltipLine: '#6A7692',
  dot: '#0B2140',
  dotStroke: 'white',
  backgroundLine: '#D9D9D9',
  axisTickLabel: '#6A7692',
  primary: '#3F66EF',
  secondary: '#BECAF9',
}

export interface ChartProps {
  height: number
  margins?: Margins
  xAxisNumTicks?: number
  yAxisNumTicks?: number
  data: ChartDataPoint[]
  predictions: ChartDataPoint[]
}

function MyEarningsChart({
  height,
  margins = defaultMargins,
  xAxisNumTicks = 5,
  yAxisNumTicks = 5,
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipLeft = 0,
  data,
  predictions,
}: ChartProps & WithTooltipProvidedProps<ChartDataPoint>) {
  const [ref, { width }] = useParentSize()

  const innerWidth = width - margins.left - margins.right
  const innerHeight = height - margins.top - margins.bottom
  const xAxisData = [...data, ...predictions]

  const xValueScale = scaleTime({
    range: [0, innerWidth],
    domain: extent(xAxisData, ({ date }) => date) as [Date, Date],
  })
  const yValueScale = scaleLinear({
    range: [innerHeight, 0],
    domain: calculateBalanceDomain(xAxisData),
    nice: true,
  })

  function handleTooltip(event: TouchEvent<SVGRectElement> | MouseEvent<SVGRectElement>): void {
    const point = localPoint(event) || { x: 0 }
    const x = point.x - margins.left
    const domainX = xValueScale.invert(x)
    const lastSmallerElement =
      xAxisData.reduce(
        (prev, curr) => (curr.date.getTime() < domainX.getTime() ? curr : prev),
        null as ChartDataPoint | null,
      ) || xAxisData[0]

    showTooltip({
      tooltipData: lastSmallerElement,
      tooltipLeft: x,
    })
  }

  const dataLastElement = data[data.length - 1]

  const chartParts = [
    {
      key: 'data',
      balance: data,
      color: colors.primary,
    },
    {
      key: 'predictions',
      balance: predictions,
      color: colors.secondary,
    },
  ]

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

          {chartParts.map(({ balance, color, key }) => (
            <g key={key}>
              <LinearGradient id={`area-gradient-${key}`} from={color} to={color} fromOpacity={0.5} toOpacity={0} />

              <AreaClosed
                strokeWidth={2}
                data={balance}
                x={(data) => xValueScale(data.date)}
                y={(data) => yValueScale(data.balance.toNumber())}
                yScale={yValueScale}
                curve={curveStepAfter}
                fill={`url(#area-gradient-${key})`}
              />

              <LinePath
                stroke={color}
                strokeWidth={2}
                data={balance}
                x={(data) => xValueScale(data.date)}
                y={(data) => yValueScale(data.balance.toNumber())}
                curve={curveStepAfter}
              />
            </g>
          ))}

          {dataLastElement && (
            <circle
              cx={xValueScale(dataLastElement.date)}
              cy={yValueScale(dataLastElement.balance.toNumber())}
              r={POINT_RADIUS}
              fill={colors.primary}
              pointerEvents="none"
            />
          )}

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
              <circle
                cx={tooltipLeft}
                cy={yValueScale(tooltipData.balance.toNumber())}
                r={8}
                fill={colors.primary}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={yValueScale(tooltipData.balance.toNumber())}
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
          <TooltipContent data={tooltipData} />
        </TooltipWithBounds>
      )}
    </div>
  )
}

function TooltipContent({ data }: { data: ChartDataPoint }) {
  const isPrediction = isDataPointPrediction(data)

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-700/10 bg-white p-3 shadow">
      <div className="flex flex-col gap-3 text-slate-500 text-xs leading-none">{formatTooltipDate(data.date)}</div>
      <div className="flex items-center gap-1.5 text-sm leading-none">
        <Circle size={8} fill={isPrediction ? colors.secondary : colors.primary} stroke="0" />
        <div>
          Savings{isPrediction && ' Prediction'}:{' '}
          <span className="font-semibold">{USD_MOCK_TOKEN.formatUSD(data.balance)}</span>
        </div>
      </div>
    </div>
  )
}

function isDataPointPrediction(dataPoint: ChartDataPoint): boolean {
  return Date.now() < dataPoint.date.getTime()
}

function calculateBalanceDomain(data: ChartDataPoint[]): ContinuousDomain {
  const minBalance = min(data, (d) => d.balance.toNumber()) || 0
  const maxBalance = max(data, (d) => d.balance.toNumber()) || 0

  if (minBalance === maxBalance) {
    return [minBalance - 0.1, maxBalance + 0.1]
  }

  return [minBalance, maxBalance * 1.1] // 10% padding on top
}

const MyEarningsChartWithTooltip = withTooltip<ChartProps, ChartDataPoint>(MyEarningsChart)

export { MyEarningsChartWithTooltip as MyEarningsChart }
