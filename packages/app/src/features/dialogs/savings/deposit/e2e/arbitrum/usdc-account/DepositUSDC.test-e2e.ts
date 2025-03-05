import { psm3Address } from '@/config/contracts-generated'
import { SavingsDialogPageObject } from '@/features/dialogs/savings/common/e2e/SavingsDialog.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { ARBITRUM_SUSDC_ACTIVE_BLOCK_NUMBER, TOKENS_ON_FORK } from '@/test/e2e/constants'
import { TestContext, setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { arbitrum } from 'viem/chains'
import { depositValidationIssueToMessage } from '../../../logic/validation'

test.describe('Deposit USDC', () => {
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject
  let testContext: TestContext

  test.beforeEach(async ({ page }) => {
    testContext = await setup(page, {
      blockchain: {
        chain: arbitrum,
        blockNumber: ARBITRUM_SUSDC_ACTIVE_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          USDC: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickSavingsNavigationItemAction('USDC')
    await savingsPage.clickDepositButtonAction('USDC')

    depositDialog = new SavingsDialogPageObject({ testContext, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
  })

  test('has correct action plan', async () => {
    await depositDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'USDC' },
      { type: 'depositToSavings', asset: 'USDC', savingsAsset: 'sUSDC' },
    ])
  })

  test('displays transaction overview', async () => {
    await depositDialog.expectNativeRouteTransactionOverview({
      apy: {
        value: '6.50%',
        description: 'Earn ~650.00 USDC/year',
      },
      routeItems: [
        {
          tokenAmount: '10,000.00 USDC',
          tokenUsdValue: '$10,000.00',
        },
        {
          tokenAmount: '9,601.69 sUSDC',
          tokenUsdValue: '$10,000.00',
        },
      ],
      outcome: '9,601.69 sUSDC',
      outcomeUsd: '$10,000.00',
    })
  })

  test('executes deposit', async () => {
    await depositDialog.actionsContainer.acceptAllActionsAction(2)

    await depositDialog.expectSuccessPage()
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsAccountBalance({
      balance: '9,601.69',
      estimatedValue: '9,999.9999996',
    })
    await savingsPage.expectSupportedStablecoinBalance('USDC', '-')
  })

  test('fails validation if psm3 usds balance is too low', async ({ page }) => {
    await testContext.testnetController.client.setErc20Balance(
      TOKENS_ON_FORK[arbitrum.id].sUSDS.address,
      psm3Address[arbitrum.id],
      0n,
    )
    await testContext.testnetController.progressSimulation(5)
    await page.reload()
    await savingsPage.clickSavingsNavigationItemAction('USDC')

    await savingsPage.clickDepositButtonAction('USDC')

    depositDialog = new SavingsDialogPageObject({ testContext, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
    await depositDialog.expectAssetInputError(depositValidationIssueToMessage['exceeds-psm3-balance'])
  })
})
