import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WithClassname, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { ClaimView } from './ClaimView'

const meta: Meta<typeof ClaimView> = {
  title: 'Features/FarmDetails/Dialogs/Claim/Views/ClaimView',
  component: ClaimView,
  decorators: [WithClassname('max-w-xl'), ZeroAllowanceWagmiDecorator()],
  args: {
    txOverview: {
      reward: {
        token: tokens.SKY,
        tokenPrice: tokens.SKY.unitPriceUsd,
        amount: NormalizedUnitNumber(500.89),
      },
    },
    objectives: [
      {
        type: 'claimFarmRewards',
        farm: tokens.USDS.address,
        rewardToken: tokens.SKY,
        rewardTokenPrice: tokens.SKY.unitPriceUsd,
        rewardAmount: NormalizedUnitNumber(500.89),
      },
    ],
    pageStatus: {
      state: 'form',
      actionsEnabled: true,
      goToSuccessScreen: () => {},
    },
    actionsContext: {},
  },
}

export default meta
type Story = StoryObj<typeof ClaimView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
