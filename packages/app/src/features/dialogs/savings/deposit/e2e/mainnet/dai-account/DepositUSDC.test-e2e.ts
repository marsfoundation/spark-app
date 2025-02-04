import { SavingsDialogPageObject } from '@/features/dialogs/savings/common/e2e/SavingsDialog.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { TestContext, setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'

test.describe('Deposit USDC', () => {
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject
  let testContext: TestContext<'connected-random'>

  test.beforeEach(async ({ page }) => {
    testContext = await setup(page, {
      blockchain: {
        chainId: mainnet.id,
        blockNumber: DEFAULT_BLOCK_NUMBER,
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
    await savingsPage.clickSavingsNavigationItemAction('DAI')
    await savingsPage.clickDepositButtonAction('USDC')

    depositDialog = new SavingsDialogPageObject({ testContext, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
  })

  test('has correct action plan', async () => {
    await depositDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'USDC' },
      { type: 'depositToSavings', asset: 'USDC', savingsAsset: 'sDAI' },
    ])
  })

  test('displays transaction overview', async () => {
    await depositDialog.expectNativeRouteTransactionOverview({
      apy: {
        value: '11.50%',
        description: 'Earn ~1,150.00 DAI/year',
      },
      routeItems: [
        {
          tokenAmount: '10,000.00 USDC',
          tokenUsdValue: '$10,000.00',
        },
        {
          tokenAmount: '10,000.00 DAI',
          tokenUsdValue: '$10,000.00',
        },
        {
          tokenAmount: '8,884.16 sDAI',
          tokenUsdValue: '$10,000.00',
        },
      ],
      outcome: '8,884.16 sDAI',
      outcomeUsd: '$10,000.00',
    })
  })

  test('executes deposit', async () => {
    await depositDialog.actionsContainer.acceptAllActionsAction(2)

    await depositDialog.expectSuccessPage()
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsAccountBalance({ balance: '8,884.16', estimatedValue: '10,000.000000' })
    await savingsPage.expectSupportedStablecoinBalance('USDC', '-')
  })
})
