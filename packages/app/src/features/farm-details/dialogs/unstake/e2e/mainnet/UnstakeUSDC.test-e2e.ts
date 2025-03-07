import { FarmDetailsPageObject } from '@/features/farm-details/FarmDetails.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { overrideInfoSkyRouteWithHAR } from '@/test/e2e/info-sky'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { StakeDialogPageObject } from '../../../stake/StakeDialog.PageObject'
import { UnstakeDialogPageObject } from '../../UnstakeDialog.PageObject'

test.describe('Unstake USDC from SKY farm', () => {
  let farmDetailsPage: FarmDetailsPageObject
  let unstakeDialog: UnstakeDialogPageObject
  let stakeDialog: StakeDialogPageObject

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        blockNumber: DEFAULT_BLOCK_NUMBER,
        chain: mainnet,
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
          USDC: 10_000,
          USDS: 10_000,
        },
      },
    })
    await overrideInfoSkyRouteWithHAR({ page, key: '1-sky-farm-with-8_51-apy' })

    farmDetailsPage = new FarmDetailsPageObject(testContext)
    await farmDetailsPage.clickInfoPanelStakeButtonAction()
    stakeDialog = new StakeDialogPageObject(testContext)

    await stakeDialog.selectAssetAction('USDS')
    await stakeDialog.fillAmountAction(10_000)
    await stakeDialog.actionsContainer.acceptAllActionsAction(2)

    await stakeDialog.clickBackToFarmAction()

    await testContext.testnetController.progressSimulationAndMine(24 * 60 * 60) // 24 hours
    await page.reload()

    await farmDetailsPage.clickInfoPanelUnstakeButtonAction()
    unstakeDialog = new UnstakeDialogPageObject(testContext)

    await unstakeDialog.selectAssetAction('USDC')
    await unstakeDialog.fillAmountAction(5_000)
  })

  test('has correct action plan', async () => {
    await unstakeDialog.actionsContainer.expectActions([
      { type: 'unstake', stakingToken: 'USDS', rewardToken: 'SKY', exit: false },
      { type: 'approve', asset: 'USDS' },
      { type: 'psmConvert', inToken: 'USDS', outToken: 'USDC' },
    ])
  })

  test('displays transaction overview', async () => {
    await unstakeDialog.expectTransactionOverview({
      route: {
        swaps: [
          {
            tokenAmount: '5,000.00 USDS',
            tokenUsdValue: '$5,000.00',
          },
          {
            tokenAmount: '5,000.00 USDC',
            tokenUsdValue: '$5,000.00',
          },
        ],
        farm: {
          upperText: 'SKY Farm',
          lowerText: 'Deposited',
        },
      },
      outcome: '5,000.00 USDC',
    })
  })

  test('executes transaction', async () => {
    await unstakeDialog.actionsContainer.acceptAllActionsAction(3)

    await unstakeDialog.expectSuccessPage()
    await unstakeDialog.clickBackToFarmAction()

    await farmDetailsPage.expectTokenToDepositBalance('USDC', '15,000.00')
    await farmDetailsPage.expectTokenToDepositBalance('USDS', '-')
    await farmDetailsPage.expectReward({
      reward: '49.43940',
      rewardUsd: '2.98',
    })
    await farmDetailsPage.expectStaked({ amount: '5,000.00', asset: 'USDS' })
  })
})
