import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { useForm } from 'react-hook-form'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { DepositToSavingsObjective } from '@/features/actions/flavours/deposit-to-savings/types'
import { SavingsDepositView } from './SavingsDepositView'

const dai = tokens.DAI
const sdai = tokens.sDAI
const usds = tokens.USDS
const snst = tokens.sUSDS
const usdc = tokens.USDC
const mockTokensInfo = new TokensInfo(
  [
    { token: dai, balance: NormalizedUnitNumber(100) },
    { token: sdai, balance: NormalizedUnitNumber(100) },
    { token: usds, balance: NormalizedUnitNumber(100) },
    { token: snst, balance: NormalizedUnitNumber(100) },
    { token: usdc, balance: NormalizedUnitNumber(100) },
  ],
  {
    DAI: dai.symbol,
    sDAI: sdai.symbol,
    USDS: usds.symbol,
    sUSDS: snst.symbol,
  },
)

const meta: Meta<typeof SavingsDepositView> = {
  title: 'Features/Dialogs/Views/Savings/Deposit',
  component: (args) => {
    const form = useForm() as any
    return <SavingsDepositView {...args} form={form} />
  },
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  args: {
    selectableAssets: [
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(50000),
      },
      {
        token: tokens.DAI,
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
      baseStable: tokens.DAI,
      status: 'success',
      APY: Percentage(0.05),
      stableEarnRate: NormalizedUnitNumber(542),
      route: [
        { token: tokens.USDC, value: NormalizedUnitNumber(1300.74), usdValue: NormalizedUnitNumber(1300.74) },
        { token: tokens.DAI, value: NormalizedUnitNumber(1300.74), usdValue: NormalizedUnitNumber(1300.74) },
        { token: tokens.sDAI, value: NormalizedUnitNumber(925.75), usdValue: NormalizedUnitNumber(1300.74) },
      ],
      makerBadgeToken: tokens.USDC,
      outTokenAmount: NormalizedUnitNumber(925.75),
    },
    savingsUsdsSwitchInfo: {
      showSwitch: false,
      onSwitch: () => {},
      checked: false,
    },
    actionsContext: {
      tokensInfo: mockTokensInfo,
    },
  },
}

export default meta
type Story = StoryObj<typeof SavingsDepositView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const WithSUSDSSwitch: Story = {
  args: {
    savingsUsdsSwitchInfo: {
      showSwitch: true,
      onSwitch: () => {},
      checked: true,
    },
  },
}
export const WithSUSDSSwitchMobile = getMobileStory(WithSUSDSSwitch)
export const WithSUSDSSwitchTablet = getTabletStory(WithSUSDSSwitch)
