import { FarmDetailsPageObject } from '@/features/farm-details/FarmDetails.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { overrideInfoSkyRouteWithHAR } from '@/test/e2e/info-sky'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { privateKeyToAddress } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { StakeDialogPageObject } from '../../StakeDialog.PageObject'

test.describe('Stake USDS to SKY farm', () => {
  let farmDetailsPage: FarmDetailsPageObject
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
          USDS: 10_000,
        },
      },
    })
    await overrideInfoSkyRouteWithHAR({ page, key: '1-sky-farm-with-8_51-apy' })

    farmDetailsPage = new FarmDetailsPageObject(testContext)
    await farmDetailsPage.clickInfoPanelStakeButtonAction()
    stakeDialog = new StakeDialogPageObject(testContext)
    await stakeDialog.fillAmountAction(10_000)
  })

  test('has correct action plan', async () => {
    await stakeDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'USDS' },
      { type: 'stake', stakingToken: 'USDS', rewardToken: 'SKY' },
    ])
  })

  test('displays transaction overview', async () => {
    await stakeDialog.expectTransactionOverview({
      estimatedRewards: {
        apy: '10.88%',
        description: 'Earn ~18,044.13 SKY/year',
      },
      route: {
        swaps: [
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
    await stakeDialog.actionsContainer.acceptAllActionsAction(2)

    await stakeDialog.expectSuccessPage()
    await stakeDialog.clickBackToFarmAction()

    await farmDetailsPage.expectTokenToDepositBalance('USDS', '-')
    await farmDetailsPage.expectReward({
      reward: '0.00000',
      rewardUsd: '$0.00',
    })
    await farmDetailsPage.expectStaked({ amount: '10,000.00', asset: 'USDS' })
  })
})

test.describe('Stake USDS to CLE farm', () => {
  const testUserPKey = '0xa9f2d3eda4403df2fe54b97291d65d69824e0e2b3134c33b7145cf9b912966d5'
  const testUserAddress = privateKeyToAddress('0xa9f2d3eda4403df2fe54b97291d65d69824e0e2b3134c33b7145cf9b912966d5')
  const harSuffix = testUserAddress.slice(0, 10)

  let farmDetailsPage: FarmDetailsPageObject
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
    stakeDialog = new StakeDialogPageObject(testContext)
    await stakeDialog.fillAmountAction(10_000)
  })

  test('has correct action plan', async () => {
    await stakeDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'USDS' },
      { type: 'stake', stakingToken: 'USDS', rewardToken: 'CLE' },
    ])
  })

  test('displays transaction overview', async () => {
    await stakeDialog.expectTransactionOverview({
      route: {
        swaps: [
          {
            tokenAmount: '10,000.00 USDS',
            tokenUsdValue: '$10,000.00',
          },
        ],
        final: {
          upperText: 'CLE Farm',
          lowerText: 'Deposited',
        },
      },
      outcome: '10,000.00 USDS',
    })
  })

  test('executes transaction', async ({ page }) => {
    await stakeDialog.actionsContainer.acceptAllActionsAction(2)

    await stakeDialog.expectSuccessPage()
    await stakeDialog.clickBackToFarmAction()

    await farmDetailsPage.expectTokenToDepositBalance('USDS', '-')
    await farmDetailsPage.expectReward({
      reward: '0.0',
    })
    await farmDetailsPage.expectPointsSyncWarning()
    await farmDetailsPage.expectStaked({ amount: '10,000.00', asset: 'USDS' })

    await overrideInfoSkyRouteWithHAR({ page, key: `3-cle-farm-10000-balance-${harSuffix}` })

    await farmDetailsPage.expectReward({
      reward: '257.460',
    })
    await farmDetailsPage.expectPointsSyncWarningToBeHidden()
    await farmDetailsPage.expectInfoPanelClaimButtonToBeHidden()
  })
})
