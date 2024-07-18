import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { PSM_ACTIONS_DEPLOYED, PSM_ACTIONS_DEPLOYED_DATE } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Withdraw max USDC on Mainnet', () => {
  const fork = setupFork({
    blockNumber: PSM_ACTIONS_DEPLOYED,
    simulationDateOverride: PSM_ACTIONS_DEPLOYED_DATE,
    chainId: mainnet.id,
  })
  let savingsPage: SavingsPageObject
  let withdrawalDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sDAI: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickWithdrawButtonAction()

    withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
    await withdrawalDialog.selectAssetAction('USDC')
    await withdrawalDialog.clickMaxAmountAction()
  })

  test('uses PSM actions native withdrawal', async () => {
    await withdrawalDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sDAI' },
      { type: 'usdcFromSDaiWithdraw', asset: 'USDC' },
    ])
  })

  test('displays transaction overview', async () => {
    await withdrawalDialog.expectNativeRouteTransactionOverview({
      apy: {
        value: '8.00%',
        description: '~869.91 DAI per year',
      },
      routeItems: [
        {
          tokenAmount: '10,000.00 sDAI',
          tokenUsdValue: '$10,873.93',
        },
        {
          tokenAmount: '10,873.93 DAI',
          tokenUsdValue: '$10,873.93',
        },
        {
          tokenAmount: '10,873.93 USDC',
          tokenUsdValue: '$10,873.93',
        },
      ],
      outcome: '10,873.93 USDC worth $10,873.93',
      badgeToken: 'USDC',
    })
  })

  test('executes max withdrawal', async () => {
    const actionsContainer = new ActionsPageObject(withdrawalDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2)

    await withdrawalDialog.expectSuccessPage()
    await withdrawalDialog.clickBackToSavingsButton()

    await savingsPage.expectPotentialProjection('$69.00', '30-day')
    await savingsPage.expectPotentialProjection('$869.92', '1-year')
    await savingsPage.expectCashInWalletAssetBalance('USDC', '10,873.94')
  })
})
