import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { NormalizedUnitNumber, Percentage, raise } from '@marsfoundation/common-universal'
import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { within } from '@storybook/test'
import { withRouter } from 'storybook-addon-remix-react-router'
import { MarketsTable } from './MarketsTable'

const meta: Meta<typeof MarketsTable> = {
  title: 'Features/Markets/Components/MarketsTable',
  component: MarketsTable,
  decorators: [WithTooltipProvider(), WithClassname('max-w-6xl'), withRouter],
  args: {
    entries: [
      {
        token: tokens.wstETH,
        reserveStatus: 'frozen',
        borrowAPYDetails: { apy: Percentage(0.11), incentives: [], airdrops: [] },
        depositAPYDetails: {
          apy: Percentage(0.157),
          incentives: [{ token: tokens.stETH, APR: Percentage(0.1) }],
          airdrops: [],
        },
        totalBorrowed: NormalizedUnitNumber(0),
        totalSupplied: NormalizedUnitNumber(11.99),
        marketStatus: {
          supplyAvailabilityStatus: 'no',
          collateralEligibilityStatus: 'no',
          borrowEligibilityStatus: 'no',
        },
      },
      {
        token: tokens.GNO,
        reserveStatus: 'paused',
        borrowAPYDetails: { apy: Percentage(0.11), incentives: [], airdrops: [] },
        depositAPYDetails: {
          apy: Percentage(0.157),
          incentives: [],
          airdrops: [],
        },
        totalBorrowed: NormalizedUnitNumber(0),
        totalSupplied: NormalizedUnitNumber(11.99),
        marketStatus: {
          supplyAvailabilityStatus: 'no',
          collateralEligibilityStatus: 'no',
          borrowEligibilityStatus: 'no',
        },
      },
      {
        token: tokens.ETH,
        reserveStatus: 'active',
        borrowAPYDetails: { apy: Percentage(0.11), incentives: [], airdrops: [] },
        depositAPYDetails: {
          apy: Percentage(0.157),
          airdrops: [TokenSymbol('SPK')],
          incentives: [{ token: tokens.stETH, APR: Percentage(0.1) }],
        },
        totalBorrowed: NormalizedUnitNumber(0),
        totalSupplied: NormalizedUnitNumber(11.99),
        marketStatus: {
          supplyAvailabilityStatus: 'yes',
          collateralEligibilityStatus: 'yes',
          borrowEligibilityStatus: 'yes',
        },
      },
      {
        token: tokens.rETH,
        reserveStatus: 'active',
        borrowAPYDetails: { apy: Percentage(0.11), incentives: [], airdrops: [] },
        depositAPYDetails: {
          apy: Percentage(0.157),
          incentives: [{ token: tokens.stETH, APR: Percentage(0.1) }],
          airdrops: [],
        },
        totalBorrowed: NormalizedUnitNumber(0),
        totalSupplied: NormalizedUnitNumber(11.99),
        marketStatus: {
          supplyAvailabilityStatus: 'yes',
          collateralEligibilityStatus: 'yes',
          borrowEligibilityStatus: 'yes',
        },
      },
      {
        token: tokens.DAI,
        reserveStatus: 'active',
        borrowAPYDetails: {
          apy: Percentage(0.0553),
          incentives: [],
          airdrops: [TokenSymbol('SPK')],
        },
        depositAPYDetails: { apy: Percentage(0.05), incentives: [], airdrops: [] },
        totalBorrowed: NormalizedUnitNumber(1257),
        totalSupplied: NormalizedUnitNumber(0),
        marketStatus: {
          supplyAvailabilityStatus: 'yes',
          collateralEligibilityStatus: 'yes',
          borrowEligibilityStatus: 'yes',
        },
      },
    ],
    chainId: 1,
  },
}

export default meta
type Story = StoryObj<typeof MarketsTable>

export const Default: Story = {
  name: 'Default',
}

export const Mobile = getMobileStory<Story>({
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const switches = await canvas.findAllByRole('switch')
    ;(switches[0] ?? raise('No switch element found')).click()
  },
})
export const Tablet = getTabletStory(Default)
