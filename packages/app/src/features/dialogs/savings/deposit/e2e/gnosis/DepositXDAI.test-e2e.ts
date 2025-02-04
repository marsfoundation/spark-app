import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { GNOSIS_DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { gnosis } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Deposit XDAI on Gnosis', () => {
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chainId: gnosis.id,
        blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          XDAI: 10_100,
        },
      },
    })

    savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickDepositButtonAction('XDAI')

    depositDialog = new SavingsDialogPageObject({ testContext, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
  })

  test('uses native sDai deposit', async () => {
    await depositDialog.actionsContainer.expectActions([
      { type: 'depositToSavings', asset: 'XDAI', savingsAsset: 'sDAI' },
    ])
  })

  test('displays transaction overview', async () => {
    await depositDialog.expectNativeRouteTransactionOverview({
      apy: {
        value: '10.60%',
        description: 'Earn ~1,059.80 XDAI/year',
      },
      routeItems: [
        {
          tokenAmount: '10,000.00 XDAI',
          tokenUsdValue: '$10,000.00',
        },
        {
          tokenAmount: '9,192.79 sDAI',
          tokenUsdValue: '$10,000.00',
        },
      ],
      outcome: '9,192.79 sDAI',
      outcomeUsd: '$10,000.00',
    })
  })

  test('executes deposit', async () => {
    await depositDialog.actionsContainer.acceptAllActionsAction(1)

    await depositDialog.expectSuccessPage()
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsDaiBalance({ sdaiBalance: '9,192.32 sDAI', estimatedDaiValue: '9,999.48' })
    await savingsPage.expectSupportedStablecoinBalance('XDAI', '100')
  })
})
