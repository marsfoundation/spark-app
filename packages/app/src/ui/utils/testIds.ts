import invariant from 'tiny-invariant'

// @note: only allowed value here is 'true' or nested object
// actual value of data test id (string) is generated based on a path in the object tree
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
  dialog: {
    healthFactor: {
      before: true,
      after: true,
    },
    success: true,
  },
})

function makeTestIds<T extends Object>(obj: T, prefix?: string): MapValuesToString<T> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const newPrefix = prefix ? `${prefix}-${key}` : key
      if (typeof value === 'object') {
        return [key, makeTestIds(value, newPrefix)]
      }
      invariant(value === true, "testIds value map has to be 'true' or another nested object")
      return [key, newPrefix]
    }),
  )
}

type MapValuesToString<T> = { [K in keyof T]: T[K] extends boolean ? string : MapValuesToString<T[K]> }
