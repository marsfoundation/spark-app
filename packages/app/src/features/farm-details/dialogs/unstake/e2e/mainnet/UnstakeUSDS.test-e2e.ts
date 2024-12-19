import { FarmDetailsPageObject } from '@/features/farm-details/FarmDetails.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { overrideInfoSkyRouteWithHAR } from '@/test/e2e/info-sky'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { privateKeyToAddress } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { StakeDialogPageObject } from '../../../stake/StakeDialog.PageObject'
import { UnstakeDialogPageObject } from '../../UnstakeDialog.PageObject'

test.describe('Unstake USDS from SKY farm', () => {
  let farmDetailsPage: FarmDetailsPageObject
  let unstakeDialog: UnstakeDialogPageObject
  let stakeDialog: StakeDialogPageObject

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        blockNumber: DEFAULT_BLOCK_NUMBER,
        chainId: mainnet.id,
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
          DAI: 10_000,
          USDS: 10_000,
        },
      },
    })
    await overrideInfoSkyRouteWithHAR({ page, key: '1-sky-farm-with-8_51-apy' })

    farmDetailsPage = new FarmDetailsPageObject(testContext)
    await farmDetailsPage.clickInfoPanelStakeButtonAction()
    stakeDialog = new StakeDialogPageObject(testContext)

    await stakeDialog.selectAssetAction('DAI')
    await stakeDialog.fillAmountAction(10_000)
    await stakeDialog.actionsContainer.acceptAllActionsAction(4)

    await stakeDialog.clickBackToFarmAction()

    await testContext.testnetController.progressSimulationAndMine(24 * 60 * 60) // 24 hours
    await page.reload()

    await farmDetailsPage.clickInfoPanelUnstakeButtonAction()
    unstakeDialog = new UnstakeDialogPageObject(testContext)

    await unstakeDialog.selectAssetAction('USDS')
    await unstakeDialog.fillAmountAction(5_000)
  })

  test('has exit farm switch hidden', async () => {
    await unstakeDialog.expectExitFarmSwitchToBeHidden()
  })

  test('has correct action plan', async () => {
    await unstakeDialog.actionsContainer.expectActions([
      { type: 'unstake', stakingToken: 'USDS', rewardToken: 'SKY', exit: false },
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
        ],
        farm: {
          upperText: 'SKY Farm',
          lowerText: 'Deposited',
        },
      },
      outcome: '5,000.00 USDS',
    })
  })

  test('executes transaction', async () => {
    await unstakeDialog.actionsContainer.acceptAllActionsAction(1)

    await unstakeDialog.expectSuccessPage()
    await unstakeDialog.clickBackToFarmAction()

    await farmDetailsPage.expectTokenToDepositBalance('USDS', '15,000.00')
    await farmDetailsPage.expectTokenToDepositBalance('DAI', '-')
    await farmDetailsPage.expectReward({
      reward: '49.438',
      rewardUsd: '$2.98',
    })
    await farmDetailsPage.expectStaked({ amount: '5,000.00', asset: 'USDS' })
  })
})

test.describe('Unstake USDS from CLE farm', () => {
  const testUserPKey = '0xa9f2d3eda4403df2fe54b97291d65d69824e0e2b3134c33b7145cf9b912966d5'
  const testUserAddress = privateKeyToAddress('0xa9f2d3eda4403df2fe54b97291d65d69824e0e2b3134c33b7145cf9b912966d5')
  const harSuffix = testUserAddress.slice(0, 10)

  let farmDetailsPage: FarmDetailsPageObject
  let unstakeDialog: UnstakeDialogPageObject

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        blockNumber: DEFAULT_BLOCK_NUMBER,
        chainId: mainnet.id,
      },
      initialPage: 'farmDetails',
      initialPageParams: {
        chainId: mainnet.id.toString(),
        address: '0x10ab606B067C9C461d8893c47C7512472E19e2Ce',
      },
      account: {
        type: 'connected-pkey',
        privateKey: testUserPKey,
        assetBalances: {
          ETH: 1,
          USDS: 10_000,
        },
      },
    })
    await overrideInfoSkyRouteWithHAR({ page, key: `2-cle-farm-0-balance-${harSuffix}` })

    farmDetailsPage = new FarmDetailsPageObject(testContext)
    await farmDetailsPage.clickInfoPanelStakeButtonAction()
    const stakeDialog = new StakeDialogPageObject(testContext)
    await stakeDialog.fillAmountAction(10_000)
    await stakeDialog.actionsContainer.acceptAllActionsAction(2)
    await stakeDialog.clickBackToFarmAction()

    await overrideInfoSkyRouteWithHAR({ page, key: `3-cle-farm-10000-balance-${harSuffix}` })
    await farmDetailsPage.clickInfoPanelUnstakeButtonAction()
    unstakeDialog = new UnstakeDialogPageObject(testContext)

    await unstakeDialog.selectAssetAction('USDS')
    await unstakeDialog.fillAmountAction(5_000)
  })

  test('has correct action plan', async () => {
    await unstakeDialog.actionsContainer.expectActions([
      { type: 'unstake', stakingToken: 'USDS', rewardToken: 'CLE', exit: false },
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
        ],
        farm: {
          upperText: 'CLE Farm',
          lowerText: 'Deposited',
        },
      },
      outcome: '5,000.00 USDS',
    })
  })

  test('executes transaction', async ({ page }) => {
    await unstakeDialog.actionsContainer.acceptAllActionsAction(1)

    await unstakeDialog.expectSuccessPage()
    await unstakeDialog.clickBackToFarmAction()

    await farmDetailsPage.expectTokenToDepositBalance('USDS', '5,000.00')
    await farmDetailsPage.expectReward({
      reward: '257.6',
    })
    await farmDetailsPage.expectStaked({ amount: '5,000.00', asset: 'USDS' })
    await farmDetailsPage.expectPointsSyncWarning()

    await overrideInfoSkyRouteWithHAR({ page, key: `4-cle-farm-5000-balance-${harSuffix}` })

    await farmDetailsPage.expectReward({
      reward: '257.6',
    })
    await farmDetailsPage.expectPointsSyncWarningToBeHidden()
    await farmDetailsPage.expectInfoPanelClaimButtonToBeHidden()
    await farmDetailsPage.expectStaked({ amount: '5,000.00', asset: 'USDS' })
  })
})
