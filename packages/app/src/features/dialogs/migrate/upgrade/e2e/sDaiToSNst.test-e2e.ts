import { NST_DEV_CHAIN_ID } from '@/config/chain/constants'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { UpgradeDialogPageObject } from '../UpgradeDialog.PageObject'

test.describe('Upgrade sDAI to sNST', () => {
  const fork = setupFork({ chainId: NST_DEV_CHAIN_ID })

  test('does not show upgrade banner when sDai balance is 0', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { sDAI: 0, sNST: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    // wait to load
    await savingsPage.expectSavingsNSTBalance({ sNstBalance: '10,000.00 sNST', estimatedNstValue: '10,100' })

    await savingsPage.expectUpgradeDaiToNstButtonToBeHidden()
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
      { type: 'upgrade', fromToken: 'sDAI', toToken: 'sNST' },
    ])
  })

  test('executes transaction', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { sDAI: 10_000, sNST: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(page)
    await savingsPage.clickUpgradeSDaiButtonAction()

    const upgradeDialog = new UpgradeDialogPageObject(page)
    await upgradeDialog.actionsContainer.acceptAllActionsAction(2, fork)
    await upgradeDialog.expectUpgradeSuccessPage({ token: 'sDAI', amount: '10,000.00', usdValue: '$11,047.93' })
    await upgradeDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsNSTBalance({ sNstBalance: '20,937.60 sNST', estimatedNstValue: '21,148' })
  })
})
