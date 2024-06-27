import { WriteErrorKind } from '@/domain/hooks/useWrite'
import { ApproveDelegationAction } from '../flavours/approve-delegation/types'
import { ApproveExchangeAction } from '../flavours/approve-exchange/types'
import { ApproveAction } from '../flavours/approve/types'
import { BorrowAction, BorrowObjective } from '../flavours/borrow/types'
import { ClaimRewardsAction, ClaimRewardsObjective } from '../flavours/claim-rewards/types'
import { DepositAction, DepositObjective } from '../flavours/deposit/types'
import { ExchangeAction, ExchangeObjective } from '../flavours/exchange/types'
import { DaiToSDaiDepositAction, DaiToSDaiDepositObjective } from '../flavours/native-sdai-deposit/dai-to-sdai/types'
import { USDCToSDaiDepositAction, USDCToSDaiDepositObjective } from '../flavours/native-sdai-deposit/usdc-to-sdai/types'
import { XDaiToSDaiDepositAction, XDaiToSDaiDepositObjective } from '../flavours/native-sdai-deposit/xdai-to-sdai/types'
import {
  DaiFromSDaiWithdrawAction,
  DaiFromSDaiWithdrawObjective,
} from '../flavours/native-sdai-withdraw/dai-from-sdai/types'
import {
  USDCFromSDaiWithdrawAction,
  USDCFromSDaiWithdrawObjective,
} from '../flavours/native-sdai-withdraw/usdc-from-sdai/types'
import {
  XDaiFromSDaiWithdrawAction,
  XDaiFromSDaiWithdrawObjective,
} from '../flavours/native-sdai-withdraw/xdai-from-sdai/types'
import { RepayAction, RepayObjective } from '../flavours/repay/types'
import { SetUseAsCollateralAction, SetUseAsCollateralObjective } from '../flavours/set-use-as-collateral/types'
import { SetUserEModeAction, SetUserEModeObjective } from '../flavours/set-user-e-mode/types'
import { WithdrawAction, WithdrawObjective } from '../flavours/withdraw/types'

/**
 * Objective is an input to action component. It is a high level description of what user wants to do.
 * Single objective usually maps to multiple actions. For example: DepositObjective maps to Approve/Permit and Deposit actions.
 */
export type Objective =
  | DepositObjective
  | BorrowObjective
  | WithdrawObjective
  | RepayObjective
  | SetUseAsCollateralObjective
  | SetUserEModeObjective
  | ExchangeObjective
  | DaiToSDaiDepositObjective
  | DaiFromSDaiWithdrawObjective
  | USDCToSDaiDepositObjective
  | USDCFromSDaiWithdrawObjective
  | XDaiToSDaiDepositObjective
  | XDaiFromSDaiWithdrawObjective
  | ClaimRewardsObjective
export type ObjectiveType = Objective['type']

export type Action =
  | ApproveAction
  | DepositAction
  | ApproveDelegationAction
  | BorrowAction
  | WithdrawAction
  | RepayAction
  | SetUseAsCollateralAction
  | SetUserEModeAction
  | ApproveExchangeAction
  | ExchangeAction
  | DaiToSDaiDepositAction
  | DaiFromSDaiWithdrawAction
  | USDCToSDaiDepositAction
  | USDCFromSDaiWithdrawAction
  | XDaiToSDaiDepositAction
  | XDaiFromSDaiWithdrawAction
  | ClaimRewardsAction
export type ActionType = Action['type']

export type ActionHandlerState =
  | { status: 'disabled' }
  | { status: 'ready' }
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'error'; errorKind?: WriteErrorKind; message: string }

export interface ActionHandler {
  action: Action
  state: ActionHandlerState
  onAction: () => void
}
