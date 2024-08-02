import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'
import { NST_DEV_CHAIN_ID } from '@/config/chain/constants'

test.describe('Deposit NST on NST DevNet', () => {
  const fork = setupFork({ chainId: NST_DEV_CHAIN_ID, simulationDateOverride: new Date('2024-08-02T10:27:19Z') })
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          NST: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickDepositButtonAction('NST')

    depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
  })

  test('uses native sNST deposit', async () => {
    await depositDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'NST' },
      { type: 'makerStableToSavings', asset: 'NST' },
    ])
  })

  test('displays transaction overview', async () => {
    await depositDialog.expectNativeRouteTransactionOverview({
      apy: {
        value: '5.00%',
        description: '~500.00 NST per year',
      },
      routeItems: [
        {
          tokenAmount: '10,000.00 NST',
          tokenUsdValue: '$10,000.00',
        },
        {
          tokenAmount: '9,495.85 sNST',
          tokenUsdValue: '$10,000.00',
        },
      ],
      outcome: '9,495.85 sNST worth $10,000.00',
      badgeToken: 'NST',
    })
  })

  test('executes deposit', async () => {
    const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2, fork)

    await depositDialog.expectSuccessPage()
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsNSTBalance({ sNstBalance: '9,495.85 sNST', estimatedNstValue: '10,000' })
    await savingsPage.expectCashInWalletAssetBalance('NST', '-')
  })
})
