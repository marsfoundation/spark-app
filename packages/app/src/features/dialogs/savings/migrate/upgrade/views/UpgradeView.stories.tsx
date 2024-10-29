import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { UpgradeView } from './UpgradeView'

const meta: Meta<typeof UpgradeView> = {
  title: 'Features/Dialogs/Views/Migrate/Upgrade',
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  component: (args) => {
    const form = useForm() as any
    return <UpgradeView {...args} form={form} />
  },
  args: {
    fromToken: tokens.DAI,
    toToken: tokens.USDS,
    dai: tokens.DAI.symbol,
    sdai: tokens.sDAI.symbol,
    txOverview: {
      status: 'success',
      route: [
        {
          token: tokens.DAI,
          value: NormalizedUnitNumber(5000),
          usdValue: NormalizedUnitNumber(5000),
        },
        {
          token: tokens.USDS,
          value: NormalizedUnitNumber(5000),
          usdValue: NormalizedUnitNumber(5000),
        },
      ],
    },
    selectableAssets: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(5000),
      },
    ],
    assetsFields: {
      selectedAsset: {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(5000),
        value: '2000',
      },
      maxValue: NormalizedUnitNumber(5000),
      changeAsset: () => {},
    },
    objectives: [
      {
        type: 'upgrade',
        fromToken: tokens.DAI,
        toToken: tokens.USDS,
        amount: NormalizedUnitNumber(1),
      },
    ],
    pageStatus: {
      state: 'form',
      actionsEnabled: true,
      goToSuccessScreen: () => {},
    },
  },
}

export default meta
type Story = StoryObj<typeof UpgradeView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const sDai: Story = {
  name: 'sDai',
  args: {
    fromToken: tokens.sDAI,
    toToken: tokens.sUSDS,
    txOverview: {
      status: 'success',
      apyChange: { current: Percentage(0.05), updated: Percentage(0.07) },
      route: [
        {
          token: tokens.sDAI,
          value: NormalizedUnitNumber(5000),
          usdValue: NormalizedUnitNumber(5000),
        },
        {
          token: tokens.sUSDS,
          value: NormalizedUnitNumber(5000),
          usdValue: NormalizedUnitNumber(5000),
        },
      ],
    },
    selectableAssets: [
      {
        token: tokens.sDAI,
        balance: NormalizedUnitNumber(5000),
      },
    ],
    assetsFields: {
      selectedAsset: {
        token: tokens.sDAI,
        balance: NormalizedUnitNumber(5000),
        value: '2000',
      },
      maxValue: NormalizedUnitNumber(5000),
      changeAsset: () => {},
    },
    objectives: [
      {
        type: 'upgrade',
        fromToken: tokens.sDAI,
        toToken: tokens.sUSDS,
        amount: NormalizedUnitNumber(1),
      },
    ],
  },
}
