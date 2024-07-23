import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory } from '@storybook/viewports'
import { RiskAcknowledgement } from './RiskAcknowledgement'

const meta: Meta<typeof RiskAcknowledgement> = {
  title: 'Components/Organisms/RiskAcknowledgement',
  component: RiskAcknowledgement,
  decorators: [WithClassname('max-w-xl')],
  args: {
    warning: {
      type: 'liquidation-warning-borrow',
    },
    onStatusChange: () => {},
  },
}

export default meta
type Story = StoryObj<typeof RiskAcknowledgement>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
