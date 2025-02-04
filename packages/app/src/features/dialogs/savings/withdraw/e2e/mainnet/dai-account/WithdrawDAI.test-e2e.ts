import { SavingsDialogPageObject } from '@/features/dialogs/savings/common/e2e/SavingsDialog.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { withdrawValidationIssueToMessage } from '../../../logic/validation'

test.describe('Withdraw DAI', () => {
  let savingsPage: SavingsPageObject
  let withdrawalDialog: SavingsDialogPageObject

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
          sDAI: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickSavingsNavigationItemAction('DAI')
    await savingsPage.clickWithdrawFromAccountButtonAction()

    withdrawalDialog = new SavingsDialogPageObject({ testContext, type: 'withdraw' })
    await withdrawalDialog.fillAmountAction(7000)
  })

  test('uses native sDai withdrawal', async () => {
    await withdrawalDialog.actionsContainer.expectActions([
      { type: 'withdrawFromSavings', asset: 'DAI', savingsAsset: 'sDAI', mode: 'withdraw' },
    ])
  })

  test('displays transaction overview', async () => {
    await withdrawalDialog.expectNativeRouteTransactionOverview({
      routeItems: [
        {
          tokenAmount: '6,218.91 sDAI',
          tokenUsdValue: '$7,000.00',
        },
        {
          tokenAmount: '7,000.00 DAI',
          tokenUsdValue: '$7,000.00',
        },
      ],
      outcome: '7,000.00 DAI',
      outcomeUsd: '$7,000.00',
    })
  })

  test('executes withdrawal', async () => {
    await withdrawalDialog.actionsContainer.acceptAllActionsAction(1)

    await withdrawalDialog.expectSuccessPage()
    await withdrawalDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsAccountBalance({ balance: '3,781.09', estimatedValue: '4,255.9918184' })
    await savingsPage.expectSupportedStablecoinBalance('DAI', '7,000.00')
  })
})

test.describe('Validation', () => {
  let savingsPage: SavingsPageObject
  let withdrawalDialog: SavingsDialogPageObject

  test.describe('Input value exceeds sDAI value', () => {
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
            sDAI: 100,
          },
        },
      })

      savingsPage = new SavingsPageObject(testContext)
      await savingsPage.clickSavingsNavigationItemAction('DAI')
      await savingsPage.clickWithdrawFromAccountButtonAction()

      withdrawalDialog = new SavingsDialogPageObject({ testContext, type: 'withdraw' })
      await withdrawalDialog.fillAmountAction(200)
    })

    test('displays validation error', async () => {
      await withdrawalDialog.expectAssetInputError(withdrawValidationIssueToMessage['exceeds-balance'])
    })

    test('actions are disabled', async () => {
      await withdrawalDialog.actionsContainer.expectDisabledActions([
        { type: 'withdrawFromSavings', asset: 'DAI', savingsAsset: 'sDAI', mode: 'withdraw' },
      ])
    })

    test('displays sensible tx overview', async () => {
      await withdrawalDialog.expectNativeRouteTransactionOverview({
        routeItems: [
          {
            tokenAmount: '177.68 sDAI',
            tokenUsdValue: '$200.00',
          },
          {
            tokenAmount: '200.00 DAI',
            tokenUsdValue: '$200.00',
          },
        ],
        outcome: '200.00 DAI',
        outcomeUsd: '$200.00',
      })
    })
  })

  test('displays validation error for dirty input with 0 value', async ({ page }) => {
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
          sDAI: 100,
        },
      },
    })

    savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickSavingsNavigationItemAction('DAI')
    await savingsPage.clickWithdrawFromAccountButtonAction()
    withdrawalDialog = new SavingsDialogPageObject({ testContext, type: 'withdraw' })

    await withdrawalDialog.fillAmountAction(10)
    await withdrawalDialog.fillAmountAction(0)

    await withdrawalDialog.expectAssetInputError(withdrawValidationIssueToMessage['value-not-positive'])
  })
})
