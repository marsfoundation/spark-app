import { MAINNET_USDS_SKY_FARM_ADDRESS } from '@/config/chain/constants'
import { FarmsInfo } from '@/domain/farms/farmsInfo'
import { Farm } from '@/domain/farms/types'
import { PotSavingsInfo } from '@/domain/savings-info/potSavingsInfo'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { bigNumberify } from '@/utils/bigNumber'
import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { useForm } from 'react-hook-form'
import { UnstakeView } from './UnstakeView'

const dai = tokens.DAI
const sdai = tokens.sDAI
const usds = tokens.USDS
const susds = tokens.sUSDS
const usdc = tokens.USDC
const mockTokensInfo = new TokensInfo(
  [
    { token: dai, balance: NormalizedUnitNumber(100) },
    { token: sdai, balance: NormalizedUnitNumber(100) },
    { token: usds, balance: NormalizedUnitNumber(100) },
    { token: susds, balance: NormalizedUnitNumber(100) },
    { token: usdc, balance: NormalizedUnitNumber(100) },
  ],
  {
    DAI: dai.symbol,
    sDAI: sdai.symbol,
    USDS: usds.symbol,
    sUSDS: susds.symbol,
  },
)

const timestamp = 1000
const mockSavingsDaiInfo = new PotSavingsInfo({
  potParams: {
    dsr: bigNumberify('1000001103127689513476993127'), // 10% / day
    rho: bigNumberify(timestamp),
    chi: bigNumberify('1000000000000000000000000000'), // 1
  },
  currentTimestamp: timestamp + 24 * 60 * 60,
})

const mockSavingsUsdsInfo = new PotSavingsInfo({
  potParams: {
    dsr: bigNumberify('1200001103127689513476993127'), // 12% / day
    rho: bigNumberify(timestamp),
    chi: bigNumberify('1000000000000000000000000000'), // 1
  },
  currentTimestamp: timestamp + 24 * 60 * 60,
})

const farm: Farm = {
  blockchainInfo: {
    address: MAINNET_USDS_SKY_FARM_ADDRESS,
    name: 'SKY Farm',
    rewardToken: tokens.SKY,
    stakingToken: tokens.USDS,
    entryAssetsGroup: {
      type: 'stablecoins',
      name: 'Stablecoins',
      assets: [tokens.DAI.symbol, tokens.USDC.symbol],
    },
    rewardRate: NormalizedUnitNumber(100),
    earnedTimestamp: timestamp,
    periodFinish: timestamp * 5,
    totalSupply: NormalizedUnitNumber(123456),
    earned: NormalizedUnitNumber(52),
    staked: NormalizedUnitNumber(100),
    rewardType: 'token',
  },
  apiInfo: {
    isPending: false,
    isError: false,
    error: null,
    data: {
      address: MAINNET_USDS_SKY_FARM_ADDRESS,
      apy: Percentage(0.05),
      totalRewarded: NormalizedUnitNumber(12345),
      depositors: 1111,
    },
  },
}

const mockedFarmsInfo = new FarmsInfo([farm])

const meta: Meta<typeof UnstakeView> = {
  title: 'Features/FarmDetails/Dialogs/Views/Unstake',
  component: (args) => {
    const form = useForm<AssetInputSchema>({
      defaultValues: {
        symbol: args.assetsFields.selectedAsset.token.symbol,
        value: args.assetsFields.selectedAsset.value,
        isMaxSelected: args.assetsFields.selectedAsset.value === args.assetsFields.maxValue?.toFixed(),
      },
    })
    return <UnstakeView {...args} form={form} />
  },
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  args: {
    farm,
    selectableAssets: [
      {
        token: tokens.USDS,
        balance: NormalizedUnitNumber(50_000),
      },
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(1),
      },
      {
        token: tokens.sDAI,
        balance: NormalizedUnitNumber(1),
      },
    ],
    assetsFields: {
      selectedAsset: {
        token: tokens.USDS,
        balance: NormalizedUnitNumber(50_000),
        value: '2000',
      },
      maxValue: NormalizedUnitNumber(50_000),
      maxSelectedFieldName: 'isMaxSelected',
      changeAsset: () => {},
    },
    objectives: [
      {
        type: 'unstake',
        token: tokens.USDS,
        amount: NormalizedUnitNumber(100),
        farm: farm.blockchainInfo.address,
        exit: false,
      },
    ],
    pageStatus: {
      state: 'form',
      actionsEnabled: true,
      goToSuccessScreen: () => {},
    },
    txOverview: {
      status: 'success',
      stakingToken: tokens.USDS,
      rewardToken: tokens.SKY,
      isExiting: false,
      earnedRewards: NormalizedUnitNumber(2311.34),
      routeToOutcomeToken: [
        { token: tokens.USDS, value: NormalizedUnitNumber(1300.74), usdValue: NormalizedUnitNumber(1300.74) },
        { token: tokens.USDC, value: NormalizedUnitNumber(1300.74), usdValue: NormalizedUnitNumber(1300.74) },
      ],
    },
    exitFarmSwitchInfo: {
      showSwitch: false,
      onSwitch: () => {},
      checked: false,
      reward: {
        token: tokens.SKY,
        tokenPrice: tokens.SKY.unitPriceUsd,
        amount: NormalizedUnitNumber(2311.34),
      },
    },
    actionsContext: {
      tokensInfo: mockTokensInfo,
      savingsDaiInfo: mockSavingsDaiInfo,
      savingsUsdsInfo: mockSavingsUsdsInfo,
      farmsInfo: mockedFarmsInfo,
    },
  },
}

export default meta
type Story = StoryObj<typeof UnstakeView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const WithExitFarmSwitch: Story = {
  args: {
    exitFarmSwitchInfo: {
      showSwitch: true,
      onSwitch: () => {},
      checked: true,
      reward: {
        token: tokens.SKY,
        tokenPrice: tokens.SKY.unitPriceUsd,
        amount: NormalizedUnitNumber(2311.34),
      },
    },
    objectives: [
      {
        type: 'unstake',
        token: tokens.USDS,
        amount: NormalizedUnitNumber(100),
        farm: farm.blockchainInfo.address,
        exit: true,
      },
    ],
    assetsFields: {
      selectedAsset: {
        token: tokens.USDS,
        balance: NormalizedUnitNumber(50_000),
        value: '50000',
      },
      maxValue: NormalizedUnitNumber(50_000),
      maxSelectedFieldName: 'isMaxSelected',
      changeAsset: () => {},
    },
    txOverview: {
      status: 'success',
      stakingToken: tokens.USDS,
      rewardToken: tokens.SKY,
      isExiting: true,
      earnedRewards: NormalizedUnitNumber(2311.34),
      routeToOutcomeToken: [
        { token: tokens.USDS, value: NormalizedUnitNumber(1300.74), usdValue: NormalizedUnitNumber(1300.74) },
        { token: tokens.USDC, value: NormalizedUnitNumber(1300.74), usdValue: NormalizedUnitNumber(1300.74) },
      ],
    },
  },
}
export const WithExitFarmSwitchMobile = getMobileStory(WithExitFarmSwitch)
export const WithExitFarmSwitchTablet = getTabletStory(WithExitFarmSwitch)
export const WithExitFarmSwitchZeroApy: Story = {
  args: {
    exitFarmSwitchInfo: {
      showSwitch: true,
      onSwitch: () => {},
      checked: true,
      reward: {
        token: tokens.SKY,
        tokenPrice: undefined,
        amount: NormalizedUnitNumber(2311.34),
      },
    },
  },
}

export const WithExitFarmSwitchUnchecked: Story = {
  args: {
    exitFarmSwitchInfo: {
      showSwitch: true,
      onSwitch: () => {},
      checked: false,
      reward: {
        token: tokens.SKY,
        tokenPrice: tokens.SKY.unitPriceUsd,
        amount: NormalizedUnitNumber(2311.34),
      },
    },
    assetsFields: {
      selectedAsset: {
        token: tokens.USDS,
        balance: NormalizedUnitNumber(50_000),
        value: '50000',
      },
      maxValue: NormalizedUnitNumber(50_000),
      maxSelectedFieldName: 'isMaxSelected',
      changeAsset: () => {},
    },
    objectives: [
      {
        type: 'unstake',
        token: tokens.USDS,
        amount: NormalizedUnitNumber(100),
        farm: farm.blockchainInfo.address,
        exit: false,
      },
    ],
  },
}
export const WithExitFarmSwitchUncheckedMobile = getMobileStory(WithExitFarmSwitch)
export const WithExitFarmSwitchUncheckedTablet = getTabletStory(WithExitFarmSwitch)
