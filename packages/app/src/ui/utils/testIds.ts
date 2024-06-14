import { assert } from '@/utils/assert'

// @note: only allowed value here is 'true' a function or nested object
// actual value of data test id (string) is generated based on a path in the object tree
// functions are automatically prefixed with a path in the object tree
export const testIds = makeTestIds({
  component: {
    MultiAssetSelector: {
      group: true,
    },
    AssetSelector: true,
    HealthFactorBadge: {
      value: true,
    },
    AssetInput: {
      error: true,
    },
    Action: {
      title: true,
    },
    Alert: {
      message: true,
    },
  },
  easyBorrow: {
    form: {
      deposits: true,
      borrow: true,
      borrowRate: true,
      ltv: true,
    },
    success: {
      deposited: true,
      borrowed: true,
    },
  },
  dashboard: {
    deposited: true,
    borrowed: true,
    depositDialog: {
      newTokenBalance: true,
      newUSDBalance: true,
    },
  },
  savings: {
    sDaiBalance: true,
    sDaiBalanceInDai: true,
  },
  dialog: {
    healthFactor: {
      before: true,
      after: true,
    },
    success: true,
    acknowledgeRiskSwitch: true,
    savings: {
      nativeRouteTransactionOverview: {
        apy: {
          value: true,
          description: true,
        },
        routeItem: {
          tokenWithAmount: (index: number) => index,
          tokenUsdValue: (index: number) => index,
        },
        outcome: true,
        makerBadge: true,
      },
    },
    depositSavings: {
      transactionDetailsRow: (index: number) => index,
    },
  },
  actions: {
    settings: {
      dialog: true,
      slippage: {
        error: true,
      },
    },
    row: (index: number) => index,
    flavours: {
      exchangeActionRow: {
        lifiBadge: true,
        slippage: true,
        fee: true,
        finalDAIAmount: true,
        finalSDAIAmount: true,
      },
    },
  },
  navbar: {
    airdropBadge: true,
  },
})

function makeTestIds<T extends Object>(obj: T, prefix?: string): MapValuesToString<T> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const newPrefix = prefix ? `${prefix}-${key}` : key
      if (typeof value === 'object') {
        return [key, makeTestIds(value, newPrefix)]
      }
      if (typeof value === 'function') {
        return [key, (...args: any) => `${newPrefix}-${value(...args)}`]
      }
      assert(value === true, "testIds value map has to be 'true', a function or another nested object")
      return [key, newPrefix]
    }),
  ) as any
}

type MapValuesToString<T> = {
  [K in keyof T]: T[K] extends boolean
    ? string
    : T[K] extends (...args: any[]) => any
      ? (...args: Parameters<T[K]>) => string
      : MapValuesToString<T[K]>
}
