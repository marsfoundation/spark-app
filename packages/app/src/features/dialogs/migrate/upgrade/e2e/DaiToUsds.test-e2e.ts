import { USDS_DEV_CHAIN_ID } from '@/config/chain/constants'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { UpgradeDialogPageObject } from '../UpgradeDialog.PageObject'

test.describe('Upgrade DAI to USDS', () => {
  const fork = setupFork({ chainId: USDS_DEV_CHAIN_ID })

  test('does not show upgrade button when DAI balance is 0', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { USDS: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    // wait to load
    await savingsPage.expectPotentialProjection('$40.18', '30-day')
    await savingsPage.expectPotentialProjection('$500.00', '1-year')

    await savingsPage.expectUpgradeDaiToUsdsButtonToBeHidden()
  })

  test('uses upgrade action', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { DAI: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.clickUpgradeDaiToUsdsButtonAction()

    const upgradeDialog = new UpgradeDialogPageObject(page)

    await upgradeDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await upgradeDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'DAI' },
      { type: 'upgrade', fromToken: 'DAI', toToken: 'USDS' },
    ])
  })

  test('executes transaction', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { DAI: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.expectCashInWalletAssetBalance('USDS', '-')
    await savingsPage.clickUpgradeDaiToUsdsButtonAction()

    const upgradeDialog = new UpgradeDialogPageObject(page)

    await upgradeDialog.actionsContainer.acceptAllActionsAction(2, fork)
    await upgradeDialog.expectSuccessPage(
      [
        {
          asset: 'DAI',
          amount: 10_000,
        },
      ],
      fork,
    )
    await upgradeDialog.clickBackToSavingsButton()

    await savingsPage.expectCashInWalletAssetBalance('USDS', '10,000')
  })
})
