import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { UpgradeDialogPageObject } from '../UpgradeDialog.PageObject'

test.describe('Upgrade DAI to USDS', () => {
  test('does not show upgrade button when DAI balance is 0', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chain: mainnet,
        blockNumber: DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { USDS: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    // wait to load
    await savingsPage.expectOpportunityStablecoinsAmount('~$10,000.00')

    await savingsPage.expectUpgradeDaiToUsdsButtonToBeHidden()
  })

  test('uses upgrade action', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chain: mainnet,
        blockNumber: DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { DAI: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.clickUpgradeDaiToUsdsButtonAction()

    const upgradeDialog = new UpgradeDialogPageObject(testContext)

    await upgradeDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await upgradeDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'DAI' },
      { type: 'upgrade', fromToken: 'DAI', toToken: 'USDS' },
    ])
  })

  test('displays transaction overview', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chain: mainnet,
        blockNumber: DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { DAI: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickUpgradeDaiToUsdsButtonAction()
    const upgradeDialog = new UpgradeDialogPageObject(testContext)

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
      outcome: '10,000.00 USDS',
      outcomeUsd: '$10,000.00',
    })
  })

  test('executes transaction', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chain: mainnet,
        blockNumber: DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { DAI: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(testContext)

    await savingsPage.expectStablecoinsInWalletAssetBalance('USDS', '-')
    await savingsPage.clickUpgradeDaiToUsdsButtonAction()

    const upgradeDialog = new UpgradeDialogPageObject(testContext)

    await upgradeDialog.actionsContainer.acceptAllActionsAction(2)
    await upgradeDialog.expectSuccessPage({
      tokenWithValue: [
        {
          asset: 'DAI',
          amount: '10,000.00',
          usdValue: '$10,000.00',
        },
      ],
    })
    await upgradeDialog.clickBackToSavingsButton()

    await savingsPage.expectStablecoinsInWalletAssetBalance('USDS', '10,000')
  })
})
