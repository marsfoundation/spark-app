import { psm3Address } from '@/config/contracts-generated'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { ARBITRUM_DEFAULT_BLOCK_NUMBER, TOKENS_ON_FORK } from '@/test/e2e/constants'
import { TestContext, setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { parseUnits } from 'viem'
import { arbitrum } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../../common/e2e/SavingsDialog.PageObject'
import { depositValidationIssueToMessage } from '../../../logic/validation'

test.describe('Deposit USDC', () => {
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject
  let testContext: TestContext

  test.beforeEach(async ({ page }) => {
    testContext = await setup(page, {
      blockchain: {
        chain: arbitrum,
        blockNumber: ARBITRUM_DEFAULT_BLOCK_NUMBER,
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

    // @note: set susds balance cause no liquidity in psm3 yet
    const susds = TOKENS_ON_FORK[arbitrum.id].sUSDS
    await testContext.testnetController.client.setErc20Balance(
      susds.address,
      psm3Address[arbitrum.id],
      parseUnits('100000', susds.decimals),
    )

    savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickDepositButtonAction('USDC')

    depositDialog = new SavingsDialogPageObject({ testContext, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
  })

  test('has correct action plan', async () => {
    await depositDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'USDC' },
      { type: 'depositToSavings', asset: 'USDC', savingsAsset: 'sUSDS' },
    ])
  })

  test('displays transaction overview', async () => {
    await depositDialog.expectNativeRouteTransactionOverview({
      apy: {
        value: '8.75%',
        description: 'Earn ~875.00 USDS/year',
      },
      routeItems: [
        {
          tokenAmount: '10,000.00 USDC',
          tokenUsdValue: '$10,000.00',
        },
        {
          tokenAmount: '10,000.00 USDS',
          tokenUsdValue: '$10,000.00',
        },
        {
          tokenAmount: '9,643.72 sUSDS',
          tokenUsdValue: '$10,000.00',
        },
      ],
      outcome: '9,643.72 sUSDS',
      outcomeUsd: '$10,000.00',
    })
  })

  test('executes deposit', async () => {
    await depositDialog.actionsContainer.acceptAllActionsAction(2)

    await depositDialog.expectSuccessPage()
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsAccountBalance({
      balance: '9,643.72',
      estimatedValue: '10,000.000000', // USDC has 6 decimals, so the value is rounded down. This is consistent with the data in the smart contract
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

    await savingsPage.clickDepositButtonAction('USDC')

    depositDialog = new SavingsDialogPageObject({ testContext, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
    await depositDialog.expectAssetInputError(depositValidationIssueToMessage['exceeds-psm3-balance'])
  })
})
