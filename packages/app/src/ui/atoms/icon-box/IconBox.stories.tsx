import { StoryGrid } from '@sb/components/StoryGrid'
import { Meta, StoryObj } from '@storybook/react'
import { IconBox } from './IconBox'

const meta: Meta<typeof IconBox> = {
  title: 'Components/Atoms/IconBox',
  component: () => (
    <StoryGrid className="grid-cols-4">
      <div />
      <StoryGrid.Label>XL</StoryGrid.Label>
      <StoryGrid.Label>S</StoryGrid.Label>
      <StoryGrid.Label>XS</StoryGrid.Label>

      <StoryGrid.Label>Success</StoryGrid.Label>
      <IconBox variant="success" size="xl" />
      <IconBox variant="success" size="s" />
      <IconBox variant="success" size="xs" />

      <StoryGrid.Label>Warning</StoryGrid.Label>
      <IconBox variant="warning" size="xl" />
      <IconBox variant="warning" size="s" />
      <IconBox variant="warning" size="xs" />

      <StoryGrid.Label>Info</StoryGrid.Label>
      <IconBox variant="info" size="xl" />
      <IconBox variant="info" size="s" />
      <IconBox variant="info" size="xs" />

      <StoryGrid.Label>Error</StoryGrid.Label>
      <IconBox variant="error" size="xl" />
      <IconBox variant="error" size="s" />
      <IconBox variant="error" size="xs" />
    </StoryGrid>
  ),
}

export default meta
type Story = StoryObj<typeof IconBox>

export const Default: Story = {}
