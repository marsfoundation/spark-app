import { ApproveDelegationActionRow } from '../../flavours/approve-delegation/ApproveDelegationActionRow'
import { ApproveExchangeActionRow } from '../../flavours/approve-exchange/ApproveExchangeActionRow'
import { ApproveActionRow } from '../../flavours/approve/ApproveActionRow'
import { BorrowActionRow } from '../../flavours/borrow/BorrowActionRow'
import { DepositActionRow } from '../../flavours/deposit/DepositActionRow'
import { ExchangeActionRow } from '../../flavours/exchange/ExchangeActionRow'
import { NativeDaiDepositActionRow } from '../../flavours/native-dai-deposit/NativeDaiDepositActionRow'
import { NativeSDaiWithdrawActionRow } from '../../flavours/native-sdai-withdraw/NativeSDaiWithdrawActionRow'
import { NativeUSDCDepositActionRow } from '../../flavours/native-usdc-deposit/NativeUSDCDepositActionRow'
import { NativeXDaiDepositActionRow } from '../../flavours/native-xdai-deposit/NativeXDaiDepositActionRow'
import { RepayActionRow } from '../../flavours/repay/RepayActionRow'
import { SetUseAsCollateralActionRow } from '../../flavours/set-use-as-collateral/SetUseAsCollateralActionRow'
import { SetUserEModeActionRow } from '../../flavours/set-user-e-mode/SetUserEModeActionRow'
import { WithdrawActionRow } from '../../flavours/withdraw/WithdrawActionRow'
import { ActionHandler } from '../../logic/types'
import { ActionRowVariant } from '../action-row/types'

interface ActionsGridProps {
  actionHandlers: ActionHandler[]
  variant: ActionRowVariant
}

export function ActionsGrid({ actionHandlers, variant }: ActionsGridProps) {
  return (
    <div className="grid grid-cols-[auto_auto_1fr_auto] gap-x-4 md:grid-cols-[auto_auto_auto_1fr_auto]">
      {actionHandlers.map((handler, index) => {
        const props = {
          key: index,
          index: index + 1,
          actionHandlerState: handler.state,
          onAction: handler.onAction,
          variant,
        }

        switch (handler.action.type) {
          case 'approve':
            return <ApproveActionRow action={handler.action} {...props} />
          case 'approveDelegation':
            return <ApproveDelegationActionRow action={handler.action} {...props} />
          case 'approveExchange':
            return <ApproveExchangeActionRow action={handler.action} {...props} />
          case 'borrow':
            return <BorrowActionRow action={handler.action} {...props} />
          case 'deposit':
            return <DepositActionRow action={handler.action} {...props} />
          case 'exchange':
            return <ExchangeActionRow action={handler.action} {...props} />
          case 'permit':
            return <ApproveActionRow action={handler.action} {...props} />
          case 'repay':
            return <RepayActionRow action={handler.action} {...props} />
          case 'setUseAsCollateral':
            return <SetUseAsCollateralActionRow action={handler.action} {...props} />
          case 'setUserEMode':
            return <SetUserEModeActionRow action={handler.action} {...props} />
          case 'withdraw':
            return <WithdrawActionRow action={handler.action} {...props} />
          case 'nativeDaiDeposit':
            return <NativeDaiDepositActionRow action={handler.action} {...props} />
          case 'nativeUSDCDeposit':
            return <NativeUSDCDepositActionRow action={handler.action} {...props} />
          case 'nativeXDaiDeposit':
            return <NativeXDaiDepositActionRow action={handler.action} {...props} />
          case 'nativeSDaiWithdraw':
            return <NativeSDaiWithdrawActionRow action={handler.action} {...props} />
        }
      })}
    </div>
  )
}
