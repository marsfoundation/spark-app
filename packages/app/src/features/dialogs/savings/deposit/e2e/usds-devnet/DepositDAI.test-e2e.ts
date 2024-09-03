import { USDS_DEV_CHAIN_ID } from '@/config/chain/constants'
import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Deposit DAI on on USDS DevNet', () => {
  const fork = setupFork({ chainId: USDS_DEV_CHAIN_ID })
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject

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

    savingsPage = new SavingsPageObject(page, { usdsSupport: true })
    await savingsPage.clickDepositButtonAction('DAI')

    depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
  })

  test.describe('To sUSDS', () => {
    test('uses PSM actions native deposit', async () => {
      await depositDialog.actionsContainer.expectActions([
        { type: 'approve', asset: 'DAI' },
        { type: 'depositToSavings', asset: 'DAI', savingsAsset: 'sUSDS' },
      ])
    })

    test('displays transaction overview', async () => {
      await depositDialog.expectNativeRouteTransactionOverview({
        apy: {
          value: '5.00%',
          description: '~500.00 USDS per year',
        },
        routeItems: [
          {
            tokenAmount: '10,000.00 DAI',
            tokenUsdValue: '$10,000.00',
          },
          {
            tokenAmount: '10,000.00 USDS',
            tokenUsdValue: '$10,000.00',
          },
          {
            tokenAmount: '9,997.59 sUSDS',
            tokenUsdValue: '$10,000.00',
          },
        ],
        outcome: '9,997.59 sUSDS worth $10,000.00',
        badgeToken: 'DAI',
      })
    })

    test('executes deposit', async () => {
      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)

      await depositDialog.expectSuccessPage()
      await depositDialog.clickBackToSavingsButton()

      await savingsPage.expectSavingsUSDSBalance({ sUsdsBalance: '9,997.59 sUSDS', estimatedUsdsValue: '10,000' })
      await savingsPage.expectCashInWalletAssetBalance('DAI', '-')
    })
  })

  test.describe('To sDAI', () => {
    test.beforeEach(async () => {
      await depositDialog.clickUpgradeSwitch()
    })

    test('uses PSM actions native deposit', async () => {
      await depositDialog.actionsContainer.expectActions([
        { type: 'approve', asset: 'DAI' },
        { type: 'depositToSavings', asset: 'DAI', savingsAsset: 'sDAI' },
      ])
    })

    test('displays transaction overview', async () => {
      await depositDialog.expectNativeRouteTransactionOverview({
        apy: {
          value: '6.00%',
          description: '~600.00 DAI per year',
        },
        routeItems: [
          {
            tokenAmount: '10,000.00 DAI',
            tokenUsdValue: '$10,000.00',
          },
          {
            tokenAmount: '9,046.82 sDAI',
            tokenUsdValue: '$10,000.00',
          },
        ],
        outcome: '9,046.82 sDAI worth $10,000.00',
        badgeToken: 'DAI',
      })
    })

    test('executes deposit', async () => {
      const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)

      await depositDialog.expectSuccessPage()
      await depositDialog.clickBackToSavingsButton()

      await savingsPage.expectSavingsDAIBalance({ sDaiBalance: '9,046.82 sDAI', estimatedDaiValue: '10,000' })
      await savingsPage.expectCashInWalletAssetBalance('DAI', '-')
    })
  })
})
