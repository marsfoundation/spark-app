import { USDS_DEV_CHAIN_ID } from '@/config/chain/constants'
import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Deposit USDS on USDS DevNet', () => {
  const fork = setupFork({ chainId: USDS_DEV_CHAIN_ID })
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          USDS: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickDepositButtonAction('USDS')

    depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
  })

  test('uses native sUSDS deposit', async () => {
    await depositDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'USDS' },
      { type: 'depositToSavings', asset: 'USDS', savingsAsset: 'sUSDS' },
    ])
  })

  test('displays transaction overview', async () => {
    await depositDialog.expectNativeRouteTransactionOverview({
      apy: {
        value: '5.00%',
        description: '~500.00 USDS per year',
      },
      routeItems: [
        {
          tokenAmount: '10,000.00 USDS',
          tokenUsdValue: '$10,000.00',
        },
        {
          tokenAmount: '9,997.59 sUSDS',
          tokenUsdValue: '$10,000.00',
        },
      ],
      outcome: '9,997.59 sUSDS worth $10,000.00',
      badgeToken: 'USDS',
    })

    await depositDialog.expectUpgradeSwitchToBeHidden()
  })

  test('executes deposit', async () => {
    const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2, fork)

    await depositDialog.expectSuccessPage()
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsUSDSBalance({ sUsdsBalance: '9,997.59 sUSDS', estimatedUsdsValue: '10,000' })
    await savingsPage.expectStablecoinsInWalletAssetBalance('USDS', '-')
  })
})
