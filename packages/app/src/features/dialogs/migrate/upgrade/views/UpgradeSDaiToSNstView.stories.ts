import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory } from '@storybook/viewports'
import { UpgradeSDaiToSNstView } from './UpgradeSDaiToSNstView'

const meta: Meta<typeof UpgradeSDaiToSNstView> = {
  title: 'Features/Dialogs/Views/Migrate/Upgrade/sDaiToSNst',
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  component: UpgradeSDaiToSNstView,
  args: {
    fromToken: tokens.sDAI,
    toToken: tokens.sNST,
    apyDifference: Percentage(0.0025),
    objectives: [
      {
        type: 'upgrade',
        fromToken: tokens.sDAI,
        toToken: tokens.sNST,
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
type Story = StoryObj<typeof UpgradeSDaiToSNstView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getMobileStory(Desktop)
