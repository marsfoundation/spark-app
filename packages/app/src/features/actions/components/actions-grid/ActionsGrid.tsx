import { ApproveDelegationActionRow } from '../../flavours/approve-delegation/ApproveDelegationActionRow'
import { ApproveActionRow } from '../../flavours/approve/ApproveActionRow'
import { BorrowActionRow } from '../../flavours/borrow/BorrowActionRow'
import { ClaimRewardsActionRow } from '../../flavours/claim-rewards/ClaimRewardsActionRow'
import { DepositActionRow } from '../../flavours/deposit/DepositActionRow'
import { MakerStableToSavingsActionRow } from '../../flavours/native-sdai-deposit/maker-stables/MakerStableToSavingsActionRow'
import { MigrateDAIToSNSTActionActionRow } from '../../flavours/native-sdai-deposit/migrate-dai-to-snst/MigrateDAIToSNSTAction'
import { USDCToSDaiDepositActionRow } from '../../flavours/native-sdai-deposit/usdc-to-sdai/USDCToSDaiDepositActionRow'
import { XDaiToSDaiDepositActionRow } from '../../flavours/native-sdai-deposit/xdai-to-sdai/XDaiToSDaiDepositActionRow'
import { DaiFromSDaiWithdrawActionRow } from '../../flavours/native-sdai-withdraw/dai-from-sdai/DaiFromSDaiWithdrawActionRow'
import { USDCFromSDaiWithdrawActionRow } from '../../flavours/native-sdai-withdraw/usdc-from-sdai/USDCFromSDaiWithdrawActionRow'
import { XDaiFromSDaiWithdrawActionRow } from '../../flavours/native-sdai-withdraw/xdai-from-sdai/XDaiFromSDaiWithdrawActionRow'
import { PermitActionRow } from '../../flavours/permit/PermitActionRow'
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
          case 'borrow':
            return <BorrowActionRow action={handler.action} {...props} />
          case 'deposit':
            return <DepositActionRow action={handler.action} {...props} />
          case 'permit':
            return <PermitActionRow action={handler.action} {...props} />
          case 'repay':
            return <RepayActionRow action={handler.action} {...props} />
          case 'setUseAsCollateral':
            return <SetUseAsCollateralActionRow action={handler.action} {...props} />
          case 'setUserEMode':
            return <SetUserEModeActionRow action={handler.action} {...props} />
          case 'withdraw':
            return <WithdrawActionRow action={handler.action} {...props} />
          case 'makerStableToSavings':
            return <MakerStableToSavingsActionRow action={handler.action} {...props} />
          case 'daiFromSDaiWithdraw':
            return <DaiFromSDaiWithdrawActionRow action={handler.action} {...props} />
          case 'usdcToSDaiDeposit':
            return <USDCToSDaiDepositActionRow action={handler.action} {...props} />
          case 'usdcFromSDaiWithdraw':
            return <USDCFromSDaiWithdrawActionRow action={handler.action} {...props} />
          case 'xDaiToSDaiDeposit':
            return <XDaiToSDaiDepositActionRow action={handler.action} {...props} />
          case 'xDaiFromSDaiWithdraw':
            return <XDaiFromSDaiWithdrawActionRow action={handler.action} {...props} />
          case 'claimRewards':
            return <ClaimRewardsActionRow action={handler.action} {...props} />
          case 'migrateDAIToSNST':
            return <MigrateDAIToSNSTActionActionRow action={handler.action} {...props} />
        }
      })}
    </div>
  )
}
