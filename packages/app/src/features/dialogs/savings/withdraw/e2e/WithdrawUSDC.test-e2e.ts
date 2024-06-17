import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { PSM_ACTIONS_DEPLOYED, PSM_ACTIONS_DEPLOYED_DATE } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../../common/e2e/SavingsDialog.PageObject'

test.describe('Withdraw USDC on Mainnet', () => {
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
    await withdrawalDialog.selectAssetAction('USDC')
    await withdrawalDialog.fillAmountAction(6969)
  })

  test('uses PSM actions native withdrawal', async () => {
    await withdrawalDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sDAI' },
      { type: 'nativeSDaiWithdraw', asset: 'USDC' },
    ])
  })

  test('displays transaction overview', async () => {
    await withdrawalDialog.expectNativeRouteTransactionOverview({
      apy: {
        value: '8.00%',
        description: '~557.52 DAI per year',
      },
      routeItems: [
        {
          tokenAmount: '6,408.90 sDAI',
          tokenUsdValue: '$6,969.00',
        },
        {
          tokenAmount: '6,969.00 DAI',
          tokenUsdValue: '$6,969.00',
        },
        {
          tokenAmount: '6,969.00 USDC',
          tokenUsdValue: '$6,969.00',
        },
      ],
      outcome: '6,969.00 USDC worth $6,969.00',
    })
  })

  test('executes withdrawal', async () => {
    const actionsContainer = new ActionsPageObject(withdrawalDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2)

    await withdrawalDialog.expectSuccessPage()
    await withdrawalDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsBalance({ sDaiBalance: '3,591.10 sDAI', estimatedDaiValue: '3,904.93' })
    await savingsPage.expectCashInWalletAssetBalance('USDC', '6,969.00')
  })
})
