import { SavingsDialogPageObject } from '@/features/dialogs/savings/common/e2e/SavingsDialog.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { BASE_MOCK_SUSDC_ACTIVE_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { base } from 'viem/chains'

test.describe('Withdraw USDC', () => {
  let savingsPage: SavingsPageObject
  let withdrawDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chain: base,
        blockNumber: BASE_MOCK_SUSDC_ACTIVE_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          USDC: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickSavingsNavigationItemAction('USDC')
    await savingsPage.clickDepositButtonAction('USDC')

    const depositDialog = new SavingsDialogPageObject({ testContext, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
    await depositDialog.actionsContainer.acceptAllActionsAction(2)
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.clickWithdrawFromAccountButtonAction()
    withdrawDialog = new SavingsDialogPageObject({ testContext, type: 'withdraw' })
    await withdrawDialog.selectAssetAction('USDC')
    await withdrawDialog.fillAmountAction(1000)
  })

  test('has correct action plan', async () => {
    await withdrawDialog.actionsContainer.expectActions([
      { type: 'withdrawFromSavings', asset: 'USDC', savingsAsset: 'sUSDC', mode: 'withdraw' },
    ])
  })

  test('displays transaction overview', async () => {
    await withdrawDialog.expectNativeRouteTransactionOverview({
      routeItems: [
        {
          tokenAmount: '966.65 sUSDC',
          tokenUsdValue: '$1,000.00',
        },
        {
          tokenAmount: '1,000.00 USDC',
          tokenUsdValue: '$1,000.00',
        },
      ],
      outcome: '1,000.00 USDC',
      outcomeUsd: '$1,000.00',
    })

    await withdrawDialog.expectUpgradeSwitchToBeHidden()
  })

  test('executes withdraw', async () => {
    await withdrawDialog.actionsContainer.acceptAllActionsAction(1)

    await withdrawDialog.expectSuccessPage()
    await withdrawDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsAccountBalance({ balance: '8,699.88', estimatedValue: '9,000.000186' })
    await savingsPage.expectSupportedStablecoinBalance('USDC', '1,000')
  })

  test('executes withdraw for small amount', async () => {
    await withdrawDialog.fillAmountAction(1)
    await withdrawDialog.actionsContainer.acceptAllActionsAction(1)

    await withdrawDialog.expectSuccessPage()
    await withdrawDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsAccountBalance({ balance: '9,665.57', estimatedValue: '9,999.000186' })
    await savingsPage.expectSupportedStablecoinBalance('USDC', '1')
  })
})
