import { Button } from '@/ui/atoms/button/Button'
import { cn } from '@/ui/utils/style'
import { assertNever } from '@marsfoundation/common-universal'
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
import { ActionHandler, BatchActionHandler } from '../../logic/types'
import { ActionsGridLayout } from '../../types'
import { ActionsGrid } from '../actions-grid/ActionsGrid'

interface ActionsProps {
  actionHandlers: ActionHandler[]
  batchActionHandler: BatchActionHandler | undefined
  layout: ActionsGridLayout
}

export function Actions({ actionHandlers, batchActionHandler, layout }: ActionsProps) {
  return (
    <ActionsGrid layout={layout}>
      {actionHandlers.map((handler, index) => {
        const props = {
          layout,
          key: index,
          actionIndex: index,
          ...(batchActionHandler
            ? {
                actionHandlerState: batchActionHandler.state,
                onAction: batchActionHandler.onAction,
                variant: 'batch',
              }
            : {
                actionHandlerState: handler.state,
                onAction: handler.onAction,
                variant: 'single',
              }),
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
      {batchActionHandler && <BatchActionTrigger batchActionHandler={batchActionHandler} layout={layout} />}
    </ActionsGrid>
  )
}

export interface BatchActionTriggerProps {
  batchActionHandler: BatchActionHandler
  layout: ActionsGridLayout
}

function BatchActionTrigger({ batchActionHandler, layout }: BatchActionTriggerProps) {
  const buttonText = batchActionHandler.actions.length > 1 ? 'Execute all actions in one transaction' : 'Execute'

  return (
    <div className={cn('col-span-full items-center sm:p-5', layout === 'compact' && 'sm:p-4')}>
      <Button
        variant="primary"
        size="l"
        onClick={batchActionHandler.onAction}
        loading={batchActionHandler.state.status === 'loading'}
        disabled={batchActionHandler.state.status === 'disabled'}
        className="w-full"
      >
        {batchActionHandler.state.status === 'error' ? 'Try Again' : buttonText}
      </Button>
    </div>
  )
}
