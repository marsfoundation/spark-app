import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { UpgradeDialogPageObject } from '../UpgradeDialog.PageObject'

test.describe('Upgrade sDAI to sUSDS', () => {
  test('does not show upgrade banner when sDai balance is 0', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chainId: mainnet.id,
        blockNumber: DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { sDAI: 0, sUSDS: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    // wait to load
    await savingsPage.expectSavingsUsdsBalance({ susdsBalance: '10,000.00 sUSDS', estimatedUsdsValue: '10,172.58' })

    await savingsPage.expectUpgradeSDaiBannerToBeHidden()
  })

  test('uses upgrade action', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chainId: mainnet.id,
        blockNumber: DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { sDAI: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.clickUpgradeSDaiButtonAction()

    const upgradeDialog = new UpgradeDialogPageObject(testContext)

    await upgradeDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await upgradeDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sDAI' },
      { type: 'upgrade', fromToken: 'sDAI', toToken: 'sUSDS' },
    ])
  })

  test('displays transaction overview', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chainId: mainnet.id,
        blockNumber: DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { sDAI: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.clickUpgradeSDaiButtonAction()

    const upgradeDialog = new UpgradeDialogPageObject(testContext)

    await upgradeDialog.expectTransactionOverview({
      apyChange: {
        current: '11.50%',
        updated: '12.50%',
      },
      routeItems: [
        {
          tokenAmount: '10,000.00 sDAI',
          tokenUsdValue: '$11,255.99',
        },
        {
          tokenAmount: '11,065.02 sUSDS',
          tokenUsdValue: '$11,255.99',
        },
      ],
      outcome: '11,065.02 sUSDS',
      outcomeUsd: '$11,255.99',
    })
  })

  test('executes transaction', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chainId: mainnet.id,
        blockNumber: DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { sDAI: 10_000, sUSDS: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickUpgradeSDaiButtonAction()

    const upgradeDialog = new UpgradeDialogPageObject(testContext)
    await upgradeDialog.actionsContainer.acceptAllActionsAction(2)
    await upgradeDialog.expectUpgradeSuccessPage({ token: 'sDAI', amount: '10,000.00', usdValue: '$11,255.99' })
    await upgradeDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsUsdsBalance({ susdsBalance: '21,065.02 sUSDS', estimatedUsdsValue: '21,428.579836' })
  })
})
