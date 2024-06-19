import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../../common/e2e/SavingsDialog.PageObject'

test.describe('Withdraw DAI on Mainnet', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id })
  let savingsPage: SavingsPageObject
  let withdrawalDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected',
        assetBalances: {
          ETH: 1,
          sDAI: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickWithdrawButtonAction()

    withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
    await withdrawalDialog.fillAmountAction(7000)
  })

  test('uses native sDai withdrawal', async () => {
    await withdrawalDialog.actionsContainer.expectActions([{ type: 'daiFromSDaiWithdraw', asset: 'DAI' }])
  })

  test('displays transaction overview', async () => {
    await withdrawalDialog.expectNativeRouteTransactionOverview({
      apy: {
        value: '5.00%',
        description: '~350.00 DAI per year',
      },
      routeItems: [
        {
          tokenAmount: '6,532.86 sDAI',
          tokenUsdValue: '$7,000.00',
        },
        {
          tokenAmount: '7,000.00 DAI',
          tokenUsdValue: '$7,000.00',
        },
      ],
      outcome: '7,000.00 DAI worth $7,000.00',
      badgeToken: 'DAI',
    })
  })

  test('executes withdrawal', async () => {
    const actionsContainer = new ActionsPageObject(withdrawalDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(1)

    await withdrawalDialog.expectSuccessPage()
    await withdrawalDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsBalance({ sDaiBalance: '3,467.14 sDAI', estimatedDaiValue: '3,715.05' })
    await savingsPage.expectCashInWalletAssetBalance('DAI', '7,000.00')
  })
})
