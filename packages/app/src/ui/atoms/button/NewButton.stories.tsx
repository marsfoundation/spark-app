import type { Meta, StoryObj } from '@storybook/react'
import { Candy, Fingerprint } from 'lucide-react'

import { Button } from './NewButton'

const meta: Meta<typeof Button> = {
  title: 'Components/Atoms/NewButton',
  component: Button,
}

export default meta
type Story = StoryObj<typeof Button>

const PrimaryArgs = {
  variant: 'primary',
  children: 'Primary Button',
} as const

export const PrimaryL: Story = {
  args: {
    ...PrimaryArgs,
    size: 'l',
  },
}
export const PrimaryM: Story = {
  args: {
    ...PrimaryArgs,
    size: 'm',
  },
}
export const PrimaryS: Story = {
  args: {
    ...PrimaryArgs,
    size: 's',
  },
}

const SecondaryArgs = {
  variant: 'secondary',
  children: 'Secondary Button',
} as const

export const SecondaryL: Story = {
  args: {
    ...SecondaryArgs,
    size: 'l',
  },
}
export const SecondaryM: Story = {
  args: {
    ...SecondaryArgs,
    size: 'm',
  },
}
export const SecondaryS: Story = {
  args: {
    ...SecondaryArgs,
    size: 's',
  },
}

const TertiaryArgs = {
  variant: 'tertiary',
  children: 'Tertiary Button',
} as const

export const TertiaryL: Story = {
  args: {
    ...TertiaryArgs,
    size: 'l',
  },
}
export const TertiaryM: Story = {
  args: {
    ...TertiaryArgs,
    size: 'm',
  },
}
export const TertiaryS: Story = {
  args: {
    ...TertiaryArgs,
    size: 's',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading Button',
  },
}

export const WithPrefixIconL: Story = {
  args: {
    size: 'l',
    children: 'With Prefix',
    prefixIcon: <Fingerprint size={20} />,
  },
}

export const WithPrefixIconM: Story = {
  args: {
    children: 'With Prefix',
    prefixIcon: <Fingerprint size={20} />,
  },
}

export const WithPrefixIconS: Story = {
  args: {
    size: 's',
    children: 'With Prefix',
    prefixIcon: <Fingerprint size={16} />,
  },
}

export const WithPrefixIconDisabled: Story = {
  args: {
    children: 'With Prefix Disabled',
    prefixIcon: <Fingerprint size={20} />,
    disabled: true,
  },
}

export const WithPostfixIcon: Story = {
  args: {
    children: 'With Postfix',
    postfixIcon: <Candy size={20} />,
  },
}

export const WithPrefixAndPostfixIcons: Story = {
  args: {
    children: 'With Prefix and Postfix',
    prefixIcon: <Fingerprint size={20} />,
    postfixIcon: <Candy size={20} />,
  },
}

export const Hovered: Story = {
  args: {
    children: 'Hovered',
  },
  parameters: { pseudo: { hover: true } },
}

export const Focused: Story = {
  args: {
    children: 'Focused',
  },
  parameters: { pseudo: { focusVisible: true } },
}

export const Pressed: Story = {
  args: {
    children: 'Pressed',
  },
  parameters: { pseudo: { active: true } },
}
