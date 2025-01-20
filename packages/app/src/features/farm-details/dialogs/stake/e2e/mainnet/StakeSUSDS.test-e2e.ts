import { SavingsDialogPageObject } from '@/features/dialogs/savings/common/e2e/SavingsDialog.PageObject'
import { FarmDetailsPageObject } from '@/features/farm-details/FarmDetails.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { overrideInfoSkyRouteWithHAR } from '@/test/e2e/info-sky'
import { buildUrl, setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { StakeDialogPageObject } from '../../StakeDialog.PageObject'

test.describe('Stake sUSDS to SKY farm', () => {
  let farmDetailsPage: FarmDetailsPageObject
  let stakeDialog: StakeDialogPageObject

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        blockNumber: DEFAULT_BLOCK_NUMBER,
        chainId: mainnet.id,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          USDS: 1_100,
        },
      },
    })
    await overrideInfoSkyRouteWithHAR({ page, key: '1-sky-farm-with-8_51-apy' })

    // deposit some tokens to sUSDS first so we're able to withdraw them next
    const savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickDepositButtonAction('USDS')
    const depositToSavingsDialog = new SavingsDialogPageObject({ testContext, type: 'deposit' })
    await depositToSavingsDialog.clickMaxAmountAction()
    await depositToSavingsDialog.actionsContainer.acceptAllActionsAction(2)
    await depositToSavingsDialog.clickBackToSavingsButton()
    await page.goto(
      buildUrl('farmDetails', {
        chainId: mainnet.id.toString(),
        address: '0x0650CAF159C5A49f711e8169D4336ECB9b950275',
      }),
    )

    farmDetailsPage = new FarmDetailsPageObject(testContext)
    await farmDetailsPage.clickInfoPanelStakeButtonAction()
    stakeDialog = new StakeDialogPageObject(testContext)
    await stakeDialog.selectAssetAction('sUSDS')
    await stakeDialog.fillAmountAction(1_000)
  })

  test('has correct action plan', async () => {
    await stakeDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await stakeDialog.actionsContainer.expectActions([
      { type: 'withdrawFromSavings', savingsAsset: 'sUSDS', asset: 'USDS', mode: 'withdraw' },
      { type: 'approve', asset: 'USDS' },
      { type: 'stake', stakingToken: 'USDS', rewardToken: 'SKY' },
    ])
  })

  test('displays transaction overview', async () => {
    await stakeDialog.expectTransactionOverview({
      estimatedRewards: {
        apy: '10.88%',
        description: 'Earn ~1,835.60 SKY/year',
      },
      route: {
        swaps: [
          {
            tokenAmount: '1,000.00 sUSDS',
            tokenUsdValue: '$1,017.26',
          },
          {
            tokenAmount: '1,017.26 USDS',
            tokenUsdValue: '$1,017.26',
          },
        ],
        final: {
          upperText: 'SKY Farm',
          lowerText: 'Deposited',
        },
      },
      outcome: '1,017.26 USDS',
    })
  })

  test('executes transaction', async () => {
    await stakeDialog.actionsContainer.acceptAllActionsAction(3)

    await stakeDialog.expectSuccessPage()
    await stakeDialog.clickBackToFarmAction()

    await farmDetailsPage.expectTokenToDepositBalance('USDS', '-') // no dust left
    await farmDetailsPage.expectReward({
      reward: '0.00000',
      rewardUsd: '$0.00',
    })
    await farmDetailsPage.expectStaked({ amount: '1,017.26', asset: 'USDS' })
  })
})

test.describe('Stake sUSDS to SKY farm with actions batched', () => {
  test('executes action', async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        blockNumber: DEFAULT_BLOCK_NUMBER,
        chainId: mainnet.id,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          USDS: 1_100,
        },
        atomicBatchSupported: true,
      },
    })

    await overrideInfoSkyRouteWithHAR({ page, key: '1-sky-farm-with-8_51-apy' })

    // deposit some tokens to sUSDS first so we're able to withdraw them next
    const savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickDepositButtonAction('USDS')
    const depositToSavingsDialog = new SavingsDialogPageObject({ testContext, type: 'deposit' })
    await depositToSavingsDialog.clickMaxAmountAction()

    await depositToSavingsDialog.actionsContainer.acceptBatchedActions()
    await depositToSavingsDialog.clickBackToSavingsButton()
    await page.goto(
      buildUrl('farmDetails', {
        chainId: mainnet.id.toString(),
        address: '0x0650CAF159C5A49f711e8169D4336ECB9b950275',
      }),
    )

    const farmDetailsPage = new FarmDetailsPageObject(testContext)
    await farmDetailsPage.clickInfoPanelStakeButtonAction()
    const stakeDialog = new StakeDialogPageObject(testContext)
    await stakeDialog.selectAssetAction('sUSDS')
    await stakeDialog.fillAmountAction(1_000)

    await stakeDialog.actionsContainer.acceptBatchedActions()
    await stakeDialog.clickBackToFarmAction()

    await farmDetailsPage.expectReward({
      reward: '0.00000',
      rewardUsd: '$0.00',
    })
    await farmDetailsPage.expectStaked({ amount: '1,017.26', asset: 'USDS' })
  })
})
