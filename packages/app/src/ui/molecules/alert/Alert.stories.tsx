import { StoryGrid } from '@sb/components/StoryGrid'
import { Meta, StoryObj } from '@storybook/react'
import { Alert } from './Alert'

const lengthyText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Sed id risus et diam luctus aliquam. Donec ut semper nisi. Nullam eget
  nisl eget nunc varius tincidunt. Aliquam erat volutpat.`

const meta: Meta<typeof Alert> = {
  title: 'Components/Molecules/Alert',
  component: () => (
    <StoryGrid className="max-w-7xl grid-cols-[auto_1fr_1fr]">
      <div />
      <StoryGrid.Label>Non-Closable</StoryGrid.Label>
      <StoryGrid.Label>Closable</StoryGrid.Label>

      <StoryGrid.Label>Info</StoryGrid.Label>
      <Alert variant="info">{lengthyText}</Alert>
      <Alert variant="info" closable>
        {lengthyText}
      </Alert>

      <StoryGrid.Label>Warning</StoryGrid.Label>
      <Alert variant="warning">{lengthyText}</Alert>
      <Alert variant="warning" closable>
        {lengthyText}
      </Alert>

      <StoryGrid.Label>Error</StoryGrid.Label>
      <Alert variant="error">{lengthyText}</Alert>
      <Alert variant="error" closable>
        {lengthyText}
      </Alert>
    </StoryGrid>
  ),
}

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {}
