import BigNumber from 'bignumber.js'

import { RiskLevel, healthFactorToRiskLevel } from '@/domain/common/risk'

export interface HealthFactorGaugeProps {
  value: BigNumber | undefined
  className?: string
}

const GAUGE_MIN = 1
const GAUGE_MAX = 4
const LABELS_COORDINATES = getLabels({ numLabels: 7, labelsStart: GAUGE_MIN, labelsEnd: GAUGE_MAX })

const COLORS: Record<RiskLevel, string> = {
  liquidation: 'text-product-red',
  risky: 'text-product-red',
  moderate: 'text-product-orange',
  healthy: 'text-product-green',
  'no debt': 'text-product-green',
  unknown: 'text-white/10',
}

const GRADIENT_IDS = {
  active: 'health-factor-gradient-active',
  inactive: 'health-factor-gradient-inactive',
} as const

export function HealthFactorGauge(props: HealthFactorGaugeProps) {
  const value = props.value ? props.value.toNumber() : GAUGE_MIN
  const croppedValue = Math.max(GAUGE_MIN, Math.min(GAUGE_MAX, value))
  const closestValue = findClosestNumber(
    LABELS_COORDINATES.map(({ value }) => value),
    croppedValue,
  )
  const riskLevel = healthFactorToRiskLevel(props.value)
  const arrowColor = COLORS[riskLevel]
  const arrowRotation = ((croppedValue - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN) - 0.5) * 170

  function LabelComponent({ value, x, y }: { value: number; x: number; y: number }) {
    if (value === 1) {
      return riskLevel === 'unknown' ? (
        <text x={x} y={y} fillOpacity={0.5}>
          1
        </text>
      ) : (
        <g
          transform={`translate(${x} ${y})`}
          stroke={closestValue === value ? '#FC3897' : 'currentColor'}
          fill={closestValue === value ? '#FC3897' : 'currentColor'}
          opacity={closestValue === value ? 1 : 0.5}
        >
          <text x="0" y="-15">
            1
          </text>
          <text x="-25" y="0" fontSize="12" textAnchor="start">
            Liquidation
          </text>
        </g>
      )
    }
    if (value === GAUGE_MAX) {
      return (
        <text x={x} y={y} fillOpacity={closestValue === value ? 1 : 0.5}>
          {GAUGE_MAX}
          <tspan fontSize="14" baselineShift="super" dy="-0.25em">
            +
          </tspan>
        </text>
      )
    }

    return (
      <text x={x} y={y} fillOpacity={closestValue === value ? 1 : 0.5}>
        {value}
      </text>
    )
  }

  return (
    <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 400 200" className={props.className}>
      <defs>
        <linearGradient id={GRADIENT_IDS.active} gradientUnits="userSpaceOnUse" x1="0" x2="400" y1="100" y2="100">
          <stop offset="0%" className="text-product-red" stopColor="currentColor" />
          <stop offset="50%" className="text-product-orange" stopColor="currentColor" />
          <stop offset="100%" className="text-product-green" stopColor="currentColor" />
        </linearGradient>
      </defs>

      <path
        d="M10.76 182.57
        A190 190 0 0 1 389.24 182.57
        A3 3 0 0 1 384.32 183.31
        A185 185 0 0 0 15.68 183.31
        A3 3 0 0 1 10.76 182.57"
        fill={riskLevel === 'unknown' ? 'hsla(0 0% 100% / 0.3)' : `url(#${GRADIENT_IDS.active})`}
      />

      <g fontSize="24" fill="white" textAnchor="middle">
        {LABELS_COORDINATES.map(({ x, y, value }) => (
          <LabelComponent key={JSON.stringify({ x, y })} x={x} y={y} value={value} />
        ))}
      </g>

      <g
        strokeWidth="5"
        className={arrowColor}
        stroke="currentColor"
        fill="currentColor"
        transform={`rotate(${arrowRotation} 200 200)`}
      >
        {riskLevel === 'unknown' ? null : <path d="M 200 0 L 200 25" stroke="white" strokeWidth="1" />}
      </g>
    </svg>
  )
}

function getPointOnCircle(x: number, y: number, angle: number, radius: number): [number, number] {
  // Convert angle to radians
  const angleRad = (angle * Math.PI) / 180

  // Calculate the coordinates of the point on the circle
  const xNew = x + radius * Math.cos(angleRad)
  const yNew = y - radius * Math.sin(angleRad) // Inverted y-axis

  return [Number(xNew.toFixed(2)), Number(yNew.toFixed(2))]
}

interface GetLabelsCoordinatesOptions {
  numLabels: number
  labelsStart: number
  labelsEnd: number
}
function getLabels({
  numLabels,
  labelsStart,
  labelsEnd,
}: GetLabelsCoordinatesOptions): { x: number; y: number; value: number }[] {
  return Array.from({ length: numLabels }, (_, index) => {
    const angle = 175 - index * (170 / (numLabels - 1))
    const [x, y] = getPointOnCircle(200, 200, angle, 145)
    const value = labelsStart + index * ((labelsEnd - labelsStart) / (numLabels - 1))
    return { x, y, value }
  })
}

function findClosestNumber(arr: number[], target: number): number {
  let closest = arr[0]!

  for (let i = 1; i < arr.length; i++) {
    if (Math.abs(target - arr[i]!) < Math.abs(target - closest!)) {
      closest = arr[i]!
    }
  }

  return closest
}
