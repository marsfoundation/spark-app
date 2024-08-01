import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'
import { depositValidationIssueToMessage } from '../../logic/validation'

test.describe('Deposit DAI on Mainnet', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          DAI: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickDepositButtonAction('DAI')

    depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
  })

  test('uses native sDai deposit', async () => {
    await depositDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'DAI' },
      { type: 'makerStableToSavings', asset: 'DAI' },
    ])
  })

  test('displays transaction overview', async () => {
    await depositDialog.expectNativeRouteTransactionOverview({
      apy: {
        value: '5.00%',
        description: '~500.00 DAI per year',
      },
      routeItems: [
        {
          tokenAmount: '10,000.00 DAI',
          tokenUsdValue: '$10,000.00',
        },
        {
          tokenAmount: '9,495.85 sDAI',
          tokenUsdValue: '$10,000.00',
        },
      ],
      outcome: '9,495.85 sDAI worth $10,000.00',
      badgeToken: 'DAI',
    })
  })

  test('executes deposit', async () => {
    const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2, fork)

    await depositDialog.expectSuccessPage()
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsBalance({ sDaiBalance: '9,495.85 sDAI', estimatedDaiValue: '10,000' })
    await savingsPage.expectCashInWalletAssetBalance('DAI', '-')
  })
})

test.describe('Validation', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id })
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject

  test.describe('Input value exceeds balance', () => {
    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected-random',
          assetBalances: {
            ETH: 1,
            DAI: 100,
          },
        },
      })

      savingsPage = new SavingsPageObject(page)
      await savingsPage.clickDepositButtonAction('DAI')

      depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
      await depositDialog.fillAmountAction(10_000)
    })

    test('displays validation error', async () => {
      await depositDialog.expectAssetInputError(depositValidationIssueToMessage['exceeds-balance'])
    })

    test('actions are disabled', async () => {
      await depositDialog.actionsContainer.expectDisabledActions([
        { type: 'approve', asset: 'DAI' },
        { type: 'makerStableToSavings', asset: 'DAI' },
      ])
    })

    test('displays sensible tx overview', async () => {
      await depositDialog.expectNativeRouteTransactionOverview({
        apy: {
          value: '5.00%',
          description: '~500.00 DAI per year',
        },
        routeItems: [
          {
            tokenAmount: '10,000.00 DAI',
            tokenUsdValue: '$10,000.00',
          },
          {
            tokenAmount: '9,332.66 sDAI',
            tokenUsdValue: '$10,000.00',
          },
        ],
        outcome: '9,332.66 sDAI worth $10,000.00',
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
          DAI: 100,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickDepositButtonAction('DAI')
    depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })

    await depositDialog.fillAmountAction(10)
    await depositDialog.fillAmountAction(0)

    await depositDialog.expectAssetInputError(depositValidationIssueToMessage['value-not-positive'])
  })
})
