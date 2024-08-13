import { Token } from '@/domain/types/Token'
import { DaiNstUpgradeInfo } from '@/features/savings-with-nst/logic/useSavings'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { UpgradeTokenButton } from './UpgradeTokenButton'

export interface TokenCellProps {
  token: Token
  daiNstUpgradeInfo?: DaiNstUpgradeInfo
}

export function TokenCell({ token, daiNstUpgradeInfo }: TokenCellProps) {
  if (daiNstUpgradeInfo?.daiSymbol === token.symbol) {
    return <UpgradeTokenButton token={token} upgradedTokenSymbol={daiNstUpgradeInfo.nstSymbol} />
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <TokenIcon token={token} className="h-6 w-6" />
      {token.symbol}
    </div>
  )
}
