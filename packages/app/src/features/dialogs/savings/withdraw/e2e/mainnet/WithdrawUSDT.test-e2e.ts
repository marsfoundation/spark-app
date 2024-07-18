import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { LIFI_TEST_USER_PRIVATE_KEY, overrideLiFiRouteWithHAR } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'
import { withdrawValidationIssueToMessage } from '../../logic/validation'

test.describe('Withdraw USDT on Mainnet', () => {
  const fork = setupFork({
    blockNumber: 20138171n,
    chainId: mainnet.id,
    simulationDateOverride: new Date('2024-09-21T10:21:19Z'),
  })
  let savingsPage: SavingsPageObject
  let withdrawalDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-pkey',
        assetBalances: {
          ETH: 1,
          sDAI: 10_000,
        },
        privateKey: LIFI_TEST_USER_PRIVATE_KEY,
      },
    })
    await overrideLiFiRouteWithHAR({
      page,
      key: '1_000-usdt-from-sdai',
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickWithdrawButtonAction()

    withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
    await withdrawalDialog.selectAssetAction('USDT')
    await withdrawalDialog.fillAmountAction(1000)
  })

  test('uses Lifi Swap', async () => {
    await withdrawalDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sDAI' },
      {
        type: 'exchange',
        inputAsset: 'sDAI',
        outputAsset: 'USDT',
        fee: '$2.01',
        slippage: '0.1%',
        finalToTokenAmount: '1,001.50 USDT',
      },
    ])
  })

  test('displays transaction overview', async () => {
    await withdrawalDialog.expectTransactionOverview([
      ['APY', '8.00%'],
      ['Exchange Rate', '1.00 DAI 0.97777 USDT'],
      ['sDAI Balance', '10,000.00 sDAI 9,079.06 sDAI'],
    ])
  })

  test('executes swap', async () => {
    const actionsContainer = new ActionsPageObject(withdrawalDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2)

    await withdrawalDialog.expectSuccessPage()
    await withdrawalDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsBalance({ sDaiBalance: '9,079.06 sDAI', estimatedDaiValue: '10,097.80' })
    await savingsPage.expectCashInWalletAssetBalance('USDT', '1,021.11')
  })
})

test.describe('Risk warning', () => {
  const blockNumber = 20090065n
  const fork = setupFork({
    blockNumber,
    chainId: mainnet.id,
    simulationDateOverride: new Date('2024-09-04T10:21:19Z'),
  })

  test('displays warning when discrepancy is bigger than 100 DAI', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-pkey',
        assetBalances: {
          ETH: 1,
          sDAI: 100000,
        },
        privateKey: LIFI_TEST_USER_PRIVATE_KEY,
      },
    })

    await overrideLiFiRouteWithHAR({
      page,
      key: '9198.753133685380130125-sdai-to-10000-usdt',
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.clickWithdrawButtonAction()

    const withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
    await withdrawalDialog.selectAssetAction('USDT')
    await withdrawalDialog.fillAmountAction(10000)

    await withdrawalDialog.expectDiscrepancyWarning('198.82 DAI')
  })

  test('actions stay disabled until risk is acknowledged', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-pkey',
        assetBalances: {
          ETH: 1,
          sDAI: 100000,
        },
        privateKey: LIFI_TEST_USER_PRIVATE_KEY,
      },
    })

    await overrideLiFiRouteWithHAR({
      page,
      key: '9198.753133685380130125-sdai-to-10000-usdt',
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.clickWithdrawButtonAction()

    const withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
    await withdrawalDialog.selectAssetAction('USDT')
    await withdrawalDialog.fillAmountAction(10000)
    await withdrawalDialog.expectTransactionOverviewToBeVisible() // wait for lifi to load

    const actionsContainer = new ActionsPageObject(withdrawalDialog.locatePanelByHeader('Actions'))
    await actionsContainer.expectDisabledActionAtIndex(0)

    await withdrawalDialog.clickAcknowledgeRisk()
    await actionsContainer.expectEnabledActionAtIndex(0)
  })
})

test.describe('Validation', () => {
  const fork = setupFork({
    blockNumber: 20161149n,
    chainId: mainnet.id,
    simulationDateOverride: new Date('2024-06-24T13:17:00Z'),
  })
  let savingsPage: SavingsPageObject
  let withdrawalDialog: SavingsDialogPageObject

  test.describe('Input value exceeds sDAI value', () => {
    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected-pkey',
          assetBalances: {
            ETH: 1,
            sDAI: 100,
          },
          privateKey: LIFI_TEST_USER_PRIVATE_KEY,
        },
      })
      await overrideLiFiRouteWithHAR({
        page,
        key: '200-usdt-from-sdai',
      })

      savingsPage = new SavingsPageObject(page)
      await savingsPage.clickWithdrawButtonAction()

      withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
      await withdrawalDialog.selectAssetAction('USDT')
      await withdrawalDialog.fillAmountAction(200)
    })

    test('displays validation error', async () => {
      await withdrawalDialog.expectAssetInputError(withdrawValidationIssueToMessage['exceeds-balance'])
    })

    test('actions are disabled', async () => {
      await withdrawalDialog.actionsContainer.expectDisabledActions([
        { type: 'approve', asset: 'sDAI' },
        { type: 'exchange', inputAsset: 'sDAI', outputAsset: 'USDT' },
      ])
    })

    test('displays sensible tx overview', async () => {
      await withdrawalDialog.expectTransactionOverview([
        ['APY', '8.00%'],
        ['Exchange Rate', '1.00 DAI 0.98686 USDT'],
        ['sDAI Balance', '100.00 sDAI -85.92 sDAI'],
      ])
    })
  })

  test('displays validation error for dirty input with 0 value', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-pkey',
        assetBalances: {
          ETH: 1,
          sDAI: 100,
        },
        privateKey: LIFI_TEST_USER_PRIVATE_KEY,
      },
    })
    await overrideLiFiRouteWithHAR({
      page,
      key: '200-usdt-from-sdai',
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickWithdrawButtonAction()
    withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
    await withdrawalDialog.selectAssetAction('USDT')

    await withdrawalDialog.fillAmountAction(10)
    await withdrawalDialog.fillAmountAction(0)

    await withdrawalDialog.expectAssetInputError(withdrawValidationIssueToMessage['value-not-positive'])
  })
})
