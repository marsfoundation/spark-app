import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
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
