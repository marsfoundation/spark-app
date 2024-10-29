import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { DowngradeUSDSToDaiView } from './DowngradeUSDSToDaiView'

const meta: Meta<typeof DowngradeUSDSToDaiView> = {
  title: 'Features/Dialogs/Views/Migrate/Downgrade',
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  component: (args) => {
    const form = useForm() as any
    return <DowngradeUSDSToDaiView {...args} form={form} />
  },
  args: {
    fromToken: tokens.USDS,
    toToken: tokens.DAI,
    txOverview: {
      status: 'success',
      route: [
        {
          token: tokens.USDS,
          value: NormalizedUnitNumber(5000),
          usdValue: NormalizedUnitNumber(5000),
        },
        {
          token: tokens.DAI,
          value: NormalizedUnitNumber(5000),
          usdValue: NormalizedUnitNumber(5000),
        },
      ],
    },
    selectableAssets: [
      {
        token: tokens.USDS,
        balance: NormalizedUnitNumber(5000),
      },
    ],
    assetsFields: {
      selectedAsset: {
        token: tokens.USDS,
        balance: NormalizedUnitNumber(5000),
        value: '2000',
      },
      maxValue: NormalizedUnitNumber(5000),
      changeAsset: () => {},
    },
    objectives: [
      {
        type: 'downgrade',
        fromToken: tokens.USDS,
        toToken: tokens.DAI,
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
type Story = StoryObj<typeof DowngradeUSDSToDaiView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
