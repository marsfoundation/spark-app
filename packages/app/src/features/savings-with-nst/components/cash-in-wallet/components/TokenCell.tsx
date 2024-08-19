import { Token } from '@/domain/types/Token'
import { MigrationInfo } from '@/features/savings-with-nst/logic/makeMigrationInfo'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { UpgradeTokenButton } from './UpgradeTokenButton'

export interface TokenCellProps {
  token: Token
  migrationInfo?: MigrationInfo
}

export function TokenCell({ token, migrationInfo }: TokenCellProps) {
  if (migrationInfo?.daiSymbol === token.symbol && migrationInfo.daiToNstUpgradeAvailable) {
    return (
      <UpgradeTokenButton
        token={token}
        upgradedTokenSymbol={migrationInfo.nstSymbol}
        onUpgradeClick={migrationInfo.openDaiToNstUpgradeDialog}
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
