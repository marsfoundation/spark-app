import { NST_DEV_CHAIN_ID } from '@/config/chain/constants'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { DialogPageObject } from '../../../common/Dialog.PageObject'
import { UpgradeDialogPageObject } from '../UpgradeDialog.PageObject'

test.describe('Upgrade DAI to NST', () => {
  const fork = setupFork({ chainId: NST_DEV_CHAIN_ID, simulationDateOverride: new Date('2024-08-05T10:43:19Z') })

  test('does not shows upgrade button when DAI balance is 0', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { NST: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    // wait to load
    await savingsPage.expectPotentialProjection('$40.18', '30-day')
    await savingsPage.expectPotentialProjection('$500.00', '1-year')

    await savingsPage.expectUpgradeDaiToNstButtonToBeHidden()
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

    await savingsPage.clickUpgradeDaiToNstButtonAction()

    const upgradeDialog = new DialogPageObject(page, /Upgrade/)

    await upgradeDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await upgradeDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'DAI' },
      { type: 'upgrade', fromToken: 'DAI', toToken: 'NST' },
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

    await savingsPage.expectCashInWalletAssetBalance('NST', '-')
    await savingsPage.clickUpgradeDaiToNstButtonAction()

    const upgradeDialog = new UpgradeDialogPageObject(page)

    await upgradeDialog.actionsContainer.acceptAllActionsAction(2)
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

    await savingsPage.expectCashInWalletAssetBalance('NST', '10,000')
  })
})
