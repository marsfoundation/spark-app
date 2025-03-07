import { FarmDetailsPageObject } from '@/features/farm-details/FarmDetails.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { overrideInfoSkyRouteWithHAR } from '@/test/e2e/info-sky'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { StakeDialogPageObject } from '../../StakeDialog.PageObject'

test.describe('Stake sDAI to SKY farm', () => {
  let farmDetailsPage: FarmDetailsPageObject
  let stakeDialog: StakeDialogPageObject

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chain: mainnet,
        blockNumber: DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'farmDetails',
      initialPageParams: {
        chainId: mainnet.id.toString(),
        address: '0x0650CAF159C5A49f711e8169D4336ECB9b950275',
      },
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sDAI: 1_000,
        },
      },
    })
    await overrideInfoSkyRouteWithHAR({ page, key: '1-sky-farm-with-8_51-apy' })

    farmDetailsPage = new FarmDetailsPageObject(testContext)
    await farmDetailsPage.clickInfoPanelStakeButtonAction()
    stakeDialog = new StakeDialogPageObject(testContext)
    await stakeDialog.selectAssetAction('sDAI')
    await stakeDialog.fillAmountAction(1_000)
  })

  test('has correct action plan', async () => {
    await stakeDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await stakeDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sDAI' },
      { type: 'withdrawFromSavings', savingsAsset: 'sDAI', asset: 'USDS', mode: 'withdraw' },
      { type: 'approve', asset: 'USDS' },
      { type: 'stake', stakingToken: 'USDS', rewardToken: 'SKY' },
    ])
  })

  test('displays transaction overview', async () => {
    await stakeDialog.expectTransactionOverview({
      estimatedRewards: {
        apy: '10.88%',
        description: 'Earn ~2,031.10 SKY/year',
      },
      route: {
        swaps: [
          {
            tokenAmount: '1,000.00 sDAI',
            tokenUsdValue: '$1,125.60',
          },
          {
            tokenAmount: '1,125.60 USDS',
            tokenUsdValue: '$1,125.60',
          },
        ],
        final: {
          upperText: 'SKY Farm',
          lowerText: 'Deposited',
        },
      },
      outcome: '1,125.60 USDS',
    })
  })

  test('executes transaction', async () => {
    await stakeDialog.actionsContainer.acceptAllActionsAction(4)

    await stakeDialog.expectSuccessPage()
    await stakeDialog.clickBackToFarmAction()

    await farmDetailsPage.expectTokenToDepositBalance('sDAI', '-')
    await farmDetailsPage.expectTokenToDepositBalance('USDS', '-') // no dust left
    await farmDetailsPage.expectReward({
      reward: '0.00000',
      rewardUsd: '$0.00',
    })
    await farmDetailsPage.expectStaked({ amount: '1,125.60', asset: 'USDS' })
  })
})
