import { USDS_DEV_CHAIN_ID } from '@/config/chain/constants'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { UpgradeDialogPageObject } from '../UpgradeDialog.PageObject'

test.describe('Upgrade sDAI to sUSDS', () => {
  const fork = setupFork({ chainId: USDS_DEV_CHAIN_ID })

  test('does not show upgrade banner when sDai balance is 0', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { sDAI: 0, sUSDS: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    // wait to load
    await savingsPage.expectSavingsUSDSBalance({ sUsdsBalance: '10,000.00 sUSDS', estimatedUsdsValue: '10,002.41' })

    await savingsPage.expectUpgradeDaiToUsdsButtonToBeHidden()
  })

  test('uses upgrade action', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { sDAI: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.clickUpgradeSDaiButtonAction()

    const upgradeDialog = new UpgradeDialogPageObject(page)

    await upgradeDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await upgradeDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sDAI' },
      { type: 'upgrade', fromToken: 'sDAI', toToken: 'sUSDS' },
    ])
  })

  test('executes transaction', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { sDAI: 10_000, sUSDS: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(page)
    await savingsPage.clickUpgradeSDaiButtonAction()

    const upgradeDialog = new UpgradeDialogPageObject(page)
    await upgradeDialog.actionsContainer.acceptAllActionsAction(2, fork)
    await upgradeDialog.expectUpgradeSuccessPage({ token: 'sDAI', amount: '10,000.00', usdValue: '$11,053.61' })
    await upgradeDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsUSDSBalance({ sUsdsBalance: '21,050.94 sUSDS', estimatedUsdsValue: '21,056.01' })
  })
})
