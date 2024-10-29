import { WithClassname } from '@storybook-config/decorators'
import { getMobileStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'
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
