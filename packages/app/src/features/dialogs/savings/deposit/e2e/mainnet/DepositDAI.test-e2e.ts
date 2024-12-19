import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Deposit DAI', () => {
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chainId: mainnet.id,
        blockNumber: DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          DAI: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickDepositButtonAction('DAI')

    depositDialog = new SavingsDialogPageObject({ testContext, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
  })

  test.describe('To sUSDS', () => {
    test('uses PSM actions native deposit', async () => {
      await depositDialog.actionsContainer.expectActions([
        { type: 'approve', asset: 'DAI' },
        { type: 'depositToSavings', asset: 'DAI', savingsAsset: 'sUSDS' },
      ])
    })

    test('displays transaction overview', async () => {
      await depositDialog.expectNativeRouteTransactionOverview({
        apy: {
          value: '12.50%',
          description: 'Earn ~1,250.00 USDS/year',
        },
        routeItems: [
          {
            tokenAmount: '10,000.00 DAI',
            tokenUsdValue: '$10,000.00',
          },
          {
            tokenAmount: '10,000.00 USDS',
            tokenUsdValue: '$10,000.00',
          },
          {
            tokenAmount: '9,830.34 sUSDS',
            tokenUsdValue: '$10,000.00',
          },
        ],
        outcome: '9,830.34 sUSDS',
        outcomeUsd: '$10,000.00',
      })
    })

    test('executes deposit', async () => {
      await depositDialog.actionsContainer.acceptAllActionsAction(2)

      await depositDialog.expectSuccessPage()
      await depositDialog.clickBackToSavingsButton()

      await savingsPage.expectSavingsUsdsBalance({ susdsBalance: '9,830.34 sUSDS', estimatedUsdsValue: '10,000' })
      await savingsPage.expectStablecoinsInWalletAssetBalance('DAI', '-')
    })
  })

  test.describe('To sDAI', () => {
    test.beforeEach(async () => {
      await depositDialog.clickUpgradeSwitch()
    })

    test('uses PSM actions native deposit', async () => {
      await depositDialog.actionsContainer.expectActions([
        { type: 'approve', asset: 'DAI' },
        { type: 'depositToSavings', asset: 'DAI', savingsAsset: 'sDAI' },
      ])
    })

    test('displays transaction overview', async () => {
      await depositDialog.expectNativeRouteTransactionOverview({
        apy: {
          value: '6.00%',
          description: 'Earn ~600.00 DAI/year',
        },
        routeItems: [
          {
            tokenAmount: '10,000.00 DAI',
            tokenUsdValue: '$10,000.00',
          },
          {
            tokenAmount: '8,884.16 sDAI',
            tokenUsdValue: '$10,000.00',
          },
        ],
        outcome: '8,884.16 sDAI',
        outcomeUsd: '$10,000.00',
      })
    })

    test('executes deposit', async () => {
      await depositDialog.actionsContainer.acceptAllActionsAction(2)

      await depositDialog.expectSuccessPage()
      await depositDialog.clickBackToSavingsButton()

      await savingsPage.expectSavingsDaiBalance({ sdaiBalance: '8,884.16 sDAI', estimatedDaiValue: '10,000' })
      await savingsPage.expectStablecoinsInWalletAssetBalance('DAI', '-')
    })
  })

  test('executes sDai deposit after switching from already approved sUsds', async () => {
    // accepting only approve
    await depositDialog.actionsContainer.acceptAllActionsAction(1)
    await depositDialog.actionsContainer.expectEnabledActionAtIndex(1)
    // switching to sDai deposit when already approved sUsds
    await depositDialog.clickUpgradeSwitch()
    // actions should reset and new approval is required
    await depositDialog.actionsContainer.acceptAllActionsAction(2)

    await depositDialog.expectSuccessPage()
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsDaiBalance({ sdaiBalance: '8,884.16 sDAI', estimatedDaiValue: '10,000' })
    await savingsPage.expectStablecoinsInWalletAssetBalance('DAI', '-')
  })

  test('executes sUsds deposit after switching from already approved sUsds and back', async () => {
    // accepting only approve
    await depositDialog.actionsContainer.acceptAllActionsAction(1)
    await depositDialog.actionsContainer.expectEnabledActionAtIndex(1)
    // switching to sDai deposit and back to sUsds
    await depositDialog.clickUpgradeSwitch()
    await depositDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await depositDialog.clickUpgradeSwitch()
    // approval should be already successful, only deposit needed
    await depositDialog.actionsContainer.acceptActionAtIndex(1)

    await depositDialog.expectSuccessPage()
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsUsdsBalance({ susdsBalance: '9,830.34 sUSDS', estimatedUsdsValue: '10,000' })
    await savingsPage.expectStablecoinsInWalletAssetBalance('DAI', '-')
  })
})
