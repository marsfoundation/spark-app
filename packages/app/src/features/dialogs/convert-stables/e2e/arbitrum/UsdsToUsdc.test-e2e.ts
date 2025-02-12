import { psm3Address } from '@/config/contracts-generated'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { ARBITRUM_DEFAULT_BLOCK_NUMBER, TOKENS_ON_FORK } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { parseUnits } from 'viem'
import { arbitrum } from 'viem/chains'
import { ConvertStablesDialogPageObject } from '../../ConvertStablesDialog.PageObject'

test.describe('Convert USDS to USDC', () => {
  let savingsPage: SavingsPageObject
  let convertStablesDialog: ConvertStablesDialogPageObject

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        blockNumber: ARBITRUM_DEFAULT_BLOCK_NUMBER,
        chain: arbitrum,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          USDS: 10_000,
        },
      },
    })

    // @note: set psm3 balances cause no liquidity in psm3 yet
    const usdc = TOKENS_ON_FORK[arbitrum.id].USDC
    await testContext.testnetController.client.setErc20Balance(
      usdc.address,
      psm3Address[arbitrum.id],
      parseUnits('100000', usdc.decimals),
    )
    const usds = TOKENS_ON_FORK[arbitrum.id].USDS
    await testContext.testnetController.client.setErc20Balance(
      usds.address,
      psm3Address[arbitrum.id],
      parseUnits('100000', usds.decimals),
    )

    savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickConvertStablesButtonAction()

    convertStablesDialog = new ConvertStablesDialogPageObject(testContext)
    await convertStablesDialog.selectAssetInAction('USDS')
    await convertStablesDialog.selectAssetOutAction('USDC')
    await convertStablesDialog.fillAmountInAction(10_000)
  })

  test('uses psm convert action', async () => {
    await convertStablesDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await convertStablesDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'USDS' },
      { type: 'psmConvert', inToken: 'USDS', outToken: 'USDC' },
    ])
  })

  test('displays transaction overview', async () => {
    await convertStablesDialog.expectTransactionOverview({
      routeItems: [
        {
          tokenAmount: '10,000.00 USDS',
          tokenUsdValue: '$10,000.00',
        },
        {
          tokenAmount: '10,000.00 USDC',
          tokenUsdValue: '$10,000.00',
        },
      ],
      outcome: '10,000.00 USDC',
      outcomeUsd: '$10,000.00',
    })
  })

  test('executes conversion', async () => {
    await convertStablesDialog.actionsContainer.acceptAllActionsAction(2)
    await convertStablesDialog.expectSuccessPage()
    await convertStablesDialog.clickBackToSavingsButton()
    await savingsPage.expectSupportedStablecoinBalance('USDS', '-')
    await savingsPage.expectSupportedStablecoinBalance('USDC', '10,000.00')
  })
})
