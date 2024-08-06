import { WriteErrorKind, useWrite } from '@/domain/hooks/useWrite'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { QueryKey, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { ApproveDelegationAction } from '../flavours/approve-delegation/types'
import { ApproveAction } from '../flavours/approve/types'
import { BorrowAction, BorrowObjective } from '../flavours/borrow/types'
import { ClaimRewardsAction, ClaimRewardsObjective } from '../flavours/claim-rewards/types'
import { DepositAction, DepositObjective } from '../flavours/deposit/types'
import {
  MakerStableToSavingsAction,
  MakerStableToSavingsObjective,
} from '../flavours/native-sdai-deposit/maker-stables/types'
import { MigrateDAIToSNSTAction } from '../flavours/native-sdai-deposit/migrate-dai-to-snst/types'
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
  | MakerStableToSavingsObjective
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
  | MakerStableToSavingsAction
  | DaiFromSDaiWithdrawAction
  | USDCToSDaiDepositAction
  | USDCFromSDaiWithdrawAction
  | XDaiToSDaiDepositAction
  | XDaiFromSDaiWithdrawAction
  | ClaimRewardsAction
  | MigrateDAIToSNSTAction
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
  wagmiConfig: Config
  account: Address
  chainId: number
}

type InitialParamsQueryOptions = UseQueryOptions<any, Error, { canBeSkipped: boolean }, QueryKey>
export type InitialParamsQueryResult = UseQueryResult<{ canBeSkipped: boolean }>
type VerifyTransactionQueryOptions = UseQueryOptions<any, Error, { success: boolean }, QueryKey>
export type VerifyTransactionResult = UseQueryResult<{ success: boolean }>

export interface ActionConfig {
  initialParamsQueryOptions: () => InitialParamsQueryOptions
  getWriteConfig: (initialParams: InitialParamsQueryResult) => Parameters<typeof useWrite>[0]
  verifyTransactionQueryOptions: () => VerifyTransactionQueryOptions
  invalidates: () => QueryKey[]
  beforeWriteCheck?: () => {}
}
