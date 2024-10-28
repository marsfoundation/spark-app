import type { Meta, StoryObj } from '@storybook/react'
import { ChevronRightIcon, PlusIcon } from 'lucide-react'
import { Button, ButtonProps } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Atoms/New/Button',
  component: Button,
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  render: () => {
    const buttonProps: ButtonProps = {
      children: 'Button',
      prefixIcon: PlusIcon,
      postfixIcon: ChevronRightIcon,
    }

    return (
      <div className="grid w-fit grid-cols-3 justify-items-center gap-x-12 gap-y-4">
        <div> Primary </div>
        <div> Secondary </div>
        <div> Tertiary </div>

        <Button variant="primary" size="l" {...buttonProps} />
        <Button variant="secondary" size="l" {...buttonProps} />
        <Button variant="tertiary" size="l" {...buttonProps} />

        <Button variant="primary" size="m" {...buttonProps} />
        <Button variant="secondary" size="m" {...buttonProps} />
        <Button variant="tertiary" size="m" {...buttonProps} />

        <Button variant="primary" size="s" {...buttonProps} />
        <Button variant="secondary" size="s" {...buttonProps} />
        <Button variant="tertiary" size="s" {...buttonProps} />
      </div>
    )
  },
}

export const Hovered: Story = {
  render: () => {
    const buttonProps: ButtonProps = {
      children: 'Button',
      prefixIcon: PlusIcon,
      postfixIcon: ChevronRightIcon,
    }

    return (
      <div className="grid w-fit grid-cols-3 justify-items-center gap-x-12 gap-y-4">
        <div> Primary </div>
        <div> Secondary </div>
        <div> Tertiary </div>

        <Button variant="primary" size="l" {...buttonProps} />
        <Button variant="secondary" size="l" {...buttonProps} />
        <Button variant="tertiary" size="l" {...buttonProps} />

        <Button variant="primary" size="m" {...buttonProps} />
        <Button variant="secondary" size="m" {...buttonProps} />
        <Button variant="tertiary" size="m" {...buttonProps} />

        <Button variant="primary" size="s" {...buttonProps} />
        <Button variant="secondary" size="s" {...buttonProps} />
        <Button variant="tertiary" size="s" {...buttonProps} />
      </div>
    )
  },
  parameters: {
    pseudo: {
      hover: true,
    },
  },
}

export const Focused: Story = {
  render: () => {
    const buttonProps: ButtonProps = {
      children: 'Button',
      prefixIcon: PlusIcon,
      postfixIcon: ChevronRightIcon,
    }

    return (
      <div className="grid w-fit grid-cols-3 justify-items-center gap-x-12 gap-y-4">
        <div> Primary </div>
        <div> Secondary </div>
        <div> Tertiary </div>

        <Button variant="primary" size="l" {...buttonProps} />
        <Button variant="secondary" size="l" {...buttonProps} />
        <Button variant="tertiary" size="l" {...buttonProps} />

        <Button variant="primary" size="m" {...buttonProps} />
        <Button variant="secondary" size="m" {...buttonProps} />
        <Button variant="tertiary" size="m" {...buttonProps} />

        <Button variant="primary" size="s" {...buttonProps} />
        <Button variant="secondary" size="s" {...buttonProps} />
        <Button variant="tertiary" size="s" {...buttonProps} />
      </div>
    )
  },
  parameters: {
    pseudo: {
      focusVisible: true,
    },
  },
}

export const Pressed: Story = {
  render: () => {
    const buttonProps: ButtonProps = {
      children: 'Button',
      prefixIcon: PlusIcon,
      postfixIcon: ChevronRightIcon,
    }

    return (
      <div className="grid w-fit grid-cols-3 justify-items-center gap-x-12 gap-y-4">
        <div> Primary </div>
        <div> Secondary </div>
        <div> Tertiary </div>

        <Button variant="primary" size="l" {...buttonProps} />
        <Button variant="secondary" size="l" {...buttonProps} />
        <Button variant="tertiary" size="l" {...buttonProps} />

        <Button variant="primary" size="m" {...buttonProps} />
        <Button variant="secondary" size="m" {...buttonProps} />
        <Button variant="tertiary" size="m" {...buttonProps} />

        <Button variant="primary" size="s" {...buttonProps} />
        <Button variant="secondary" size="s" {...buttonProps} />
        <Button variant="tertiary" size="s" {...buttonProps} />
      </div>
    )
  },
  parameters: {
    pseudo: {
      active: true,
    },
  },
}

export const Disabled: Story = {
  render: () => {
    const buttonProps: ButtonProps = {
      children: 'Button',
      prefixIcon: PlusIcon,
      postfixIcon: ChevronRightIcon,
      disabled: true,
    }

    return (
      <div className="grid w-fit grid-cols-3 justify-items-center gap-x-12 gap-y-4">
        <div> Primary </div>
        <div> Secondary </div>
        <div> Tertiary </div>

        <Button variant="primary" size="l" {...buttonProps} />
        <Button variant="secondary" size="l" {...buttonProps} />
        <Button variant="tertiary" size="l" {...buttonProps} />

        <Button variant="primary" size="m" {...buttonProps} />
        <Button variant="secondary" size="m" {...buttonProps} />
        <Button variant="tertiary" size="m" {...buttonProps} />

        <Button variant="primary" size="s" {...buttonProps} />
        <Button variant="secondary" size="s" {...buttonProps} />
        <Button variant="tertiary" size="s" {...buttonProps} />
      </div>
    )
  },
}

export const Loading: Story = {
  render: () => {
    const buttonProps: ButtonProps = {
      children: 'Button',
      prefixIcon: PlusIcon,
      postfixIcon: ChevronRightIcon,
      loading: true,
    }

    return (
      <div className="grid w-fit grid-cols-3 justify-items-center gap-x-12 gap-y-4">
        <div> Primary </div>
        <div> Secondary </div>
        <div> Tertiary </div>

        <Button variant="primary" size="l" {...buttonProps} />
        <Button variant="secondary" size="l" {...buttonProps} />
        <Button variant="tertiary" size="l" {...buttonProps} />

        <Button variant="primary" size="m" {...buttonProps} />
        <Button variant="secondary" size="m" {...buttonProps} />
        <Button variant="tertiary" size="m" {...buttonProps} />

        <Button variant="primary" size="s" {...buttonProps} />
        <Button variant="secondary" size="s" {...buttonProps} />
        <Button variant="tertiary" size="s" {...buttonProps} />
      </div>
    )
  },
}
