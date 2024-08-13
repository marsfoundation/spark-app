import { NST_DEV_CHAIN_ID } from '@/config/chain/constants'
import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Withdraw NST on NST DevNet', () => {
  const fork = setupFork({ chainId: NST_DEV_CHAIN_ID, simulationDateOverride: new Date('2024-08-05T10:43:19Z') })
  let savingsPage: SavingsPageObject
  let withdrawDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sNST: 1_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickWithdrawSNstButtonAction()

    withdrawDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
    await withdrawDialog.fillAmountAction(1_000)
  })

  test('uses native sNST withdraw', async () => {
    await withdrawDialog.actionsContainer.expectActions([
      { type: 'withdrawFromSavings', asset: 'NST', savingsAsset: 'sNST', mode: 'withdraw' },
    ])
  })

  test('displays transaction overview', async () => {
    await withdrawDialog.expectNativeRouteTransactionOverview({
      routeItems: [
        {
          tokenAmount: '989.64 sNST',
          tokenUsdValue: '$1,000.00',
        },
        {
          tokenAmount: '1,000.00 NST',
          tokenUsdValue: '$1,000.00',
        },
      ],
      outcome: '1,000.00 NST worth $1,000.00',
      badgeToken: 'NST',
    })

    await withdrawDialog.expectUpgradeSwitchToBeHidden()
  })

  test('executes withdraw', async () => {
    const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(1, fork)

    await withdrawDialog.expectSuccessPage()
    await withdrawDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsNSTBalance({ sNstBalance: '10.36 sNST', estimatedNstValue: '10.46' })
    await savingsPage.expectCashInWalletAssetBalance('NST', '1,000')
  })
})
