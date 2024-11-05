import { MarketAssetStatus } from '@/domain/market-info/reserve-status'
import { getVariantFromStatus } from '@/features/markets/components/asset-status-badge/getVariantFromStatus'
import CheckCircle from '@/ui/assets/check-circle.svg?react'
import XCircle from '@/ui/assets/x-circle.svg?react'
import { IndicatorIcon } from '@/ui/atoms/indicator-icon/IndicatorIcon'

interface StatusIconProps {
  status: MarketAssetStatus
  yesWhite?: boolean
  noRed?: boolean
}

export function StatusIcon({ status, yesWhite, noRed }: StatusIconProps) {
  const variant = getVariantFromStatus(status, { yesWhite, noRed })
  if (variant === 'green' || variant === 'orange') {
    return <IndicatorIcon icon={<CheckCircle />} variant={variant} className="self-center" />
  }
  return <IndicatorIcon icon={<XCircle />} variant={variant} className="self-center" />
}
