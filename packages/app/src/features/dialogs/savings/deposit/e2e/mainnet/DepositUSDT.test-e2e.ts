import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { LIFI_TEST_USER_PRIVATE_KEY, overrideLiFiRouteWithHAR } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'
import { depositValidationIssueToMessage } from '../../logic/validation'

test.describe('Deposit USDT on Mainnet', () => {
  const fork = setupFork({ blockNumber: 19990683n, chainId: mainnet.id })
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected',
        assetBalances: {
          ETH: 1,
          USDT: 10_000,
        },
        privateKey: LIFI_TEST_USER_PRIVATE_KEY,
      },
    })
    await overrideLiFiRouteWithHAR({
      page,
      key: '10_000-usdt-to-sdai',
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickDepositButtonAction('USDT')

    depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
  })

  test('uses Lifi Swap', async () => {
    await depositDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'USDT' },
      {
        type: 'exchange',
        inputAsset: 'USDT',
        outputAsset: 'sDAI',
        fee: '$19.99',
        slippage: '0.1%',
        finalDAIAmount: '$9,978.30 DAI',
        finalToTokenAmount: '9,180.20 sDAI',
      },
    ])
  })

  test('displays transaction overview', async () => {
    await depositDialog.expectTransactionOverview([
      ['APY', '8.00%'],
      ['Exchange Rate', '1.00 USDT 0.99783 DAI'],
      ['sDAI Balance', '0.00 sDAI 9,180.20 sDAI'],
    ])
  })

  test('executes swap', async () => {
    const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2)

    await depositDialog.expectSuccessPage()
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsBalance({ sDaiBalance: '9,177.31 sDAI', estimatedDaiValue: '9,975' })
    await savingsPage.expectCashInWalletAssetBalance('USDT', '-')
  })
})

test.describe('Set Slippage', () => {
  const fork = setupFork({ blockNumber: 20089938n, chainId: mainnet.id })
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected',
        assetBalances: {
          ETH: 1,
          USDT: 100,
        },
        privateKey: LIFI_TEST_USER_PRIVATE_KEY,
      },
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickDepositButtonAction('USDT')

    depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
  })

  test('default', async ({ page }) => {
    const expectedDefaultSlippage = 0.001
    await overrideLiFiRouteWithHAR({
      page,
      key: '100-usdt-to-sdai-slippage-0.001',
    })

    await depositDialog.actionsContainer.setSlippageAction(expectedDefaultSlippage, 'button')
    await depositDialog.fillAmountAction(100)
    await depositDialog.actionsContainer.expectSlippage(expectedDefaultSlippage)
  })

  test('changes using button', async ({ page }) => {
    const newSlippage = 0.005
    await overrideLiFiRouteWithHAR({
      page,
      key: '100-usdt-to-sdai-slippage-0.005',
    })

    await depositDialog.actionsContainer.setSlippageAction(newSlippage, 'button')
    await depositDialog.fillAmountAction(100)

    await depositDialog.actionsContainer.expectSlippage(newSlippage)
  })

  test('changes using custom input', async ({ page }) => {
    const newSlippage = 0.007
    await overrideLiFiRouteWithHAR({
      page,
      key: '100-usdt-to-sdai-slippage-0.007',
    })

    await depositDialog.actionsContainer.setSlippageAction(newSlippage, 'input')
    await depositDialog.fillAmountAction(100)

    await depositDialog.actionsContainer.expectSlippage(newSlippage)
  })
})

test.describe('Risk warning', () => {
  const fork = setupFork({ blockNumber: 19861465n, chainId: mainnet.id })
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected',
        assetBalances: {
          ETH: 1,
          USDT: 10_000,
        },
        privateKey: LIFI_TEST_USER_PRIVATE_KEY,
      },
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickDepositButtonAction('USDT')

    depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
  })

  test('displays warning when discrepancy is bigger than 100 DAI', async ({ page }) => {
    await overrideLiFiRouteWithHAR({
      page,
      key: '10000-usdt-to-8320.604955114542838902-sdai',
    })

    await depositDialog.fillAmountAction(10000)
    await depositDialog.expectDiscrepancyWarning('948.48 DAI')
  })

  test('actions stay disabled until risk is acknowledged', async ({ page }) => {
    await overrideLiFiRouteWithHAR({
      page,
      key: '10000-usdt-to-8320.604955114542838902-sdai',
    })

    await depositDialog.fillAmountAction(10000)
    await depositDialog.expectTransactionOverviewToBeVisible() // wait for lifi to load

    await depositDialog.actionsContainer.expectDisabledActionAtIndex(0)

    await depositDialog.clickAcknowledgeRisk()
    await depositDialog.actionsContainer.expectEnabledActionAtIndex(0)
  })
})

test.describe('Validation', () => {
  const fork = setupFork({
    blockNumber: 20160798n,
    chainId: mainnet.id,
    simulationDateOverride: new Date('2024-06-24T12:05:00Z'),
  })
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected',
        assetBalances: {
          ETH: 1,
          USDT: 100,
        },
        privateKey: LIFI_TEST_USER_PRIVATE_KEY,
      },
    })
    await overrideLiFiRouteWithHAR({
      page,
      key: '200-usdt-to-sdai',
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickDepositButtonAction('USDT')

    depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
  })

  test('displays validation error', async () => {
    await depositDialog.fillAmountAction(200)
    await depositDialog.expectAssetInputError(depositValidationIssueToMessage['exceeds-balance'])
    await depositDialog.fillAmountAction(0)
    await depositDialog.expectAssetInputError(depositValidationIssueToMessage['value-not-positive'])
  })

  test('actions are disabled', async () => {
    await depositDialog.fillAmountAction(200)
    await depositDialog.actionsContainer.expectDisabledActions([
      { type: 'approve', asset: 'USDT' },
      { type: 'exchange', inputAsset: 'USDT', outputAsset: 'sDAI' },
    ])
  })

  test('displays sensible tx overview', async () => {
    await depositDialog.fillAmountAction(200)
    await depositDialog.expectTransactionOverview([
      ['APY', '8.00%'],
      ['Exchange Rate', '1.00 USDT 1.00398 DAI'],
      ['sDAI Balance', '0.00 sDAI 183.96 sDAI'],
    ])
  })
})

test.describe('Slippage Validation', () => {
  const fork = setupFork({ blockNumber: 20089938n, chainId: mainnet.id })
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected',
        assetBalances: {
          ETH: 1,
          USDT: 100,
        },
        privateKey: LIFI_TEST_USER_PRIVATE_KEY,
      },
    })
    await overrideLiFiRouteWithHAR({
      page,
      key: '100-usdt-to-sdai-slippage-0.001',
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickDepositButtonAction('USDT')

    depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
  })

  test('reverts to default if value is bigger than max', async () => {
    const newSlippage = 0.5
    const expectedDefaultSlippage = 0.001

    await depositDialog.actionsContainer.openSettingsDialogAction()
    await depositDialog.actionsContainer.fillSlippageAction(newSlippage)
    await depositDialog.actionsContainer.expectSlippageValidationError(
      'Value has to be greater than 0 and less than 50',
    )
    await depositDialog.actionsContainer.closeSettingsDialogAction()

    await depositDialog.fillAmountAction(100)

    await depositDialog.actionsContainer.expectSlippage(expectedDefaultSlippage)
  })

  test('reverts to default if value is 0', async () => {
    const newSlippage = 0
    const expectedDefaultSlippage = 0.001

    await depositDialog.actionsContainer.openSettingsDialogAction()
    await depositDialog.actionsContainer.fillSlippageAction(newSlippage)
    await depositDialog.actionsContainer.expectSlippageValidationError(
      'Value has to be greater than 0 and less than 50',
    )
    await depositDialog.actionsContainer.closeSettingsDialogAction()

    await depositDialog.fillAmountAction(100)

    await depositDialog.actionsContainer.expectSlippage(expectedDefaultSlippage)
  })

  test('reverts to default if value is empty', async () => {
    const expectedDefaultSlippage = 0.001

    await depositDialog.actionsContainer.openSettingsDialogAction()
    // input something to trigger switch from button
    await depositDialog.actionsContainer.fillSlippageAction(0.001)
    await depositDialog.actionsContainer.fillSlippageAction('')
    await depositDialog.actionsContainer.expectSlippageValidationError(
      'Value has to be greater than 0 and less than 50',
    )
    await depositDialog.actionsContainer.closeSettingsDialogAction()

    await depositDialog.fillAmountAction(100)

    await depositDialog.actionsContainer.expectSlippage(expectedDefaultSlippage)
  })
})
