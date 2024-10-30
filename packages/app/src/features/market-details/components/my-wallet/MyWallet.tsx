import { BorrowEligibilityStatus } from '@/domain/market-info/reserve-status'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { borrowDialogConfig } from '@/features/dialogs/borrow/BorrowDialog'
import { depositDialogConfig } from '@/features/dialogs/deposit/DepositDialog'
import { Panel } from '@/ui/atoms/panel/Panel'
import { ActionRow } from './components/ActionRow'
import { BorrowRow } from './components/BorrowRow'
import { TokenBalance } from './components/TokenBalance'
import { WalletPanelContent } from './components/WalletPanelContent'

export interface MyWalletProps {
  token: Token
  tokenBalance: NormalizedUnitNumber
  lend?: {
    available: NormalizedUnitNumber
    token: Token
  }
  deposit: {
    available: NormalizedUnitNumber
    token: Token
  }
  borrow: {
    available: NormalizedUnitNumber
    token: Token
    eligibility: BorrowEligibilityStatus
  }
  openDialog: OpenDialogFunction
}

export function MyWallet({ token, tokenBalance, lend, deposit, borrow, openDialog }: MyWalletProps) {
  return (
    <Panel.Wrapper>
      <WalletPanelContent>
        <h3 className="font-semibold text-base md:text-xl">My Wallet</h3>
        <TokenBalance token={token} balance={tokenBalance} />
        {lend && (
          <ActionRow
            token={lend.token}
            value={lend.available}
            onAction={() => openDialog(depositDialogConfig, { token: lend.token })}
            label="Available to lend"
            buttonText="Lend"
          />
        )}
        <ActionRow
          token={deposit.token}
          value={deposit.available}
          onAction={() => openDialog(depositDialogConfig, { token: deposit.token })}
          label={token.symbol === 'DAI' ? 'Deposit DAI as collateral' : 'Available to deposit'}
          buttonText="Deposit"
        />
        <BorrowRow
          token={borrow.token}
          onAction={() => openDialog(borrowDialogConfig, { token: borrow.token })}
          availableToBorrow={borrow.available}
          eligibility={borrow.eligibility}
        />
      </WalletPanelContent>
    </Panel.Wrapper>
  )
}
