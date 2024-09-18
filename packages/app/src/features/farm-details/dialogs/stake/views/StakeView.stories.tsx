import { FarmsInfo } from '@/domain/farms/farmsInfo'
import { Farm } from '@/domain/farms/types'
import { PotSavingsInfo } from '@/domain/savings-info/potSavingsInfo'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { DepositToSavingsObjective } from '@/features/actions/flavours/deposit-to-savings/types'
import { bigNumberify } from '@/utils/bigNumber'
import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { useForm } from 'react-hook-form'
import { StakeView } from './StakeView'

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
  address: CheckedAddress('0x1234567890123456789012345678901234567890'),
  apy: Percentage(0.05),
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
  depositors: 1111,
  earned: NormalizedUnitNumber(52),
  staked: NormalizedUnitNumber(100),
}

const mockedFarmsInfo = new FarmsInfo([farm])

const meta: Meta<typeof StakeView> = {
  title: 'Features/FarmDetails/Dialogs/Views/Stake',
  component: (args) => {
    const form = useForm() as any
    return <StakeView {...args} form={form} />
  },
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  args: {
    farm,
    selectableAssets: [
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(50000),
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
        token: tokens.USDC,
        balance: NormalizedUnitNumber(50000),
        value: '2000',
      },
      maxValue: NormalizedUnitNumber(5000),
      changeAsset: () => {},
    },
    objectives: [
      {
        type: 'depositToSavings',
        value: NormalizedUnitNumber(5000),
        token: tokens.USDC,
        savingsToken: tokens.sDAI,
      } satisfies DepositToSavingsObjective,
    ],
    pageStatus: {
      state: 'form',
      actionsEnabled: true,
      goToSuccessScreen: () => {},
    },
    txOverview: {
      status: 'success',
      apy: Percentage(0.05),
      stakingToken: tokens.USDS,
      rewardsToken: tokens.SKY,
      rewardsRate: NormalizedUnitNumber(542),
      routeToStakingToken: [
        { token: tokens.USDC, value: NormalizedUnitNumber(1300.74), usdValue: NormalizedUnitNumber(1300.74) },
        { token: tokens.USDS, value: NormalizedUnitNumber(1300.74), usdValue: NormalizedUnitNumber(1300.74) },
      ],
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
type Story = StoryObj<typeof StakeView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
