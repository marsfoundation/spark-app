import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook-config/decorators'
import { tokens } from '@storybook-config/tokens'
import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { encodeFunctionResult, zeroAddress } from 'viem'

import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { incentiveControllerAbi } from '@/config/abis/incentiveControllerAbi'
import { ClaimRewardsView } from './ClaimRewardsView'

const meta: Meta<typeof ClaimRewardsView> = {
  title: 'Features/Dialogs/Views/ClaimRewards',
  component: ClaimRewardsView,
  decorators: [
    ZeroAllowanceWagmiDecorator({
      requestFnOverride: async () => {
        return encodeFunctionResult({
          abi: incentiveControllerAbi,
          functionName: 'claimAllRewards',
          result: [[zeroAddress], [0n]],
        })
      },
    }),
    WithTooltipProvider(),
    WithClassname('max-w-xl'),
  ],
  args: {
    objectives: [
      {
        type: 'claimMarketRewards',
        token: tokens.wstETH,
        assets: [CheckedAddress(zeroAddress)],
        incentiveControllerAddress: CheckedAddress(zeroAddress),
      },
    ],
    pageStatus: {
      state: 'form',
      actionsEnabled: true,
      goToSuccessScreen: () => {},
    },
    rewards: [
      {
        token: tokens.wstETH,
        amount: NormalizedUnitNumber(0.00157),
      },
    ],
  },
}

export default meta
type Story = StoryObj<typeof ClaimRewardsView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
