import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory } from '@storybook/viewports'
import { DowngradeNSTToDaiView } from './DowngradeNSTToDaiView'

const meta: Meta<typeof DowngradeNSTToDaiView> = {
  title: 'Features/Dialogs/Views/Migrate/Downgrade/NSTToDai',
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  component: DowngradeNSTToDaiView,
  args: {
    fromToken: tokens.NST,
    toToken: tokens.DAI,
    apyDifference: Percentage(0.0025),
    objectives: [
      {
        type: 'upgrade',
        fromToken: tokens.DAI,
        toToken: tokens.NST,
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
type Story = StoryObj<typeof DowngradeNSTToDaiView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getMobileStory(Desktop)
