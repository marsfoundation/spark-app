import type { Meta, StoryObj } from '@storybook/react'
import { ArrowLeft, Candy, X } from 'lucide-react'
import { withRouter } from 'storybook-addon-react-router-v6'

import { LinkButton } from './Button'

const meta: Meta<typeof LinkButton> = {
  title: 'Components/Atoms/LinkButton',
  component: LinkButton,
  decorators: [withRouter],
  args: {
    to: '/',
  },
}

export default meta
type Story = StoryObj<typeof LinkButton>

export const PrimaryMd: Story = {
  name: 'Primary:md',
  args: {
    variant: 'primary',
    children: 'Primary Medium',
  },
}

export const PrimaryMdDisabled: Story = {
  name: 'Primary:md:disabled',
  args: {
    variant: 'primary',
    children: 'Primary Medium Disabled',
    disabled: true,
  },
}

export const PrimarySm: Story = {
  name: 'Primary:sm',
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Primary Small',
  },
}

export const PrimarySmDisabled: Story = {
  name: 'Primary:sm:disabled',
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Primary Small Disabled',
    disabled: true,
  },
}

export const PrimaryLg: Story = {
  name: 'Primary:lg',
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Button Large',
  },
}

export const PrimaryLgDisabled: Story = {
  name: 'Primary:lg:disabled',
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Primary Large Disabled',
    disabled: true,
  },
}

export const SecondaryMd: Story = {
  name: 'Secondary:md',
  args: {
    variant: 'secondary',
    children: 'Secondary Medium',
  },
}

export const GreenMd: Story = {
  name: 'Green:md',
  args: {
    variant: 'green',
    children: 'Green Medium',
  },
}

export const Text: Story = {
  name: 'Text',
  args: {
    variant: 'text',
    children: 'Text button',
  },
}

export const TextDisabled: Story = {
  name: 'Text:disabled',
  args: {
    variant: 'text',
    children: 'Text button',
    disabled: true,
  },
}

export const Icon: Story = {
  name: 'Icon',
  args: {
    variant: 'icon',
    children: <X />,
  },
}

export const IconDisabled: Story = {
  name: 'Icon:disabled',
  args: {
    variant: 'icon',
    children: <X />,
    disabled: true,
  },
}

export const WithPrefixIcon: Story = {
  name: 'With Prefix Icon',
  args: {
    variant: 'primary',
    children: 'With Prefix',
    prefixIcon: <ArrowLeft size={20} />,
  },
}

export const WithPrefixIconSmall: Story = {
  name: 'With Prefix Icon Small',
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'With Prefix Small',
    prefixIcon: <ArrowLeft size={16} />,
  },
}

export const WithPrefixIconLarge: Story = {
  name: 'With Prefix Icon Large',
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'With Prefix Large',
    prefixIcon: <ArrowLeft size={24} />,
  },
}

export const WithPrefixIconDisabled: Story = {
  name: 'Disabled With Prefix Icon',
  args: {
    variant: 'primary',
    children: 'With Prefix Disabled',
    prefixIcon: <ArrowLeft size={20} />,
    disabled: true,
  },
}

export const WithPostfixIcon: Story = {
  name: 'With Postfix Icon',
  args: {
    variant: 'primary',
    children: 'With Postfix',
    postfixIcon: <Candy size={20} />,
  },
}

export const WithPrefixAndPostfixIcons: Story = {
  name: 'With Prefix and Postfix Icons',
  args: {
    variant: 'primary',
    children: 'With Prefix and Postfix',
    prefixIcon: <ArrowLeft size={20} />,
    postfixIcon: <Candy size={20} />,
  },
}

export const TextWithPrefixIcon: Story = {
  name: 'Text With Prefix Icon',
  args: {
    variant: 'text',
    children: 'Text With Prefix',
    prefixIcon: <ArrowLeft size={20} />,
  },
}

export const TextWithPrefixIconSmall: Story = {
  name: 'Text:sm With Prefix Icon',
  args: {
    variant: 'text',
    size: 'sm',
    children: 'Text With Prefix Small',
    prefixIcon: <ArrowLeft size={16} />,
  },
}

export const TextNoPadding: Story = {
  name: 'Text No Padding',
  args: {
    variant: 'text',
    spaceAround: 'none',
    children: 'Text No Padding',
  },
}
