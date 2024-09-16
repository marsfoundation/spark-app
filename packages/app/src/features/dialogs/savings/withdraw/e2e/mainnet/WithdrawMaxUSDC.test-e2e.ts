import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { LITE_PSM_ACTIONS_OPERABLE, LITE_PSM_ACTIONS_OPERABLE_DATE } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Withdraw max USDC on Mainnet', () => {
  const fork = setupFork({
    blockNumber: LITE_PSM_ACTIONS_OPERABLE,
    simulationDateOverride: LITE_PSM_ACTIONS_OPERABLE_DATE,
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
    await savingsPage.clickWithdrawSDaiButtonAction()

    withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
    await withdrawalDialog.selectAssetAction('USDC')
    await withdrawalDialog.clickMaxAmountAction()
  })

  test('uses PSM actions native withdrawal', async () => {
    await withdrawalDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sDAI' },
      { type: 'withdrawFromSavings', asset: 'USDC', savingsAsset: 'sDAI', mode: 'withdraw' },
    ])
  })

  test('displays transaction overview', async () => {
    await withdrawalDialog.expectNativeRouteTransactionOverview({
      routeItems: [
        {
          tokenAmount: '10,000.00 sDAI',
          tokenUsdValue: '$11,048.31',
        },
        {
          tokenAmount: '11,048.31 DAI',
          tokenUsdValue: '$11,048.31',
        },
        {
          tokenAmount: '11,048.31 USDC',
          tokenUsdValue: '$11,048.31',
        },
      ],
      outcome: '11,048.31 USDC worth $11,048.31',
      badgeToken: 'USDC',
    })
  })

  test('executes max withdrawal', async () => {
    const actionsContainer = new ActionsPageObject(withdrawalDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2)

    await withdrawalDialog.expectSuccessPage()
    await withdrawalDialog.clickBackToSavingsButton()

    await savingsPage.expectPotentialProjection('$53.04', '30-day')
    await savingsPage.expectPotentialProjection('$662.90', '1-year')
    await savingsPage.expectStablecoinsInWalletAssetBalance('USDC', '11,048.32')
  })
})
