import { MarketAssetStatus } from '@/domain/market-info/reserve-status'

export type Variant = 'supply' | 'collateral' | 'borrow' | 'lend' | 'e-mode'

interface HeaderProps {
  status: MarketAssetStatus
  variant: Variant
}

export function Header({ status, variant }: HeaderProps) {
  return (
    <div className="flex items-center gap-1.5">
      <h4 className="font-semibold text-base sm:text-xl">{getHeaderText(status, variant)}</h4>
      {/* @todo: Introduce info when copy is available */}
      {/* <Info>Info text</Info> */}
    </div>
  )
}

function getHeaderText(status: MarketAssetStatus, variant: Variant): string {
  if (variant === 'supply') {
    switch (status) {
      case 'yes':
        return 'Can be supplied'
      default:
        return 'Cannot be supplied'
    }
  }

  if (variant === 'collateral') {
    switch (status) {
      case 'yes':
        return 'Can be used as collateral'
      case 'only-in-isolation-mode':
        return 'Can be used as collateral in Isolation Mode'
      default:
        return 'Cannot be used as collateral'
    }
  }

  if (variant === 'borrow') {
    switch (status) {
      case 'yes':
        return 'Can be borrowed'
      case 'only-in-siloed-mode':
        return 'Can be borrowed only in Siloed Mode'
      default:
        return 'Cannot be borrowed'
    }
  }

  if (variant === 'lend') {
    switch (status) {
      case 'yes':
        return 'Can be lent'
      default:
        return 'Cannot be lent'
    }
  }

  // variant === 'e-mode'
  switch (status) {
    case 'yes':
      return 'Can be used in E-Mode'
    default:
      return 'Cannot be used in E-Mode'
  }
}
