import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { USDS_ACTIVATED_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { UpgradeDialogPageObject } from '../UpgradeDialog.PageObject'

test.describe('Upgrade DAI to USDS', () => {
  const fork = setupFork({ blockNumber: USDS_ACTIVATED_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })

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
    await savingsPage.expectOpportunityStablecoinsAmount('~$10,000.00')

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

  test('displays transaction overview', async ({ page }) => {
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

    await upgradeDialog.expectTransactionOverview({
      routeItems: [
        {
          tokenAmount: '10,000.00 DAI',
          tokenUsdValue: '$10,000.00',
        },
        {
          tokenAmount: '10,000.00 USDS',
          tokenUsdValue: '$10,000.00',
        },
      ],
      outcome: '10,000.00 USDS worth $10,000.00',
      badgeToken: 'DAI',
    })
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

    await savingsPage.expectStablecoinsInWalletAssetBalance('USDS', '-')
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

    await savingsPage.expectStablecoinsInWalletAssetBalance('USDS', '10,000')
  })
})
