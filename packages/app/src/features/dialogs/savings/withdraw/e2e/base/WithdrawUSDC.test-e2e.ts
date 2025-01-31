import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { BASE_DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { base } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Withdraw USDC', () => {
  let savingsPage: SavingsPageObject
  let withdrawDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chain: base,
        blockNumber: BASE_DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sUSDS: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(testContext)

    await savingsPage.clickWithdrawSUsdsButtonAction()
    withdrawDialog = new SavingsDialogPageObject({ testContext, type: 'withdraw' })
    await withdrawDialog.selectAssetAction('USDC')
    await withdrawDialog.fillAmountAction(1000)
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
          tokenAmount: '987.30 sUSDS',
          tokenUsdValue: '$1,000.00',
        },
        {
          tokenAmount: '1,000.00 USDS',
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
    await withdrawDialog.actionsContainer.acceptAllActionsAction(2)

    await withdrawDialog.expectSuccessPage()
    await withdrawDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsUsdsBalance({ susdsBalance: '9,012.70 sUSDS', estimatedUsdsValue: '9,128.654891' })
    await savingsPage.expectStablecoinsInWalletAssetBalance('USDC', '1,000')
  })

  test('executes withdraw for small amount', async () => {
    await withdrawDialog.fillAmountAction(1)
    await withdrawDialog.actionsContainer.acceptAllActionsAction(2)

    await withdrawDialog.expectSuccessPage()
    await withdrawDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsUsdsBalance({ susdsBalance: '9,999.01 sUSDS', estimatedUsdsValue: '10,127.654892' })
    await savingsPage.expectStablecoinsInWalletAssetBalance('USDC', '1')
  })
})
