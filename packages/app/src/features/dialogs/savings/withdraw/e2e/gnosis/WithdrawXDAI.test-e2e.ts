import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { GNOSIS_DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { gnosis } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Withdraw XDAI on Gnosis', () => {
  let savingsPage: SavingsPageObject
  let withdrawalDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chain: gnosis,
        blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          XDAI: 100,
          sDAI: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickWithdrawSDaiButtonAction()

    withdrawalDialog = new SavingsDialogPageObject({ testContext, type: 'withdraw' })
    await withdrawalDialog.fillAmountAction(7000)
  })

  test('uses native sDai withdrawal', async () => {
    await withdrawalDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sDAI' },
      { type: 'withdrawFromSavings', asset: 'XDAI', savingsAsset: 'sDAI', mode: 'withdraw' },
    ])
  })

  test('displays transaction overview', async () => {
    await withdrawalDialog.expectNativeRouteTransactionOverview({
      routeItems: [
        {
          tokenAmount: '6,434.95 sDAI',
          tokenUsdValue: '$7,000.00',
        },
        {
          tokenAmount: '7,000.00 XDAI',
          tokenUsdValue: '$7,000.00',
        },
      ],
      outcome: '7,000.00 XDAI',
      outcomeUsd: '$7,000.00',
    })
  })

  test('executes withdrawal', async () => {
    await withdrawalDialog.actionsContainer.acceptAllActionsAction(2)

    await withdrawalDialog.expectSuccessPage()
    await withdrawalDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsDaiBalance({ sdaiBalance: '3,565.05 sDAI', estimatedDaiValue: '3,878.09' })
    await savingsPage.expectStablecoinsInWalletAssetBalance('XDAI', '7,100.00')
  })
})
