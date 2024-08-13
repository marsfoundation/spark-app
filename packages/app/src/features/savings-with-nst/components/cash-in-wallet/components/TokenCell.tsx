import { Token } from '@/domain/types/Token'
import { UpgradableDaiDetails } from '@/features/savings-with-nst/logic/useSavings'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { UpgradeTokenButton } from './UpgradeTokenButton'

export interface TokenCellProps {
  token: Token
  upgradableDaiDetails?: UpgradableDaiDetails
}

export function TokenCell({ token, upgradableDaiDetails }: TokenCellProps) {
  if (upgradableDaiDetails?.isUpgradable && token.symbol === upgradableDaiDetails.daiSymbol) {
    return <UpgradeTokenButton token={token} />
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <TokenIcon token={token} className="h-6 w-6" />
      {token.symbol}
    </div>
  )
}
