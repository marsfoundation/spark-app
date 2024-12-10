import { Token } from '@/domain/types/Token'
import { MigrationInfo } from '@/features/savings/logic/makeMigrationInfo'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { testIds } from '@/ui/utils/testIds'
import { UpgradeTokenButton } from './UpgradeTokenButton'

export interface TokenCellProps {
  token: Token
  migrationInfo?: MigrationInfo
}

export function TokenCell({ token, migrationInfo }: TokenCellProps) {
  if (migrationInfo?.daiSymbol === token.symbol && migrationInfo.daiToUsdsUpgradeAvailable) {
    return (
      <UpgradeTokenButton
        token={token}
        upgradedTokenSymbol={migrationInfo.usdsSymbol}
        onUpgradeClick={migrationInfo.openDaiToUsdsUpgradeDialog}
        data-testid={testIds.savings.stablecoinsInWallet.upgradeDaiToUsdsCell}
      />
    )
  }

  return (
    <div className="typography-label-2 flex flex-row items-center gap-2">
      <TokenIcon token={token} className="icon-md" />
      {token.symbol}
    </div>
  )
}
