import { assert } from '@/utils/assert'

// @note: only allowed value here is 'true' a function or nested object
// actual value of data test id (string) is generated based on a path in the object tree
// functions are automatically prefixed with a path in the object tree
export const testIds = makeTestIds({
  component: {
    MultiAssetSelector: {
      group: true,
    },
    AssetSelector: {
      trigger: true,
      option: true,
    },
    HealthFactorBadge: {
      value: true,
    },
    AssetInput: {
      input: true,
      error: true,
    },
    Action: {
      title: true,
    },
    Alert: {
      message: true,
    },
    DataTable: {
      row: (index: number) => index,
    },
    RiskAcknowledgement: {
      switch: true,
      explanation: true,
    },
    EModeButton: true,
    SuccessViewContent: true,
    AddressInput: {
      input: true,
      error: true,
    },
  },
  easyBorrow: {
    form: {
      deposits: true,
      borrow: true,
      borrowRate: true,
      ltv: true,
      usdsBorrowAlert: true,
    },
    success: {
      deposited: true,
      borrowed: true,
    },
  },
  myPortfolio: {
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
    upgradeSDaiBanner: true,
    stablecoinsInWallet: {
      upgradeDaiToUsds: true,
      upgradeDaiToUsdsCell: true,
      moreDropdown: true,
      downgradeUsdsToDai: true,
    },
  },
  dialog: {
    transactionOverview: {
      routeItem: {
        tokenWithAmount: (index: number) => index,
        tokenUsdValue: (index: number) => index,
      },
      skyBadge: true,
    },
    healthFactor: {
      before: true,
      after: true,
    },
    success: true,
    savings: {
      transactionOverview: {
        apy: {
          value: true,
          description: true,
        },
        apyChange: {
          before: true,
          after: true,
        },
        outcome: true,
      },
      send: {
        addressIsSmartContractWarning: true,
      },
      upgradeSwitch: true,
      upgradeDetailsTrigger: true,
    },
    depositSavings: {
      transactionDetailsRow: (index: number) => index,
    },
    claimRewards: {
      transactionOverview: {
        row: (index: number) => index,
        token: true,
        amount: true,
        amountUSD: true,
      },
    },
    eMode: {
      transactionOverview: {
        availableAssets: {
          category: true,
          assets: true,
        },
        maxLtv: {
          before: true,
          after: true,
        },
      },
    },
  },
  actions: {
    settings: {
      dialog: true,
    },
    row: (index: number) => index,
  },
  navbar: {
    airdropBadge: true,
    rewards: {
      badge: true,
      claimableRewards: true,
      details: {
        row: (index: number) => index,
        token: true,
        amount: true,
        amountUSD: true,
        tooltip: true,
      },
    },
  },
  markets: {
    summary: {
      tile: (index: number) => index,
    },
    table: {
      active: true,
      frozen: true,
      cell: {
        asset: true,
        totalSupplied: true,
        depositAPY: true,
        totalBorrowed: true,
        borrowAPY: true,
        status: true,
      },
    },
    frozenPill: true,
    pausedPill: true,
    rewardBadge: true,
    airdropBadge: true,
    frozenAssetsSwitch: true,
  },
  marketDetails: {
    collateralStatusPanel: {
      debt: true,
      debtCeiling: true,
    },
    walletPanel: {
      balance: true,
    },
    capAutomator: {
      cap: true,
      maxCap: true,
      cooldownTimer: true,
    },
  },
  farms: {
    active: {
      tile: (index: number) => index,
    },
    inactive: {
      tile: (index: number) => index,
    },
    tile: {
      apy: true,
      stakeText: true,
      rewardText: true,
      staked: true,
    },
  },
  farmDetails: {
    stakeDialog: {
      transactionOverview: {
        estimatedRewards: {
          apy: true,
          description: true,
        },
        route: {
          destination: {
            farmName: true,
            stakingToken: true,
          },
        },
        outcome: true,
      },
    },
    unstakeDialog: {
      transactionOverview: {
        route: {
          farm: {
            farmName: true,
            stakingToken: true,
          },
        },
        outcome: true,
      },
    },
    infoPanel: {
      stakeButton: true,
    },
    activeFarmInfoPanel: {
      rewards: true,
      staked: true,
      unstakeButton: true,
    },
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
