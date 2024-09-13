import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { LITE_PSM_ACTIONS_OPERABLE, LITE_PSM_ACTIONS_OPERABLE_DATE } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Withdraw USDC on Mainnet', () => {
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
    await withdrawalDialog.fillAmountAction(6969)
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
          tokenAmount: '6,307.75 sDAI',
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
      badgeToken: 'USDC',
    })
  })

  test('executes withdrawal', async () => {
    const actionsContainer = new ActionsPageObject(withdrawalDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2)

    await withdrawalDialog.expectSuccessPage()
    await withdrawalDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsDAIBalance({ sDaiBalance: '3,692.25 sDAI', estimatedDaiValue: '4,079.31' })
    await savingsPage.expectStablecoinsInWalletAssetBalance('USDC', '6,969.00')
  })
})
