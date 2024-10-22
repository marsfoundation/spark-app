import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { USDS_ACTIVATED_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { ConvertStablesDialogPageObject } from './ConvertStablesDialog.PageObject'

test.describe('Convert Stables Dialog', () => {
  const fork = setupFork({ blockNumber: USDS_ACTIVATED_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
  let savingsPage: SavingsPageObject
  let convertStablesDialog: ConvertStablesDialogPageObject

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
    await savingsPage.clickConvertStablesButtonAction()
    convertStablesDialog = new ConvertStablesDialogPageObject(page)
  })

  test('has correct selectors configuration', async ({ page }) => {
    await convertStablesDialog.expectAssetInSelectorSelectedOption('DAI')
    await convertStablesDialog.openAssetInSelectorAction()
    await convertStablesDialog.expectSelectorOptions(['USDC', 'USDS'])
    await page.keyboard.press('Escape') // closing selector

    await convertStablesDialog.expectAssetOutSelectorSelectedOption('USDC')
    await convertStablesDialog.openAssetOutSelectorAction()
    await convertStablesDialog.expectSelectorOptions(['USDS']) // no DAI option cause already selected in first selector
  })

  test('first selector can override second selector', async () => {
    await convertStablesDialog.expectAssetInSelectorSelectedOption('DAI')
    await convertStablesDialog.expectAssetOutSelectorSelectedOption('USDC')

    await convertStablesDialog.selectAssetInAction('USDC') // choosing already selected in second selector option

    await convertStablesDialog.expectAssetOutSelectorSelectedOption('DAI') // fist selector can override second
    await convertStablesDialog.openAssetOutSelectorAction()
    await convertStablesDialog.expectSelectorOptions(['USDS'])
  })

  test('changing value of any input updates both inputs', async () => {
    await convertStablesDialog.fillAmountInAction(5000)
    await convertStablesDialog.expectAssetInInputValue('5000')
    await convertStablesDialog.expectAssetOutInputValue('5000')

    await convertStablesDialog.clickMaxAmountInAction()
    await convertStablesDialog.expectAssetInInputValue('10000')
    await convertStablesDialog.expectAssetOutInputValue('10000')

    await convertStablesDialog.fillAmountOutAction(8_000)
    await convertStablesDialog.expectAssetInInputValue('8000')
    await convertStablesDialog.expectAssetOutInputValue('8000')

    await convertStablesDialog.clickMaxAmountOutAction()
    await convertStablesDialog.expectAssetInInputValue('10000')
    await convertStablesDialog.expectAssetOutInputValue('10000')
  })
})
