import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory } from '@storybook/viewports'
import { UpgradeSDaiToSUsdsView } from './UpgradeSDaiToSUsdsView'

const meta: Meta<typeof UpgradeSDaiToSUsdsView> = {
  title: 'Features/Dialogs/Views/Migrate/Upgrade/sDaiToSUsds',
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  component: UpgradeSDaiToSUsdsView,
  args: {
    fromToken: tokens.sDAI,
    toToken: tokens.sUSDS,
    apyImprovement: Percentage(0.0025),
    objectives: [
      {
        type: 'upgrade',
        fromToken: tokens.sDAI,
        toToken: tokens.sUSDS,
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
type Story = StoryObj<typeof UpgradeSDaiToSUsdsView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getMobileStory(Desktop)
