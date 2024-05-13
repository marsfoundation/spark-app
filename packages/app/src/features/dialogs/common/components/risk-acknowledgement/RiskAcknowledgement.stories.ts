import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory } from '@storybook/viewports'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { RiskAcknowledgement } from './RiskAcknowledgement'

const meta: Meta<typeof RiskAcknowledgement> = {
  title: 'Features/Dialogs/Components/RiskAcknowledgement',
  component: RiskAcknowledgement,
  decorators: [WithClassname('max-w-xl')],
  args: {
    warning: {
      type: 'savings-deposit-discrepancy-threshold-hit',
      discrepancy: NormalizedUnitNumber(100),
      token: tokens['DAI'],
    },
    onStatusChange: () => {},
  },
}

export default meta
type Story = StoryObj<typeof RiskAcknowledgement>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
