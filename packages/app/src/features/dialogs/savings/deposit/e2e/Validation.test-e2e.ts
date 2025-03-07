import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../../common/e2e/SavingsDialog.PageObject'
import { depositValidationIssueToMessage } from '../logic/validation'

test.describe('Validation', () => {
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject

  test.describe('Input value exceeds balance', () => {
    test.beforeEach(async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          chain: mainnet,
          blockNumber: DEFAULT_BLOCK_NUMBER,
        },
        initialPage: 'savings',
        account: {
          type: 'connected-random',
          assetBalances: {
            ETH: 1,
            USDS: 100,
          },
        },
      })

      savingsPage = new SavingsPageObject(testContext)
      await savingsPage.clickDepositButtonAction('USDS')

      depositDialog = new SavingsDialogPageObject({ testContext, type: 'deposit' })
      await depositDialog.fillAmountAction(10_000)
    })

    test('displays validation error', async () => {
      await depositDialog.expectAssetInputError(depositValidationIssueToMessage['exceeds-balance'])
    })

    test('actions are disabled', async () => {
      await depositDialog.actionsContainer.expectDisabledActions([
        { type: 'approve', asset: 'USDS' },
        { type: 'depositToSavings', asset: 'USDS', savingsAsset: 'sUSDS' },
      ])
    })

    test('displays sensible tx overview', async () => {
      await depositDialog.expectNativeRouteTransactionOverview({
        apy: {
          value: '12.50%',
          description: 'Earn ~1,250.00 USDS/year',
        },
        routeItems: [
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
  })

  test('displays validation error for dirty input with 0 value', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chain: mainnet,
        blockNumber: DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          USDS: 100,
        },
      },
    })

    savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickDepositButtonAction('USDS')
    depositDialog = new SavingsDialogPageObject({ testContext, type: 'deposit' })

    await depositDialog.fillAmountAction(10)
    await depositDialog.fillAmountAction(0)

    await depositDialog.expectAssetInputError(depositValidationIssueToMessage['value-not-positive'])
  })
})
