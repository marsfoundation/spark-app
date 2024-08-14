import { tokens } from '@storybook/tokens'
import { zeroAddress } from 'viem'

import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { ActionHandler, ActionType } from '@/features/actions/logic/types'
import { getMockReserve } from '@/test/integration/constants'

export const allActionHandlers: Record<ActionType, ActionHandler> = {
  approve: {
    action: {
      type: 'approve',
      token: tokens.wstETH,
      spender: CheckedAddress(zeroAddress),
      value: NormalizedUnitNumber(1),
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
  permit: {
    action: {
      type: 'permit',
      token: tokens.wstETH,
      spender: CheckedAddress(zeroAddress),
      value: NormalizedUnitNumber(1),
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
  approveDelegation: {
    action: {
      type: 'approveDelegation',
      token: tokens.WETH,
      value: NormalizedUnitNumber(1),
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
  borrow: {
    action: {
      type: 'borrow',
      token: tokens.DAI,
      value: NormalizedUnitNumber(1233.34),
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
  deposit: {
    action: {
      type: 'deposit',
      token: tokens.wstETH,
      value: NormalizedUnitNumber(1),
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
  repay: {
    action: {
      type: 'repay',
      reserve: getMockReserve({
        token: tokens.DAI,
      }),
      value: NormalizedUnitNumber(1233.34),
      useAToken: false,
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
  setUseAsCollateral: {
    action: {
      type: 'setUseAsCollateral',
      token: tokens.rETH,
      useAsCollateral: true,
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
  setUserEMode: {
    action: {
      type: 'setUserEMode',
      eModeCategoryId: 1,
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
  withdraw: {
    action: {
      type: 'withdraw',
      token: tokens.wstETH,
      value: NormalizedUnitNumber(12),
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
  depositToSavings: {
    action: {
      type: 'depositToSavings',
      token: tokens.DAI,
      savingsToken: tokens.sDAI,
      value: NormalizedUnitNumber(1023),
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
  withdrawFromSavings: {
    action: {
      type: 'withdrawFromSavings',
      savingsToken: tokens.sDAI,
      token: tokens.DAI,
      amount: NormalizedUnitNumber(1023),
      mode: 'withdraw',
      isMax: false,
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
  claimRewards: {
    action: {
      type: 'claimRewards',
      assets: [CheckedAddress(zeroAddress)],
      incentiveControllerAddress: CheckedAddress(zeroAddress),
      token: tokens.wstETH,
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
  upgradeDaiToNST: {
    action: {
      type: 'upgradeDaiToNST',
      dai: tokens.DAI,
      nst: tokens.NST,
      amount: NormalizedUnitNumber(1),
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
}
