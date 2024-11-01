import { Meta, StoryObj } from '@storybook/react'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithClassname } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { TransactionOverview } from './TransactionOverview'

const meta: Meta<typeof TransactionOverview> = {
  title: 'Components/Molecules/New/TransactionOverview',
  decorators: [WithClassname('max-w-2xl')],
  component: TransactionOverview,
}

export default meta

type Story = StoryObj<typeof TransactionOverview>

export const Default: Story = {
  render: () => {
    return (
      <TransactionOverview>
        <TransactionOverview.Row>
          <TransactionOverview.Label>APY</TransactionOverview.Label>
          <TransactionOverview.Apy
            apy={Percentage(0.05)}
            rewardsPerYear={NormalizedUnitNumber(100)}
            rewardToken={tokens.USDS}
          />
        </TransactionOverview.Row>
        <TransactionOverview.Row>
          <TransactionOverview.Label>Route</TransactionOverview.Label>
          <TransactionOverview.Route
            route={[
              { token: tokens.USDC, amount: NormalizedUnitNumber(100), usdAmount: NormalizedUnitNumber(100) },
              { token: tokens.USDS, amount: NormalizedUnitNumber(100), usdAmount: NormalizedUnitNumber(100) },
              {
                token: tokens.sUSDS,
                amount: NormalizedUnitNumber(91.345035308238),
                usdAmount: NormalizedUnitNumber(100),
              },
            ]}
          />
        </TransactionOverview.Row>
        <TransactionOverview.Row>
          <TransactionOverview.Label>Outcome</TransactionOverview.Label>
          <TransactionOverview.Outcome token={tokens.USDS} amount={NormalizedUnitNumber(100)} />
        </TransactionOverview.Row>
      </TransactionOverview>
    )
  },
}
