import { WriteErrorKind, useWrite } from '@/domain/hooks/useWrite'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { QueryKey, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { ApproveDelegationAction } from '../flavours/approve-delegation/types'
import { ApproveAction } from '../flavours/approve/types'
import { BorrowAction, BorrowObjective } from '../flavours/borrow/types'
import { ClaimRewardsAction, ClaimRewardsObjective } from '../flavours/claim-rewards/types'
import { DepositToSavingsAction, DepositToSavingsObjective } from '../flavours/deposit-to-savings/types'
import { DepositAction, DepositObjective } from '../flavours/deposit/types'
import { PermitAction } from '../flavours/permit/types'
import { RepayAction, RepayObjective } from '../flavours/repay/types'
import { SetUseAsCollateralAction, SetUseAsCollateralObjective } from '../flavours/set-use-as-collateral/types'
import { SetUserEModeAction, SetUserEModeObjective } from '../flavours/set-user-e-mode/logic/types'
import { WithdrawFromSavingsAction, WithdrawFromSavingsObjective } from '../flavours/withdraw-from-savings/types'
import { WithdrawAction, WithdrawObjective } from '../flavours/withdraw/types'
import { PermitStore } from './permits'

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
  | ClaimRewardsObjective
  | WithdrawFromSavingsObjective
  | DepositToSavingsObjective
export type ObjectiveType = Objective['type']

export type Action =
  | ApproveAction
  | PermitAction
  | DepositAction
  | ApproveDelegationAction
  | BorrowAction
  | WithdrawAction
  | RepayAction
  | SetUseAsCollateralAction
  | SetUserEModeAction
  | ClaimRewardsAction
  | WithdrawFromSavingsAction
  | DepositToSavingsAction
export type ActionType = Action['type']

export type ActionHandlerState =
  | { status: 'disabled' }
  | { status: 'ready' }
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'error'; errorKind?: ActionHandlerErrorKind; message: string }

export type ActionHandlerErrorKind = 'initial-params' | WriteErrorKind | 'tx-verify'

export interface ActionHandler {
  action: Action
  state: ActionHandlerState
  onAction: () => void
}

export interface ActionContext {
  marketInfo?: MarketInfo
  tokensInfo?: TokensInfo
  permitStore?: PermitStore
  sDaiSavingsInfo?: SavingsInfo
  wagmiConfig: Config
  account: Address
  chainId: number
}

export type InitialParamsBase = { canBeSkipped: boolean }
export type VerifyTransactionResultBase = { success: boolean }

type InitialParamsQueryOptions = UseQueryOptions<any, Error, InitialParamsBase, QueryKey>
export type InitialParamsQueryResult = UseQueryResult<InitialParamsBase>
type VerifyTransactionQueryOptions = UseQueryOptions<any, Error, VerifyTransactionResultBase, QueryKey>
export type VerifyTransactionResult = UseQueryResult<VerifyTransactionResultBase>

export interface ActionConfig {
  initialParamsQueryOptions?: () => InitialParamsQueryOptions
  getWriteConfig: (initialParams: InitialParamsQueryResult) => Parameters<typeof useWrite>[0]
  verifyTransactionQueryOptions?: () => VerifyTransactionQueryOptions
  invalidates: () => QueryKey[]
  beforeWriteCheck?: () => void
}

export interface InjectedActionsContext {
  marketInfo?: MarketInfo
  tokensInfo?: TokensInfo
}
