import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { BASE_DEFAULT_BLOCK_NUMBER, DEFAULT_BLOCK_NUMBER, GNOSIS_DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { base, gnosis, mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../../common/e2e/SavingsDialog.PageObject'

test.describe('Savings deposit dialog', () => {
  test.describe('Mainnet', () => {
    let depositDialog: SavingsDialogPageObject
    let savingsPage: SavingsPageObject

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
            DAI: 10_000,
            USDC: 20_000,
          },
        },
      })

      savingsPage = new SavingsPageObject(testContext)
      await savingsPage.clickCTADepositButtonAction()

      depositDialog = new SavingsDialogPageObject({ testContext, type: 'deposit' })
    })

    test('can switch between tokens', async () => {
      await depositDialog.fillAmountAction(1000)
      await depositDialog.actionsContainer.expectEnabledActionAtIndex(0)
      await depositDialog.actionsContainer.expectActions([
        { type: 'approve', asset: 'USDC' },
        { type: 'depositToSavings', asset: 'USDC', savingsAsset: 'sUSDS' },
      ])

      await depositDialog.selectAssetAction('DAI')
      await depositDialog.fillAmountAction(1000)
      await depositDialog.actionsContainer.expectEnabledActionAtIndex(0)
      await depositDialog.actionsContainer.expectActions([
        { type: 'approve', asset: 'DAI' },
        { type: 'depositToSavings', asset: 'DAI', savingsAsset: 'sUSDS' },
      ])

      await depositDialog.selectAssetAction('USDC')
      await depositDialog.fillAmountAction(1000)
      await depositDialog.actionsContainer.expectEnabledActionAtIndex(0)
      await depositDialog.actionsContainer.expectActions([
        { type: 'approve', asset: 'USDC' },
        { type: 'depositToSavings', asset: 'USDC', savingsAsset: 'sUSDS' },
      ])
    })

    test('can select only supported assets', async () => {
      await depositDialog.openAssetSelectorAction()
      await depositDialog.expectAssetSelectorOptions(['USDS', 'USDC', 'DAI'])
    })

    test('can click max after switching tokens', async () => {
      await depositDialog.expectInputValue('')
      await depositDialog.clickMaxAmountAction()
      await depositDialog.expectInputValue('20000')
      await depositDialog.selectAssetAction('DAI')
      await depositDialog.expectInputValue('')
      await depositDialog.clickMaxAmountAction()
      await depositDialog.expectInputValue('10000')
    })
  })

  test.describe('Gnosis', () => {
    let savingsPage: SavingsPageObject
    let depositDialog: SavingsDialogPageObject

    test.beforeEach(async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          chain: gnosis,
          blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER,
        },
        initialPage: 'savings',
        account: {
          type: 'connected-random',
          assetBalances: {
            XDAI: 100,
          },
        },
      })

      savingsPage = new SavingsPageObject(testContext)
      await savingsPage.clickCTADepositButtonAction()

      depositDialog = new SavingsDialogPageObject({ testContext, type: 'deposit' })
    })

    test('can select only supported assets', async () => {
      await depositDialog.openAssetSelectorAction()
      await depositDialog.expectAssetSelectorOptions(['XDAI'])
    })
  })

  test.describe('Base', () => {
    let depositDialog: SavingsDialogPageObject
    let savingsPage: SavingsPageObject

    test.beforeEach(async ({ page }) => {
      const testContext = await setup(page, {
        blockchain: {
          chain: base,
          blockNumber: BASE_DEFAULT_BLOCK_NUMBER,
        },
        initialPage: 'savings',
        account: {
          type: 'connected-random',
          assetBalances: {
            USDC: 1000,
            USDS: 10_000,
          },
        },
      })

      savingsPage = new SavingsPageObject(testContext)
      await savingsPage.clickCTADepositButtonAction()

      depositDialog = new SavingsDialogPageObject({ testContext, type: 'deposit' })
    })

    test('can switch between tokens', async () => {
      await depositDialog.fillAmountAction(1000)
      await depositDialog.actionsContainer.expectEnabledActionAtIndex(0)
      await depositDialog.actionsContainer.expectActions([
        { type: 'approve', asset: 'USDS' },
        { type: 'depositToSavings', asset: 'USDS', savingsAsset: 'sUSDS' },
      ])

      await depositDialog.selectAssetAction('USDC')
      await depositDialog.fillAmountAction(1000)
      await depositDialog.actionsContainer.expectEnabledActionAtIndex(0)
      await depositDialog.actionsContainer.expectActions([
        { type: 'approve', asset: 'USDC' },
        { type: 'depositToSavings', asset: 'USDC', savingsAsset: 'sUSDS' },
      ])

      await depositDialog.selectAssetAction('USDS')
      await depositDialog.fillAmountAction(1000)
      await depositDialog.actionsContainer.expectEnabledActionAtIndex(0)
      await depositDialog.actionsContainer.expectActions([
        { type: 'approve', asset: 'USDS' },
        { type: 'depositToSavings', asset: 'USDS', savingsAsset: 'sUSDS' },
      ])
    })

    test('can select only supported assets', async () => {
      await depositDialog.openAssetSelectorAction()
      await depositDialog.expectAssetSelectorOptions(['USDS', 'USDC'])
    })
  })
})
