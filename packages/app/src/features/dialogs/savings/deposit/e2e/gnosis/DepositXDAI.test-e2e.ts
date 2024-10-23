import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { GNOSIS_DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { gnosis } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Deposit XDAI on Gnosis', () => {
  const fork = setupFork({
    blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER,
    chainId: gnosis.id,
    useTenderlyVnet: true,
  })
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          XDAI: 10_100,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickDepositButtonAction('XDAI')

    depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
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
        description: '~1,059.80 XDAI per year',
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
      outcome: '9,192.79 sDAI worth $10,000.00',
      badgeTokens: 'XDAI',
    })
  })

  test('executes deposit', async () => {
    const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(1, fork)

    await depositDialog.expectSuccessPage()
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsDaiBalance({ sdaiBalance: '9,192.32 sDAI', estimatedDaiValue: '9,999.48' })
    await savingsPage.expectStablecoinsInWalletAssetBalance('XDAI', '100')
  })
})
