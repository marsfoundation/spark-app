import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'
import { withdrawValidationIssueToMessage } from '../../logic/validation'

test.describe('Withdraw DAI on Mainnet', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id })
  let savingsPage: SavingsPageObject
  let withdrawalDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sDAI: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickWithdrawButtonAction()

    withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
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
          tokenAmount: '6,532.86 sDAI',
          tokenUsdValue: '$7,000.00',
        },
        {
          tokenAmount: '7,000.00 DAI',
          tokenUsdValue: '$7,000.00',
        },
      ],
      outcome: '7,000.00 DAI worth $7,000.00',
      badgeToken: 'DAI',
    })
  })

  test('executes withdrawal', async () => {
    const actionsContainer = new ActionsPageObject(withdrawalDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(1)

    await withdrawalDialog.expectSuccessPage()
    await withdrawalDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsDAIBalance({ sDaiBalance: '3,467.14 sDAI', estimatedDaiValue: '3,715.05' })
    await savingsPage.expectCashInWalletAssetBalance('DAI', '7,000.00')
  })
})

test.describe('Validation', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id })
  let savingsPage: SavingsPageObject
  let withdrawalDialog: SavingsDialogPageObject

  test.describe('Input value exceeds sDAI value', () => {
    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected-random',
          assetBalances: {
            ETH: 1,
            sDAI: 100,
          },
        },
      })

      savingsPage = new SavingsPageObject(page)
      await savingsPage.clickWithdrawButtonAction()

      withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
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
            tokenAmount: '186.65 sDAI',
            tokenUsdValue: '$200.00',
          },
          {
            tokenAmount: '200.00 DAI',
            tokenUsdValue: '$200.00',
          },
        ],
        outcome: '200.00 DAI worth $200.00',
        badgeToken: 'DAI',
      })
    })
  })

  test('displays validation error for dirty input with 0 value', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sDAI: 100,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickWithdrawButtonAction()
    withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })

    await withdrawalDialog.fillAmountAction(10)
    await withdrawalDialog.fillAmountAction(0)

    await withdrawalDialog.expectAssetInputError(withdrawValidationIssueToMessage['value-not-positive'])
  })
})
