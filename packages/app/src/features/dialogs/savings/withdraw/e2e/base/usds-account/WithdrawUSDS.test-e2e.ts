import { psm3Address } from '@/config/contracts-generated'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { BASE_SUSDC_ACTIVE_BLOCK_NUMBER, TOKENS_ON_FORK } from '@/test/e2e/constants'
import { TestContext, setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { base } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../../common/e2e/SavingsDialog.PageObject'
import { withdrawValidationIssueToMessage } from '../../../logic/validation'

test.describe('Withdraw USDS', () => {
  let savingsPage: SavingsPageObject
  let withdrawDialog: SavingsDialogPageObject
  let testContext: TestContext

  test.beforeEach(async ({ page }) => {
    testContext = await setup(page, {
      blockchain: {
        chain: base,
        blockNumber: BASE_SUSDC_ACTIVE_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sUSDS: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickSavingsNavigationItemAction('USDS')
    await savingsPage.clickWithdrawFromAccountButtonAction()

    withdrawDialog = new SavingsDialogPageObject({ testContext, type: 'withdraw' })
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
          tokenAmount: '960.22 sUSDS',
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

    await savingsPage.expectSavingsAccountBalance({ balance: '9,039.78', estimatedValue: '9,414.3213986' })
    await savingsPage.expectSupportedStablecoinBalance('USDS', '1,000')
  })

  test('fails validation if psm3 usds balance is too low', async ({ page }) => {
    await testContext.testnetController.client.setErc20Balance(
      TOKENS_ON_FORK[base.id].USDS.address,
      psm3Address[base.id],
      0n,
    )
    await testContext.testnetController.progressSimulation(5)
    await page.reload()
    await savingsPage.clickSavingsNavigationItemAction('USDS')

    await savingsPage.clickWithdrawFromAccountButtonAction()
    withdrawDialog = new SavingsDialogPageObject({ testContext, type: 'withdraw' })
    await withdrawDialog.fillAmountAction(1000)

    await withdrawDialog.expectAssetInputError(withdrawValidationIssueToMessage['usds-withdraw-cap-reached'])
  })

  test('withdraw with broken browser timer', async ({ page }) => {
    // In the next 3 lines we simulate the browser timer being 30 seconds ahead
    // of the current time on node. setNextBlockTimestamp bascially fixes
    // timestamp on the node until a transaction is mined.
    const { timestamp } = await testContext.testnetController.client.getBlock()
    await testContext.testnetController.client.setNextBlockTimestamp(timestamp + 5n)
    await page.clock.setFixedTime((Number(timestamp) + 30) * 1000) // 30 seconds

    await savingsPage.closeDialog()
    await savingsPage.clickSavingsNavigationItemAction('USDS')
    await savingsPage.clickWithdrawFromAccountButtonAction()
    await withdrawDialog.fillAmountAction(1000)

    await withdrawDialog.actionsContainer.acceptAllActionsAction(2)

    await withdrawDialog.clickBackToSavingsButton()
  })
})
