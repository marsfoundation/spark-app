import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { useForm } from 'react-hook-form'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { USDCToSDaiDepositObjective } from '@/features/actions/flavours/native-sdai-deposit/usdc-to-sdai/types'
import { SavingsDepositView } from './SavingsDepositView'

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
        type: 'usdcToSDaiDeposit',
        value: NormalizedUnitNumber(5000),
        usdc: tokens.USDC,
        sDai: tokens.sDAI,
      } satisfies USDCToSDaiDepositObjective,
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
    savingsNstSwitchInfo: {
      showSwitch: false,
      onSwitch: () => {},
      checked: false,
    },
  },
}

export default meta
type Story = StoryObj<typeof SavingsDepositView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const WithSNSTSwitch: Story = {
  args: {
    savingsNstSwitchInfo: {
      showSwitch: true,
      onSwitch: () => {},
      checked: true,
    },
  },
}
export const WithSNSTSwitchMobile = getMobileStory(WithSNSTSwitch)
export const WithSNSTSwitchTablet = getTabletStory(WithSNSTSwitch)
