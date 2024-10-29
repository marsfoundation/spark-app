import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'

import { WithTooltipProvider } from '@sb/decorators'
import { TermsOfService } from './TermsOfService'

const meta: Meta<typeof TermsOfService> = {
  title: 'Features/Compliance/Components/TermsOfService',
  decorators: [withRouter(), WithTooltipProvider()],
  component: TermsOfService,
}

export default meta
type Story = StoryObj<typeof TermsOfService>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)
