import { psm3Address } from '@/config/contracts-generated'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { ARBITRUM_DEFAULT_BLOCK_NUMBER, TOKENS_ON_FORK } from '@/test/e2e/constants'
import { TestContext, setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { arbitrum } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../../common/e2e/SavingsDialog.PageObject'
import { withdrawValidationIssueToMessage } from '../../../logic/validation'

test.describe('Withdraw USDS', () => {
  let savingsPage: SavingsPageObject
  let withdrawDialog: SavingsDialogPageObject
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
          sUSDS: 10_000,
        },
      },
      balanceOverrides: {
        [psm3Address[arbitrum.id]]: {
          USDS: 100_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickWithdrawFromAccountButtonAction()

    withdrawDialog = new SavingsDialogPageObject({ testContext, type: 'withdraw' })
    await withdrawDialog.selectAssetAction('USDS')
    await withdrawDialog.fillAmountAction(1000)
  })

  test('has correct action plan', async () => {
    await withdrawDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sUSDS' },
      { type: 'withdrawFromSavings', asset: 'USDS', savingsAsset: 'sUSDS', mode: 'withdraw' },
    ])
  })

  test('displays transaction overview', async () => {
    await withdrawDialog.expectNativeRouteTransactionOverview({
      routeItems: [
        {
          tokenAmount: '964.37 sUSDS',
          tokenUsdValue: '$1,000.00',
        },
        {
          tokenAmount: '1,000.00 USDS',
          tokenUsdValue: '$1,000.00',
        },
      ],
      outcome: '1,000.00 USDS',
      outcomeUsd: '$1,000.00',
    })

    await withdrawDialog.expectUpgradeSwitchToBeHidden()
  })

  test('executes withdraw', async () => {
    await withdrawDialog.actionsContainer.acceptAllActionsAction(2)

    await withdrawDialog.expectSuccessPage()
    await withdrawDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsAccountBalance({ balance: '9,035.63', estimatedValue: '9,369.444764' })
    await savingsPage.expectSupportedStablecoinBalance('USDS', '1,000')
  })

  test('executes withdraw for small amount', async () => {
    await withdrawDialog.fillAmountAction(1)
    await withdrawDialog.actionsContainer.acceptAllActionsAction(2)

    await withdrawDialog.expectSuccessPage()
    await withdrawDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsAccountBalance({ balance: '9,999.04', estimatedValue: '10,368.444764' })
    await savingsPage.expectSupportedStablecoinBalance('USDS', '1')
  })

  test('fails validation if psm3 usds balance is too low', async ({ page }) => {
    await testContext.testnetController.client.setErc20Balance(
      TOKENS_ON_FORK[arbitrum.id].USDS.address,
      psm3Address[arbitrum.id],
      0n,
    )
    await testContext.testnetController.progressSimulation(5)
    await page.reload()

    await savingsPage.clickWithdrawFromAccountButtonAction()
    withdrawDialog = new SavingsDialogPageObject({ testContext, type: 'withdraw' })
    await withdrawDialog.selectAssetAction('USDS')
    await withdrawDialog.fillAmountAction(1000)

    await withdrawDialog.expectAssetInputError(withdrawValidationIssueToMessage['usds-withdraw-cap-reached'])
  })
})
