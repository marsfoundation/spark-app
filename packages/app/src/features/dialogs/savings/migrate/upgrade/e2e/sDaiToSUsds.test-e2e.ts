import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { USDS_ACTIVATED_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { UpgradeDialogPageObject } from '../UpgradeDialog.PageObject'

test.describe('Upgrade sDAI to sUSDS', () => {
  const fork = setupFork({ blockNumber: USDS_ACTIVATED_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })

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
    await savingsPage.expectSavingsUsdsBalance({ susdsBalance: '10,000.00 sUSDS', estimatedUsdsValue: '10,000.23' })

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

  test('displays transaction overview', async ({ page }) => {
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

    await upgradeDialog.expectTransactionOverview({
      apyChange: {
        current: '6.00%',
        updated: '6.25%',
      },
      routeItems: [
        {
          tokenAmount: '10,000.00 sDAI',
          tokenUsdValue: '$11,085.91',
        },
        {
          tokenAmount: '11,085.65 sUSDS',
          tokenUsdValue: '$11,085.91',
        },
      ],
      outcome: '11,085.65 sUSDS worth $11,085.91',
      badgeTokens: 'sDAI',
    })
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
    await upgradeDialog.expectUpgradeSuccessPage({ token: 'sDAI', amount: '10,000.00', usdValue: '$11,085.91' })
    await upgradeDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsUsdsBalance({ susdsBalance: '21,085.65 sUSDS', estimatedUsdsValue: '21,086.13' })
  })
})
