import { Meta, StoryObj } from '@storybook/react'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
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
        <TransactionOverview.Label>Outcome</TransactionOverview.Label>
        <TransactionOverview.Outcome token={tokens.USDS} amount={NormalizedUnitNumber(100)} />
      </TransactionOverview>
    )
  },
}
