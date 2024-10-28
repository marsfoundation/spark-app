import BigNumber from 'bignumber.js'

import { RiskLevel, healthFactorToRiskLevel, riskLevelToTitle } from '@/domain/common/risk'

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
        <g transform={`translate(${x} ${y})`} stroke="red" fill="red">
          <text x="0" y="-5">
            1
          </text>
          <text x="-35" y="-5" fontSize="12" textAnchor="start">
            LIQ
          </text>
          <line x1="2" y1="0" x2="-35" y2="0" strokeWidth="3" />
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
      <path
        d="M0.76 182.57
                A200 200 0 0 1 91.07 32.27
                A10 10 0 0 1 101.96 49.04
                A180 180 0 0 0 20.68 184.31
                A10 10 0 0 1 0.76 182.57"
        className={getStripeClass(riskLevel, 'risky')}
        fill="currentColor"
      />
      <path
        d="M112.33 20.24
              A200 200 0 0 1 290.8 21.8
              A10 10 0 0 1 281.72 39.62
              A180 180 0 0 0 121.09 38.22
              A10 10 0 0 1 112.33 20.24"
        className={getStripeClass(riskLevel, 'moderate')}
        fill="currentColor"
      />
      <path
        d="M311.84 34.19
              A200 200 0 0 1 399.24 182.57
              A10 10 0 0 1 379.32 184.31
              A180 180 0 0 0 300.65 50.77
              A10 10 0 0 1 311.84 34.19"
        className={getStripeClass(riskLevel, 'healthy')}
        fill="currentColor"
      />
      <g strokeWidth="1" stroke="black" strokeOpacity="0.1">
        <line x1="25.0" y1="200.0" x2="35.0" y2="200.0" />
        <line x1="25.24" y1="190.84" x2="35.23" y2="191.36" />
        <line x1="25.96" y1="181.71" x2="35.9" y2="182.75" />
        <line x1="27.15" y1="172.62" x2="37.03" y2="174.19" />
        <line x1="28.82" y1="163.62" x2="38.61" y2="165.69" />
        <line x1="30.96" y1="154.71" x2="40.62" y2="157.29" />
        <line x1="33.57" y1="145.92" x2="43.08" y2="149.01" />
        <line x1="36.62" y1="137.29" x2="45.96" y2="140.87" />
        <line x1="40.13" y1="128.82" x2="49.26" y2="132.89" />
        <line x1="44.07" y1="120.55" x2="52.98" y2="125.09" />
        <line x1="48.45" y1="112.5" x2="57.11" y2="117.5" />
        <line x1="53.23" y1="104.69" x2="61.62" y2="110.13" />
        <line x1="58.42" y1="97.14" x2="66.51" y2="103.02" />
        <line x1="64.0" y1="89.87" x2="71.77" y2="96.16" />
        <line x1="69.95" y1="82.9" x2="77.38" y2="89.59" />
        <line x1="76.26" y1="76.26" x2="83.33" y2="83.33" />
        <line x1="82.9" y1="69.95" x2="89.59" y2="77.38" />
        <line x1="89.87" y1="64.0" x2="96.16" y2="71.77" />
        <line x1="97.14" y1="58.42" x2="103.02" y2="66.51" />
        <line x1="104.69" y1="53.23" x2="110.13" y2="61.62" />
        <line x1="112.5" y1="48.45" x2="117.5" y2="57.11" />
        <line x1="120.55" y1="44.07" x2="125.09" y2="52.98" />
        <line x1="128.82" y1="40.13" x2="132.89" y2="49.26" />
        <line x1="137.29" y1="36.62" x2="140.87" y2="45.96" />
        <line x1="145.92" y1="33.57" x2="149.01" y2="43.08" />
        <line x1="154.71" y1="30.96" x2="157.29" y2="40.62" />
        <line x1="163.62" y1="28.82" x2="165.69" y2="38.61" />
        <line x1="172.62" y1="27.15" x2="174.19" y2="37.03" />
        <line x1="181.71" y1="25.96" x2="182.75" y2="35.9" />
        <line x1="190.84" y1="25.24" x2="191.36" y2="35.23" />
        <line x1="200.0" y1="25.0" x2="200.0" y2="35.0" />
        <line x1="209.16" y1="25.24" x2="208.64" y2="35.23" />
        <line x1="218.29" y1="25.96" x2="217.25" y2="35.9" />
        <line x1="227.38" y1="27.15" x2="225.81" y2="37.03" />
        <line x1="236.38" y1="28.82" x2="234.31" y2="38.61" />
        <line x1="245.29" y1="30.96" x2="242.71" y2="40.62" />
        <line x1="254.08" y1="33.57" x2="250.99" y2="43.08" />
        <line x1="262.71" y1="36.62" x2="259.13" y2="45.96" />
        <line x1="271.18" y1="40.13" x2="267.11" y2="49.26" />
        <line x1="279.45" y1="44.07" x2="274.91" y2="52.98" />
        <line x1="287.5" y1="48.45" x2="282.5" y2="57.11" />
        <line x1="295.31" y1="53.23" x2="289.87" y2="61.62" />
        <line x1="302.86" y1="58.42" x2="296.98" y2="66.51" />
        <line x1="310.13" y1="64.0" x2="303.84" y2="71.77" />
        <line x1="317.1" y1="69.95" x2="310.41" y2="77.38" />
        <line x1="323.74" y1="76.26" x2="316.67" y2="83.33" />
        <line x1="330.05" y1="82.9" x2="322.62" y2="89.59" />
        <line x1="336.0" y1="89.87" x2="328.23" y2="96.16" />
        <line x1="341.58" y1="97.14" x2="333.49" y2="103.02" />
        <line x1="346.77" y1="104.69" x2="338.38" y2="110.13" />
        <line x1="351.55" y1="112.5" x2="342.89" y2="117.5" />
        <line x1="355.93" y1="120.55" x2="347.02" y2="125.09" />
        <line x1="359.87" y1="128.82" x2="350.74" y2="132.89" />
        <line x1="363.38" y1="137.29" x2="354.04" y2="140.87" />
        <line x1="366.43" y1="145.92" x2="356.92" y2="149.01" />
        <line x1="369.04" y1="154.71" x2="359.38" y2="157.29" />
        <line x1="371.18" y1="163.62" x2="361.39" y2="165.69" />
        <line x1="372.85" y1="172.62" x2="362.97" y2="174.19" />
        <line x1="374.04" y1="181.71" x2="364.1" y2="182.75" />
        <line x1="374.76" y1="190.84" x2="364.77" y2="191.36" />
        <line x1="375.0" y1="200.0" x2="365.0" y2="200.0" />
      </g>
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
        <circle cx="200" cy="200" r="100" fill="white/10" />
        {riskLevel === 'unknown' ? null : (
          <path
            d="M206.98 100.24
                L201.92 90.02
                A1.92 1.92 0 0 0 198.08 90.02
                L193.02 100.24
                Z
        "
          />
        )}
      </g>
      <g fontSize="24" className={arrowColor} fill="currentColor" textAnchor="middle">
        <text x="200" y="170">
          {riskLevel === 'unknown' ? '' : riskLevelToTitle[riskLevel]}
        </text>
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
    const [x, y] = getPointOnCircle(200, 200, angle, 140)
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

const INACTIVE_COLORS: Record<RiskLevel, string> = {
  liquidation: 'text-product-red/inactive',
  risky: 'text-product-red/inactive',
  moderate: 'text-product-orange/inactive',
  healthy: 'text-product-green/inactive',
  'no debt': 'text-product-green/inactive',
  unknown: 'text-white/10',
}

function getStripeClass(riskLevel: RiskLevel, stripeRiskLevel: RiskLevel): string {
  if (riskLevel === 'unknown') return COLORS.unknown
  return riskLevel === stripeRiskLevel ? COLORS[riskLevel] : INACTIVE_COLORS[stripeRiskLevel]
}
