import { MarketAssetStatus } from '@/domain/market-info/reserve-status'
import { IndicatorIconVariant } from '@/ui/atoms/indicator-icon/IndicatorIcon'

export function getVariantFromStatus(status: MarketAssetStatus): IndicatorIconVariant {
  if (status === 'yes') {
    return 'success'
  }
  if (status === 'no') {
    return 'neutral'
  }
  if (status === 'supply-cap-reached' || status === 'borrow-cap-reached') {
    return 'error'
  }
  return 'warning'
}
