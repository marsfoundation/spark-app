import { formatHealthFactor } from '@/domain/common/format'
import { RiskLevel, healthFactorToRiskLevel, riskLevelToTitle } from '@/domain/common/risk'
import { cn } from '@/ui/utils/style'
import BigNumber from 'bignumber.js'

const GAUGE_MIN = 1
const GAUGE_MAX = 4

export interface HealthFactorGaugeProps {
  value: BigNumber | undefined
  className?: string
}

export function HealthFactorGauge({ value, className }: HealthFactorGaugeProps) {
  const croppedValue = Math.max(GAUGE_MIN, Math.min(GAUGE_MAX, value?.toNumber() ?? 0))
  const riskLevel = healthFactorToRiskLevel(value)
  const angle = 180 - ((croppedValue - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)) * 180
  const gradient = riskLevelToGradient(riskLevel)
  const maskSecondPoint = {
    x: 200 + Math.cos((angle * Math.PI) / 180) * 180,
    y: 200 - Math.sin((angle * Math.PI) / 180) * 180,
  }
  const indicatorLineCoords = {
    x1: 200 + Math.cos((angle * Math.PI) / 180) * 200,
    y1: 200 - Math.sin((angle * Math.PI) / 180) * 200,
    x2: 200 + Math.cos((angle * Math.PI) / 180) * 160,
    y2: 200 - Math.sin((angle * Math.PI) / 180) * 160,
  }
  const showIndicatorLine = riskLevel === 'healthy' || riskLevel === 'moderate' || riskLevel === 'risky'

  return (
    <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 400 200" className={className}>
      <path d="M20 200 A 180 180 0 0 1 380 200" stroke-width="40" stroke="#373642" />
      <mask id="arc-mask">
        <path
          d={`M20 200 A 180 180 0 0 1 ${maskSecondPoint.x} ${maskSecondPoint.y}`}
          stroke-width="40"
          stroke="white"
        />
      </mask>
      <foreignObject width="100%" height="100%">
        <div
          style={{
            width: '400px',
            height: '400px',
            background: gradient,
            mask: 'url(#arc-mask)',
          }}
        />
      </foreignObject>

      <path d="M50 200 A150 150 0 0 1 122.74428876349187 71.42490489468315" stroke="#FA5768" stroke-width="2" />
      <path
        d="M127.27855696304945 68.80704392909061 A150 150 0 0 1 272.7214430369506 68.80704392909061"
        stroke="#EDAA00"
        stroke-width="2"
      />
      <path d="M277.25571123650815 71.42490489468315 A150 150 0 0 1 350 200" stroke="#00C2A1" stroke-width="2" />

      <text x="65" y="200" fill="#908E9E" textAnchor="middle" className="typography-label-6">
        1
      </text>
      <text
        x="87.4167"
        y="135"
        fill="#908E9E"
        textAnchor="middle"
        dominantBaseline="middle"
        className="typography-label-6"
      >
        1.5
      </text>
      <text
        x="135"
        y="87.4167"
        fill="#908E9E"
        textAnchor="middle"
        dominantBaseline="middle"
        className="typography-label-6"
      >
        2
      </text>
      <text x="200" y="70" fill="#908E9E" textAnchor="middle" dominantBaseline="middle" className="typography-label-6">
        2.5
      </text>
      <text
        x="265"
        y="87.4167"
        fill="#908E9E"
        textAnchor="middle"
        dominantBaseline="middle"
        className="typography-label-6"
      >
        3
      </text>
      <text
        x="312.5833"
        y="135"
        fill="#908E9E"
        textAnchor="middle"
        dominantBaseline="middle"
        className="typography-label-6"
      >
        3.5
      </text>
      <text x="335" y="200" fill="#908E9E" textAnchor="middle" className="typography-label-6">
        4
      </text>

      <path d="M26.7949 100 L61.4359 120" stroke="black" stroke-width="1" />
      <path d="M100 26.7949 L120, 61.4359" stroke="black" stroke-width="1" />
      <path d="M200 0 L200 40" stroke="black" stroke-width="1" />
      <path d="M300 26.7949 L280 61.4359" stroke="black" stroke-width="1" />
      <path d="M373.20508 100 L338.564 120" stroke="black" stroke-width="1" />

      {showIndicatorLine && (
        <path
          d={`M${indicatorLineCoords.x1} ${indicatorLineCoords.y1} L${indicatorLineCoords.x2} ${indicatorLineCoords.y2}`}
          stroke="white"
          stroke-width="2"
        />
      )}

      <foreignObject width="100%" height="100%">
        <div className="flex h-full w-full flex-col items-center justify-end gap-2">
          <div
            className={cn(
              'typography-label-4 rounded-full p-2 text-primary',
              (riskLevel === 'risky' || riskLevel === 'liquidation') && 'bg-[#EE374F]',
              riskLevel === 'moderate' && 'bg-[#EDA902]',
              (riskLevel === 'healthy' || riskLevel === 'no debt') && 'bg-[#00C2A1]',
              riskLevel === 'unknown' && 'bg-neutral-500',
            )}
          >
            {riskLevelToTitle[riskLevel]}
          </div>
          <div className="typography-display-3 text-white">
            {riskLevel === 'unknown' ? '-' : formatHealthFactor(value)}
          </div>
        </div>
      </foreignObject>
    </svg>
  )
}

function riskLevelToGradient(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'liquidation':
    case 'risky':
      return 'conic-gradient(from 270deg, white, #FA5768 16.67%)'
    case 'moderate':
      return 'conic-gradient(from 270deg, white, #EDAA00 33.33%)'
    case 'healthy':
    case 'no debt':
      return 'conic-gradient(from 270deg, white, #00C2A1 50%)'
    case 'unknown':
      return 'conic-gradient(from 270deg, #373642, #373642 100%)'
  }
}
