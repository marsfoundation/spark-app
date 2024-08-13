import { Token } from '@/domain/types/Token'
import { UpgradeInfo } from '@/features/savings-with-nst/logic/useSavings'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { UpgradeTokenButton } from './UpgradeTokenButton'

export interface TokenCellProps {
  token: Token
  upgradeInfo?: UpgradeInfo
}

export function TokenCell({ token, upgradeInfo }: TokenCellProps) {
  if (upgradeInfo?.isUpgradable && token.symbol === upgradeInfo.tokenToUpgrade) {
    return <UpgradeTokenButton token={token} upgradedTokenSymbol={upgradeInfo.upgradedToken} />
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <TokenIcon token={token} className="h-6 w-6" />
      {token.symbol}
    </div>
  )
}
