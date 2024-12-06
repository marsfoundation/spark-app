import { StoryGrid } from '@sb/components/StoryGrid'
import type { Meta, StoryObj } from '@storybook/react'
import { ChevronRightIcon, PlusIcon } from 'lucide-react'
import { withRouter } from 'storybook-addon-remix-react-router'
import { ButtonIcon } from '../../button/Button'
import { LinkButton } from './LinkButton'

const meta: Meta<typeof LinkButton> = {
  title: 'Components/Atoms/New/LinkButton',
  decorators: [withRouter()],
  component: (args) => (
    <StoryGrid className="grid-cols-3">
      <StoryGrid.Label>Primary</StoryGrid.Label>
      <StoryGrid.Label>Secondary</StoryGrid.Label>
      <StoryGrid.Label>Tertiary</StoryGrid.Label>

      <LinkButton {...args} variant="primary" size="l">
        <ButtonIcon icon={PlusIcon} />
        Link Button
        <ButtonIcon icon={ChevronRightIcon} />
      </LinkButton>
      <LinkButton {...args} variant="secondary" size="l">
        <ButtonIcon icon={PlusIcon} />
        Link Button
        <ButtonIcon icon={ChevronRightIcon} />
      </LinkButton>
      <LinkButton {...args} variant="tertiary" size="l">
        <ButtonIcon icon={PlusIcon} />
        Link Button
        <ButtonIcon icon={ChevronRightIcon} />
      </LinkButton>

      <LinkButton {...args} variant="primary" size="m">
        <ButtonIcon icon={PlusIcon} />
        Link Button
        <ButtonIcon icon={ChevronRightIcon} />
      </LinkButton>
      <LinkButton {...args} variant="secondary" size="m">
        <ButtonIcon icon={PlusIcon} />
        Link Button
        <ButtonIcon icon={ChevronRightIcon} />
      </LinkButton>
      <LinkButton {...args} variant="tertiary" size="m">
        <ButtonIcon icon={PlusIcon} />
        Link Button
        <ButtonIcon icon={ChevronRightIcon} />
      </LinkButton>

      <LinkButton {...args} variant="primary" size="s">
        <ButtonIcon icon={PlusIcon} />
        Link Button
        <ButtonIcon icon={ChevronRightIcon} />
      </LinkButton>
      <LinkButton {...args} variant="secondary" size="s">
        <ButtonIcon icon={PlusIcon} />
        Link Button
        <ButtonIcon icon={ChevronRightIcon} />
      </LinkButton>
      <LinkButton {...args} variant="tertiary" size="s">
        <ButtonIcon icon={PlusIcon} />
        Link Button
        <ButtonIcon icon={ChevronRightIcon} />
      </LinkButton>
    </StoryGrid>
  ),
}

export default meta
type Story = StoryObj<typeof LinkButton>

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
