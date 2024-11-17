import { formatHealthFactor } from '@/domain/common/format'
import { healthFactorToRiskLevel, riskLevelToTitle } from '@/domain/common/risk'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import BigNumber from 'bignumber.js'
import { useId } from 'react'

const GAUGE_MIN = 1
const GAUGE_MAX = 4

export interface HealthFactorGaugeProps {
  value: BigNumber | undefined
  className?: string
}

export function HealthFactorGauge({ value, className }: HealthFactorGaugeProps) {
  const id = useId()

  const croppedValue = Math.max(GAUGE_MIN, Math.min(GAUGE_MAX, value?.toNumber() ?? 0))
  const riskLevel = healthFactorToRiskLevel(value)
  const angle = 180 - ((croppedValue - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)) * 180
  const gradientSecondPoint = {
    x: 200 + Math.cos((angle * Math.PI) / 180) * 200,
    y: 200 - Math.sin((angle * Math.PI) / 180) * 200,
  }
  const gradientThirdPoint = {
    x: 200 + Math.cos((angle * Math.PI) / 180) * 160,
    y: 200 - Math.sin((angle * Math.PI) / 180) * 160,
  }
  const indicatorLineCoords = {
    x1: 200 + Math.cos((angle * Math.PI) / 180) * 200,
    y1: 200 - Math.sin((angle * Math.PI) / 180) * 200,
    x2: 200 + Math.cos((angle * Math.PI) / 180) * 160,
    y2: 200 - Math.sin((angle * Math.PI) / 180) * 160,
  }
  const showIndicatorLine = riskLevel === 'healthy' || riskLevel === 'moderate' || riskLevel === 'risky'

  const gradientRiskyId = `gradient-risky-${id}`
  const gradientModerateId = `gradient-moderate-${id}`
  const gradientHealthyId = `gradient-healthy-${id}`
  const gradientUnknownId = `gradient-unknown-${id}`

  const gradientId = (() => {
    switch (riskLevel) {
      case 'liquidation':
      case 'risky':
        return gradientRiskyId
      case 'moderate':
        return gradientModerateId
      case 'healthy':
      case 'no debt':
        return gradientHealthyId
      case 'unknown':
        return gradientUnknownId
    }
  })()

  return (
    <div
      className={cn('relative h-fit w-fit', className)}
      style={{
        container: 'sidebar / inline-size',
      }}
    >
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 400 200">
        <path d="M20 200 A 180 180 0 0 1 380 200" strokeWidth="40" stroke="#373642" fill="none" />
        <defs>
          <linearGradient id={gradientRiskyId}>
            <stop offset="0%" stopColor="#FFDDDF" />
            <stop offset="100%" stopColor="#FA5768" />
          </linearGradient>
          <linearGradient id={gradientModerateId}>
            <stop offset="0%" stopColor="#FDF8EB" />
            <stop offset="100%" stopColor="#EDAA00" />
          </linearGradient>
          <linearGradient id={gradientHealthyId}>
            <stop offset="0%" stopColor="#D7F5F0" />
            <stop offset="100%" stopColor="#00C2A1" />
          </linearGradient>
          <linearGradient id={gradientUnknownId}>
            <stop offset="0%" stopColor="#373642" />
            <stop offset="100%" stopColor="#373642" />
          </linearGradient>
        </defs>
        <path
          d={`M0 200 A 200 200 0 0 1 ${gradientSecondPoint.x} ${gradientSecondPoint.y} L ${gradientThirdPoint.x} ${gradientThirdPoint.y} A 160 160 0 0 0 40 200 Z`}
          fill={`url(#${gradientId})`}
        />

        <path
          d="M50 200 A150 150 0 0 1 122.74428876349187 71.42490489468315"
          stroke="#FA5768"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M127.27855696304945 68.80704392909061 A150 150 0 0 1 272.7214430369506 68.80704392909061"
          stroke="#EDAA00"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M277.25571123650815 71.42490489468315 A150 150 0 0 1 350 200"
          stroke="#00C2A1"
          strokeWidth="2"
          fill="none"
        />

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
        <text
          x="200"
          y="70"
          fill="#908E9E"
          textAnchor="middle"
          dominantBaseline="middle"
          className="typography-label-6"
        >
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

        <path d="M26.7949 100 L61.4359 120" stroke="black" strokeWidth="1" />
        <path d="M100 26.7949 L120, 61.4359" stroke="black" strokeWidth="1" />
        <path d="M200 0 L200 40" stroke="black" strokeWidth="1" />
        <path d="M300 26.7949 L280 61.4359" stroke="black" strokeWidth="1" />
        <path d="M373.20508 100 L338.564 120" stroke="black" strokeWidth="1" />

        {showIndicatorLine && (
          <path
            d={`M${indicatorLineCoords.x1} ${indicatorLineCoords.y1} L${indicatorLineCoords.x2} ${indicatorLineCoords.y2}`}
            stroke="white"
            strokeWidth="2"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-end gap-2">
        {riskLevel !== 'unknown' && (
          <div
            className={cn(
              'rounded-full p-2 font-roobert text-primary',
              (riskLevel === 'risky' || riskLevel === 'liquidation') && 'bg-[#EE374F]',
              riskLevel === 'moderate' && 'bg-[#EDA902]',
              (riskLevel === 'healthy' || riskLevel === 'no debt') && 'bg-[#00C2A1]',
            )}
            style={{
              fontSize: '4cqw',
              lineHeight: '4.5cqw',
            }}
          >
            {riskLevelToTitle[riskLevel]}
          </div>
        )}
        <div
          className="text-white"
          data-testid={testIds.component.HealthFactorGauge.value}
          style={{
            fontSize: '14cqw',
            lineHeight: '14cqw',
          }}
        >
          {riskLevel === 'unknown' ? '-' : formatHealthFactor(value)}
        </div>
      </div>
    </div>
  )
}
