import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { encodeFunctionResult, zeroAddress } from 'viem'

import { Hex, NormalizedUnitNumber } from '@marsfoundation/common-universal'

import { incentiveControllerAbi } from '@/config/abis/incentiveControllerAbi'
import { ClaimSparkRewardsView } from './ClaimSparkRewardsView'

const meta: Meta<typeof ClaimSparkRewardsView> = {
  title: 'Features/Dialogs/Views/ClaimSparkRewards',
  component: ClaimSparkRewardsView,
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
        type: 'claimSparkRewards',
        token: tokens.REDSTONE,
        epoch: 1,
        cumulativeAmount: NormalizedUnitNumber(1000),
        merkleRoot: Hex.random(),
        merkleProof: Array.from({ length: 7 }, () => Hex.random()),
      },
    ],
    pageStatus: {
      state: 'form',
      actionsEnabled: true,
      goToSuccessScreen: () => {},
    },
    claims: [
      {
        token: tokens.REDSTONE,
        value: NormalizedUnitNumber(100),
      },
      {
        token: tokens.USDS,
        value: NormalizedUnitNumber(1000),
      },
    ],
  },
}

export default meta
type Story = StoryObj<typeof ClaimSparkRewardsView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
