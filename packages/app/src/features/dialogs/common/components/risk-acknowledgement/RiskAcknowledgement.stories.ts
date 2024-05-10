import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory } from '@storybook/viewports'

import { RiskAcknowledgement } from './RiskAcknowledgement'

const meta: Meta<typeof RiskAcknowledgement> = {
  title: 'Features/Dialogs/Components/RiskAcknowledgement',
  component: RiskAcknowledgement,
  decorators: [WithClassname('max-w-xl')],
  args: {
    children: 'Borrowing such a large amount makes you liable to be liquidated in no time and lose your collateral.',
    onStatusChanged: () => {},
  },
}

export default meta
type Story = StoryObj<typeof RiskAcknowledgement>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
