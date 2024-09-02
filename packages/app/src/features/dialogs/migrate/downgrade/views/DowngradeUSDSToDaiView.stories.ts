import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory } from '@storybook/viewports'
import { DowngradeUSDSToDaiView } from './DowngradeUSDSToDaiView'

const meta: Meta<typeof DowngradeUSDSToDaiView> = {
  title: 'Features/Dialogs/Views/Migrate/Downgrade/USDSToDai',
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  component: DowngradeUSDSToDaiView,
  args: {
    fromToken: tokens.USDS,
    toToken: tokens.DAI,
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
export const Tablet = getMobileStory(Desktop)
