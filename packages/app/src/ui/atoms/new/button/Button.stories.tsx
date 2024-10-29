import { StoryGrid } from '@/ui/storybook/StoryGrid'
import type { Meta, StoryObj } from '@storybook/react'
import { ChevronRightIcon, PlusIcon } from 'lucide-react'
import { Button, ButtonProps } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Atoms/New/Button',
  args: {
    children: 'Button',
    prefixIcon: PlusIcon,
    postfixIcon: ChevronRightIcon,
  },
  component: (props: ButtonProps) => (
    <StoryGrid className="grid-cols-3">
      <StoryGrid.Label>Primary</StoryGrid.Label>
      <StoryGrid.Label>Secondary</StoryGrid.Label>
      <StoryGrid.Label>Tertiary</StoryGrid.Label>

      <Button variant="primary" size="l" {...props} />
      <Button variant="secondary" size="l" {...props} />
      <Button variant="tertiary" size="l" {...props} />

      <Button variant="primary" size="m" {...props} />
      <Button variant="secondary" size="m" {...props} />
      <Button variant="tertiary" size="m" {...props} />

      <Button variant="primary" size="s" {...props} />
      <Button variant="secondary" size="s" {...props} />
      <Button variant="tertiary" size="s" {...props} />
    </StoryGrid>
  ),
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {}

export const Hovered: Story = {
  parameters: {
    pseudo: {
      hover: true,
    },
  },
}

export const Focused: Story = {
  parameters: {
    pseudo: {
      focusVisible: true,
    },
  },
}

export const Pressed: Story = {
  parameters: {
    pseudo: {
      active: true,
    },
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const Loading: Story = {
  args: {
    loading: true,
  },
}
