import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory } from '@storybook/viewports'
import { UpgradeDaiToUSDSView } from './UpgradeDaiToUSDSView'

const meta: Meta<typeof UpgradeDaiToUSDSView> = {
  title: 'Features/Dialogs/Views/Migrate/Upgrade/DaiToUSDS',
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  component: UpgradeDaiToUSDSView,
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
type Story = StoryObj<typeof UpgradeDaiToUSDSView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getMobileStory(Desktop)
