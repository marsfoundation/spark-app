import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { UpgradeView } from './UpgradeView'

const meta: Meta<typeof UpgradeView> = {
  title: 'Features/Dialogs/Views/Migrate/Upgrade',
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  component: UpgradeView,
  args: {
    fromToken: tokens.DAI,
    toToken: tokens.USDS,
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
