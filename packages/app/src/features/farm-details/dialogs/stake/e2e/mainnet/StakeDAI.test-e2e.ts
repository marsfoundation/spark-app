import { FarmDetailsPageObject } from '@/features/farm-details/FarmDetails.PageObject'
import { USDS_ACTIVATED_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { overrideInfoSkyRouteWithHAR } from '@/test/e2e/info-sky'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { StakeDialogPageObject } from '../../StakeDialog.PageObject'

test.describe('Stake DAI to SKY farm', () => {
  const fork = setupFork({ blockNumber: USDS_ACTIVATED_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
  let farmDetailsPage: FarmDetailsPageObject
  let stakeDialog: StakeDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'farmDetails',
      initialPageParams: {
        chainId: mainnet.id.toString(),
        address: '0x0650CAF159C5A49f711e8169D4336ECB9b950275',
      },
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          DAI: 10_000,
        },
      },
    })
    await overrideInfoSkyRouteWithHAR({ page, key: '1-sky-farm-with-8_51-apy' })

    farmDetailsPage = new FarmDetailsPageObject(page)
    await farmDetailsPage.clickInfoPanelStakeButtonAction()
    stakeDialog = new StakeDialogPageObject(page)
    await stakeDialog.selectAssetAction('DAI')
    await stakeDialog.fillAmountAction(10_000)
  })

  test('has correct action plan', async () => {
    await stakeDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'DAI' },
      { type: 'upgrade', fromToken: 'DAI', toToken: 'USDS' },
      { type: 'approve', asset: 'USDS' },
      { type: 'stake', stakingToken: 'USDS', rewardToken: 'SKY' },
    ])
  })

  test('displays transaction overview', async () => {
    await stakeDialog.expectTransactionOverview({
      estimatedRewards: {
        apy: '778.72%',
        description: 'Earn ~1,291,972.67 SKY/year',
      },
      route: {
        swaps: [
          {
            tokenAmount: '10,000.00 DAI',
            tokenUsdValue: '$10,000.00',
          },
          {
            tokenAmount: '10,000.00 USDS',
            tokenUsdValue: '$10,000.00',
          },
        ],
        final: {
          upperText: 'SKY Farm',
          lowerText: 'Deposited',
        },
      },
      outcome: '10,000.00 USD',
    })
  })

  test('executes transaction', async () => {
    await stakeDialog.actionsContainer.acceptAllActionsAction(4)

    await stakeDialog.expectSuccessPage()
    await stakeDialog.clickBackToFarmAction()

    await farmDetailsPage.expectTokenToDepositBalance('USDS', '-')
    await farmDetailsPage.expectReward({
      reward: '0.1',
      rewardUsd: '<$0.01',
    })
    await farmDetailsPage.expectStaked('10,000.00 USDS')
  })
})
