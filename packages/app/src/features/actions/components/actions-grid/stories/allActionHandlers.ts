import { tokens } from '@storybook/tokens'
import { fakeBigInt } from '@storybook/utils'
import { zeroAddress } from 'viem'

import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { BaseUnitNumber, NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
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
      debtTokenAddress: tokens.WETH.address,
      delegatee: CheckedAddress(zeroAddress),
      value: NormalizedUnitNumber(1),
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
  approveExchange: {
    action: {
      type: 'approveExchange',
      swapParams: {
        fromToken: tokens.USDC,
        toToken: tokens.sDAI,
        type: 'direct',
        value: NormalizedUnitNumber(1),
        meta: {
          fee: Percentage(0),
          integratorKey: 'spark_waivefee',
          maxSlippage: Percentage(0.005),
        },
      },
      swapInfo: {
        status: 'success',
        data: {
          fromToken: tokens.USDC.address,
          toToken: tokens.sDAI.address,
          type: 'direct',
          txRequest: {
            data: '0x',
            from: zeroAddress,
            gasLimit: fakeBigInt,
            gasPrice: fakeBigInt,
            to: zeroAddress,
            value: fakeBigInt,
          },
          estimate: {
            feeCostsUSD: NormalizedUnitNumber(0),
            fromAmount: BaseUnitNumber(1e6),
            toAmount: BaseUnitNumber(1e18),
            toAmountMin: BaseUnitNumber(1e18),
          },
        },
        error: null,
      },
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
  exchange: {
    action: {
      type: 'exchange',
      swapParams: {
        fromToken: tokens.USDT,
        toToken: tokens.sDAI,
        type: 'direct',
        value: NormalizedUnitNumber(1023),
        meta: {
          fee: Percentage(0),
          integratorKey: 'spark_waivefee',
          maxSlippage: Percentage(0.005),
        },
      },
      swapInfo: {
        data: {
          fromToken: tokens.USDT.address,
          toToken: tokens.sDAI.address,
          type: 'direct',
          estimate: {
            feeCostsUSD: NormalizedUnitNumber(3.33),
            fromAmount: BaseUnitNumber(1e6),
            toAmount: BaseUnitNumber(1e18),
            toAmountMin: BaseUnitNumber(1e18),
          },
          txRequest: {
            data: '0x',
            from: zeroAddress,
            gasLimit: fakeBigInt,
            gasPrice: fakeBigInt,
            to: zeroAddress,
            value: fakeBigInt,
          },
        },
        status: 'success',
      },
      value: NormalizedUnitNumber(1023),
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
  daiToSDaiDeposit: {
    action: {
      type: 'daiToSDaiDeposit',
      dai: tokens.DAI,
      value: NormalizedUnitNumber(1023),
      sDai: tokens.sDAI,
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
  usdcToSDaiDeposit: {
    action: {
      type: 'usdcToSDaiDeposit',
      usdc: tokens.USDC,
      value: NormalizedUnitNumber(1023),
      sDai: tokens.sDAI,
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
  xDaiToSDaiDeposit: {
    action: {
      type: 'xDaiToSDaiDeposit',
      xDai: tokens.XDAI,
      value: NormalizedUnitNumber(1023),
      sDai: tokens.sDAI,
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
  daiFromSDaiWithdraw: {
    action: {
      type: 'daiFromSDaiWithdraw',
      dai: tokens.DAI,
      value: NormalizedUnitNumber(1023),
      sDai: tokens.sDAI,
      method: 'withdraw',
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
  usdcFromSDaiWithdraw: {
    action: {
      type: 'usdcFromSDaiWithdraw',
      usdc: tokens.USDC,
      value: NormalizedUnitNumber(1023),
      sDai: tokens.sDAI,
      method: 'withdraw',
    },
    state: { status: 'ready' },
    onAction: () => {},
  },
}
