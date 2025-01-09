import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { assert, assertNever } from '@marsfoundation/common-universal'
import { ApproveDelegationActionRow } from '../approve-delegation/ApproveDelegationActionRow'
import { ApproveActionRow } from '../approve/ApproveActionRow'
import { BorrowActionRow } from '../borrow/BorrowActionRow'
import { ClaimFarmRewardsActionRow } from '../claim-farm-rewards/ClaimFarmRewardsActionRow'
import { ClaimMarketRewardsActionRow } from '../claim-market-rewards/ClaimMarketRewardsActionRow'
import { DepositToSavingsActionRow } from '../deposit-to-savings/DepositToSavingsActionRow'
import { DepositActionRow } from '../deposit/DepositActionRow'
import { DowngradeActionRow } from '../downgrade/DowngradeActionRow'
import { PermitActionRow } from '../permit/PermitActionRow'
import { PsmConvertActionRow } from '../psm-convert/PsmConvertActionRow'
import { RepayActionRow } from '../repay/RepayActionRow'
import { SetUseAsCollateralActionRow } from '../set-use-as-collateral/SetUseAsCollateralActionRow'
import { SetUserEModeActionRow } from '../set-user-e-mode/SetUserEModeActionRow'
import { StakeActionRow } from '../stake/StakeActionRow'
import { UnstakeActionRow } from '../unstake/UnstakeActionRow'
import { UpgradeActionRow } from '../upgrade/UpgradeActionRow'
import { WithdrawFromSavingsActionRow } from '../withdraw-from-savings/WithdrawFromSavingsActionRow'
import { WithdrawActionRow } from '../withdraw/WithdrawActionRow'
import { BatchAction } from './types'

export interface BatchActionRowProps extends ActionRowBaseProps {
  action: BatchAction
}

// @todo: display action row for a given action type
export function BatchActionRow({ action, ...props }: BatchActionRowProps) {
  const lastAction = action.actions[action.actions.length - 1]
  assert(lastAction, 'Batch action should have at least one action')

  switch (lastAction.type) {
    case 'approve':
      return <ApproveActionRow action={lastAction} {...props} />
    case 'approveDelegation':
      return <ApproveDelegationActionRow action={lastAction} {...props} />
    case 'borrow':
      return <BorrowActionRow action={lastAction} {...props} />
    case 'deposit':
      return <DepositActionRow action={lastAction} {...props} />
    case 'permit':
      return <PermitActionRow action={lastAction} {...props} />
    case 'repay':
      return <RepayActionRow action={lastAction} {...props} />
    case 'setUseAsCollateral':
      return <SetUseAsCollateralActionRow action={lastAction} {...props} />
    case 'setUserEMode':
      return <SetUserEModeActionRow action={lastAction} {...props} />
    case 'withdraw':
      return <WithdrawActionRow action={lastAction} {...props} />
    case 'claimMarketRewards':
      return <ClaimMarketRewardsActionRow action={lastAction} {...props} />
    case 'withdrawFromSavings':
      return <WithdrawFromSavingsActionRow action={lastAction} {...props} />
    case 'depositToSavings':
      return <DepositToSavingsActionRow action={lastAction} {...props} />
    case 'upgrade':
      return <UpgradeActionRow action={lastAction} {...props} />
    case 'downgrade':
      return <DowngradeActionRow action={lastAction} {...props} />
    case 'stake':
      return <StakeActionRow action={lastAction} {...props} />
    case 'unstake':
      return <UnstakeActionRow action={lastAction} {...props} />
    case 'psmConvert':
      return <PsmConvertActionRow action={lastAction} {...props} />
    case 'claimFarmRewards':
      return <ClaimFarmRewardsActionRow action={lastAction} {...props} />
    default:
      assertNever(lastAction)
  }
}
