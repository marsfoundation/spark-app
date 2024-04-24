import { MarketAssetStatus } from '@/domain/market-info/reserve-status'

type StatusVariant = 'green' | 'gray' | 'orange' | 'red'

export function getVariantFromStatus(status: MarketAssetStatus): StatusVariant {
  if (status === 'yes') {
    return 'green'
  }
  if (status === 'no') {
    return 'gray'
  }
  if (status === 'supply-cap-reached' || status === 'borrow-cap-reached') {
    return 'red'
  }
  return 'orange'
}
