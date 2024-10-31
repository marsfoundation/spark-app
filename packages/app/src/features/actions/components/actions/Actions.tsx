import { assertNever } from '@/utils/assertNever'
import { ApproveDelegationActionRow } from '../../flavours/approve-delegation/ApproveDelegationActionRow'
import { ApproveActionRow } from '../../flavours/approve/ApproveActionRow'
import { BorrowActionRow } from '../../flavours/borrow/BorrowActionRow'
import { ClaimFarmRewardsActionRow } from '../../flavours/claim-farm-rewards/ClaimFarmRewardsActionRow'
import { ClaimMarketRewardsActionRow } from '../../flavours/claim-market-rewards/ClaimMarketRewardsActionRow'
import { DepositToSavingsActionRow } from '../../flavours/deposit-to-savings/DepositToSavingsActionRow'
import { DepositActionRow } from '../../flavours/deposit/DepositActionRow'
import { DowngradeActionRow } from '../../flavours/downgrade/DowngradeActionRow'
import { PermitActionRow } from '../../flavours/permit/PermitActionRow'
import { PsmConvertActionRow } from '../../flavours/psm-convert/PsmConvertActionRow'
import { RepayActionRow } from '../../flavours/repay/RepayActionRow'
import { SetUseAsCollateralActionRow } from '../../flavours/set-use-as-collateral/SetUseAsCollateralActionRow'
import { SetUserEModeActionRow } from '../../flavours/set-user-e-mode/SetUserEModeActionRow'
import { StakeActionRow } from '../../flavours/stake/StakeActionRow'
import { UnstakeActionRow } from '../../flavours/unstake/UnstakeActionRow'
import { UpgradeActionRow } from '../../flavours/upgrade/UpgradeActionRow'
import { WithdrawFromSavingsActionRow } from '../../flavours/withdraw-from-savings/WithdrawFromSavingsActionRow'
import { WithdrawActionRow } from '../../flavours/withdraw/WithdrawActionRow'
import { ActionHandler } from '../../logic/types'
import { ActionRowVariant } from '../action-row/types'
import { ActionsGrid } from '../actions-grid/ActionsGrid'

interface ActionsProps {
  actionHandlers: ActionHandler[]
  variant: ActionRowVariant
}

export function Actions({ actionHandlers, variant }: ActionsProps) {
  return (
    <ActionsGrid variant={variant}>
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
          case 'claimMarketRewards':
            return <ClaimMarketRewardsActionRow action={handler.action} {...props} />
          case 'withdrawFromSavings':
            return <WithdrawFromSavingsActionRow action={handler.action} {...props} />
          case 'depositToSavings':
            return <DepositToSavingsActionRow action={handler.action} {...props} />
          case 'upgrade':
            return <UpgradeActionRow action={handler.action} {...props} />
          case 'downgrade':
            return <DowngradeActionRow action={handler.action} {...props} />
          case 'stake':
            return <StakeActionRow action={handler.action} {...props} />
          case 'unstake':
            return <UnstakeActionRow action={handler.action} {...props} />
          case 'psmConvert':
            return <PsmConvertActionRow action={handler.action} {...props} />
          case 'claimFarmRewards':
            return <ClaimFarmRewardsActionRow action={handler.action} {...props} />
          default:
            assertNever(handler.action)
        }
      })}
    </ActionsGrid>
  )
}
