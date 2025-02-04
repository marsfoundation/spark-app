import { SavingsDialogPageObject } from '@/features/dialogs/savings/common/e2e/SavingsDialog.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'

test.describe('Withdraw max USDC', () => {
  let savingsPage: SavingsPageObject
  let withdrawDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chainId: mainnet.id,
        blockNumber: DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          USDS: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(testContext)

    await savingsPage.clickDepositButtonAction('USDS')
    const depositDialog = new SavingsDialogPageObject({ testContext, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
    await depositDialog.actionsContainer.acceptAllActionsAction(2)
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.clickSavingsNavigationItemAction('USDS')
    await savingsPage.clickWithdrawFromAccountButtonAction()
    withdrawDialog = new SavingsDialogPageObject({ testContext, type: 'withdraw' })
    await withdrawDialog.selectAssetAction('USDC')
    await withdrawDialog.clickMaxAmountAction()
  })

  test('has correct action plan', async () => {
    await withdrawDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sUSDS' },
      { type: 'withdrawFromSavings', asset: 'USDC', savingsAsset: 'sUSDS', mode: 'withdraw' },
    ])
  })

  test('displays transaction overview', async () => {
    await withdrawDialog.expectNativeRouteTransactionOverview({
      routeItems: [
        {
          tokenAmount: '9,830.34 sUSDS',
          tokenUsdValue: '$10,000.00',
        },
        {
          tokenAmount: '10,000.00 USDS',
          tokenUsdValue: '$10,000.00',
        },
        {
          tokenAmount: '10,000.00 USDC',
          tokenUsdValue: '$10,000.00',
        },
      ],
      outcome: '10,000.00 USDC',
      outcomeUsd: '$10,000.00',
    })

    await withdrawDialog.expectUpgradeSwitchToBeHidden()
  })

  test('executes withdraw', async () => {
    await withdrawDialog.actionsContainer.acceptAllActionsAction(2)

    await withdrawDialog.expectSuccessPage()
    await withdrawDialog.clickBackToSavingsButton()

    await savingsPage.expectSupportedStablecoinBalance('USDC', '10,000')
  })
})
