import { MarketAssetStatus } from '@/domain/market-info/reserve-status'

type StatusVariant = 'green' | 'gray' | 'orange' | 'red' | 'white'
type options = { yesWhite?: boolean; noRed?: boolean }

export function getVariantFromStatus(status: MarketAssetStatus, { yesWhite, noRed }: options = {}): StatusVariant {
  if (status === 'yes') {
    return yesWhite ? 'white' : 'green'
  }
  if (status === 'no') {
    return noRed ? 'red' : 'gray'
  }
  if (status === 'supply-cap-reached' || status === 'borrow-cap-reached') {
    return 'red'
  }
  return 'orange'
}
