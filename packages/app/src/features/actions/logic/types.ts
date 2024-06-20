import { WriteErrorKind } from '@/domain/hooks/useWrite'
import { ApproveDelegationAction } from '../flavours/approve-delegation/types'
import { ApproveExchangeAction } from '../flavours/approve-exchange/types'
import { ApproveAction } from '../flavours/approve/types'
import { BorrowAction, BorrowObjective } from '../flavours/borrow/types'
import { DepositAction, DepositObjective } from '../flavours/deposit/types'
import { ExchangeAction, ExchangeObjective } from '../flavours/exchange/types'
import { DaiToSDaiDepositAction, DaiToSDaiDepositObjective } from '../flavours/native-sdai-deposit/dai-to-sdai/types'
import { USDCToSDaiDepositAction, USDCToSDaiDepositObjective } from '../flavours/native-sdai-deposit/usdc-to-sdai/types'
import { XDaiToSDaiDepositAction, XDaiToSDaiDepositObjective } from '../flavours/native-sdai-deposit/xdai-to-sdai/types'
import { NativeSDaiWithdrawAction, NativeSDaiWithdrawObjective } from '../flavours/native-sdai-withdraw/types'
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
  | NativeSDaiWithdrawObjective
  | USDCToSDaiDepositObjective
  | DaiToSDaiDepositObjective
  | XDaiToSDaiDepositObjective
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
  | NativeSDaiWithdrawAction
  | DaiToSDaiDepositAction
  | USDCToSDaiDepositAction
  | XDaiToSDaiDepositAction
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
