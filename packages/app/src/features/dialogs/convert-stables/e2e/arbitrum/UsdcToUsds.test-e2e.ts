import { psm3Address } from '@/config/contracts-generated'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { ARBITRUM_DEFAULT_BLOCK_NUMBER, TOKENS_ON_FORK } from '@/test/e2e/constants'
import { TestContext, setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { arbitrum } from 'viem/chains'
import { ConvertStablesDialogPageObject } from '../../ConvertStablesDialog.PageObject'
import { convertStablesValidationIssueToMessage } from '../../logic/form/validator'

test.describe('Convert USDC to USDS', () => {
  let savingsPage: SavingsPageObject
  let convertStablesDialog: ConvertStablesDialogPageObject
  let testContext: TestContext

  test.beforeEach(async ({ page }) => {
    testContext = await setup(page, {
      blockchain: {
        blockNumber: ARBITRUM_DEFAULT_BLOCK_NUMBER,
        chain: arbitrum,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          USDC: 10_000,
        },
      },
      balanceOverrides: {
        [psm3Address[arbitrum.id]]: {
          USDC: 100_000,
          USDS: 100_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickConvertStablesButtonAction()

    convertStablesDialog = new ConvertStablesDialogPageObject(testContext)
    await convertStablesDialog.selectAssetInAction('USDC')
    await convertStablesDialog.selectAssetOutAction('USDS')
    await convertStablesDialog.fillAmountInAction(10_000)
  })

  test('uses psm convert action', async () => {
    await convertStablesDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await convertStablesDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'USDC' },
      { type: 'psmConvert', inToken: 'USDC', outToken: 'USDS' },
    ])
  })

  test('displays transaction overview', async () => {
    await convertStablesDialog.expectTransactionOverview({
      routeItems: [
        {
          tokenAmount: '10,000.00 USDC',
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

  test('executes conversion', async () => {
    await convertStablesDialog.actionsContainer.acceptAllActionsAction(2)
    await convertStablesDialog.expectSuccessPage()
    await convertStablesDialog.clickBackToSavingsButton()
    await savingsPage.expectSupportedStablecoinBalance('USDC', '-')
    await savingsPage.expectSupportedStablecoinBalance('USDS', '10,000.00')
  })

  test('fails validation if psm3 usds balance is too low', async ({ page }) => {
    await testContext.testnetController.client.setErc20Balance(
      TOKENS_ON_FORK[arbitrum.id].USDS.address,
      psm3Address[arbitrum.id],
      0n,
    )
    await testContext.testnetController.progressSimulation(5)
    await page.reload()

    await savingsPage.clickConvertStablesButtonAction()
    convertStablesDialog = new ConvertStablesDialogPageObject(testContext)
    await convertStablesDialog.selectAssetInAction('USDC')
    await convertStablesDialog.selectAssetOutAction('USDS')
    await convertStablesDialog.fillAmountInAction(10_000)

    await convertStablesDialog.expectAssetInputError(
      convertStablesValidationIssueToMessage['usds-withdraw-cap-reached'],
    )
  })
})
