import { Token } from '@/domain/types/Token'
import { UpgradeInfo } from '@/features/savings-with-nst/logic/useSavings'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { UpgradeTokenButton } from './UpgradeTokenButton'

export interface TokenCellProps {
  token: Token
  upgradeInfo?: UpgradeInfo
}

export function TokenCell({ token, upgradeInfo }: TokenCellProps) {
  if (upgradeInfo?.daiSymbol === token.symbol) {
    return (
      <UpgradeTokenButton
        token={token}
        upgradedTokenSymbol={upgradeInfo.NSTSymbol}
        onUpgradeClick={upgradeInfo.openDaiToNstUpgradeDialog}
      />
    )
  }

  return (
    <div className="flex flex-row items-center gap-2 font-semibold">
      <TokenIcon token={token} className="h-6 w-6" />
      {token.symbol}
    </div>
  )
}
