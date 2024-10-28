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
export const PrimaryHovered: Story = {
  args: PrimaryArgs,
  parameters: { pseudo: { hover: true } },
}
export const PrimaryPressed: Story = {
  args: PrimaryArgs,
  parameters: { pseudo: { active: true } },
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
export const SecondaryHovered: Story = {
  args: SecondaryArgs,
  parameters: { pseudo: { hover: true } },
}
export const SecondaryPressed: Story = {
  args: SecondaryArgs,
  parameters: { pseudo: { active: true } },
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
export const TertiaryHovered: Story = {
  args: TertiaryArgs,
  parameters: { pseudo: { hover: true } },
}

export const TertiaryPressed: Story = {
  args: TertiaryArgs,
  parameters: { pseudo: { active: true } },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
}

export const Focused: Story = {
  args: {
    children: 'Focused Button',
  },
  parameters: { pseudo: { focusWithin: true } },
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
    prefixIcon: Fingerprint,
  },
}

export const WithPrefixIconM: Story = {
  args: {
    children: 'With Prefix',
    prefixIcon: Fingerprint,
  },
}

export const WithPrefixIconS: Story = {
  args: {
    size: 's',
    children: 'With Prefix',
    prefixIcon: Fingerprint,
  },
}

export const WithPrefixIconDisabled: Story = {
  args: {
    children: 'With Prefix Disabled',
    prefixIcon: Fingerprint,
    disabled: true,
  },
}

export const WithPostfixIcon: Story = {
  args: {
    children: 'With Postfix',
    postfixIcon: Candy,
  },
}

export const WithPrefixAndPostfixIcons: Story = {
  args: {
    children: 'With Prefix and Postfix',
    prefixIcon: Fingerprint,
    postfixIcon: Candy,
  },
}
