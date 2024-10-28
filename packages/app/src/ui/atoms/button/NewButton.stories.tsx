import type { Meta, StoryObj } from '@storybook/react'
import { ChevronRightIcon, PlusIcon } from 'lucide-react'
import { Button, ButtonProps } from './NewButton'

const meta: Meta<typeof Button> = {
  title: 'Components/Atoms/NewButton',
  component: Button,
}

export default meta
type Story = StoryObj<typeof Button>

export const Buttons: Story = {
  render: () => {
    const buttonProps: ButtonProps = {
      children: 'Button',
      prefixIcon: PlusIcon,
      postfixIcon: ChevronRightIcon,
    }

    return (
      <div className="grid w-fit grid-cols-6 justify-items-start gap-x-12 gap-y-4">
        <Button variant="primary" size="l" {...buttonProps} />
        <Button variant="primary" size="l" id="primary_l_focused" {...buttonProps} />
        <Button variant="primary" size="l" id="primary_l_hovered" {...buttonProps} />
        <Button variant="primary" size="l" id="primary_l_pressed" {...buttonProps} />
        <Button variant="primary" size="l" disabled {...buttonProps} />
        <Button variant="primary" size="l" loading {...buttonProps} />

        <Button variant="primary" size="m" {...buttonProps} />
        <Button variant="primary" size="m" id="primary_l_focused" {...buttonProps} />
        <Button variant="primary" size="m" id="primary_l_hovered" {...buttonProps} />
        <Button variant="primary" size="m" id="primary_l_pressed" {...buttonProps} />
        <Button variant="primary" size="m" disabled {...buttonProps} />
        <Button variant="primary" size="m" loading {...buttonProps} />

        <Button variant="primary" size="s" {...buttonProps} />
        <Button variant="primary" size="s" id="primary_l_focused" {...buttonProps} />
        <Button variant="primary" size="s" id="primary_l_hovered" {...buttonProps} />
        <Button variant="primary" size="s" id="primary_l_pressed" {...buttonProps} />
        <Button variant="primary" size="s" disabled {...buttonProps} />
        <Button variant="primary" size="s" loading {...buttonProps} />

        <Button variant="secondary" size="l" {...buttonProps} />
        <Button variant="secondary" size="l" id="primary_l_focused" {...buttonProps} />
        <Button variant="secondary" size="l" id="primary_l_hovered" {...buttonProps} />
        <Button variant="secondary" size="l" id="primary_l_pressed" {...buttonProps} />
        <Button variant="secondary" size="l" disabled {...buttonProps} />
        <Button variant="secondary" size="l" loading {...buttonProps} />

        <Button variant="secondary" size="m" {...buttonProps} />
        <Button variant="secondary" size="m" id="primary_l_focused" {...buttonProps} />
        <Button variant="secondary" size="m" id="primary_l_hovered" {...buttonProps} />
        <Button variant="secondary" size="m" id="primary_l_pressed" {...buttonProps} />
        <Button variant="secondary" size="m" disabled {...buttonProps} />
        <Button variant="secondary" size="m" loading {...buttonProps} />

        <Button variant="secondary" size="s" {...buttonProps} />
        <Button variant="secondary" size="s" id="primary_l_focused" {...buttonProps} />
        <Button variant="secondary" size="s" id="primary_l_hovered" {...buttonProps} />
        <Button variant="secondary" size="s" id="primary_l_pressed" {...buttonProps} />
        <Button variant="secondary" size="s" disabled {...buttonProps} />
        <Button variant="secondary" size="s" loading {...buttonProps} />

        <Button variant="tertiary" size="l" {...buttonProps} />
        <Button variant="tertiary" size="l" id="primary_l_focused" {...buttonProps} />
        <Button variant="tertiary" size="l" id="primary_l_hovered" {...buttonProps} />
        <Button variant="tertiary" size="l" id="primary_l_pressed" {...buttonProps} />
        <Button variant="tertiary" size="l" disabled {...buttonProps} />
        <Button variant="tertiary" size="l" loading {...buttonProps} />

        <Button variant="tertiary" size="m" {...buttonProps} />
        <Button variant="tertiary" size="m" id="primary_l_focused" {...buttonProps} />
        <Button variant="tertiary" size="m" id="primary_l_hovered" {...buttonProps} />
        <Button variant="tertiary" size="m" id="primary_l_pressed" {...buttonProps} />
        <Button variant="tertiary" size="m" disabled {...buttonProps} />
        <Button variant="tertiary" size="m" loading {...buttonProps} />

        <Button variant="tertiary" size="s" {...buttonProps} />
        <Button variant="tertiary" size="s" id="primary_l_focused" {...buttonProps} />
        <Button variant="tertiary" size="s" id="primary_l_hovered" {...buttonProps} />
        <Button variant="tertiary" size="s" id="primary_l_pressed" {...buttonProps} />
        <Button variant="tertiary" size="s" disabled {...buttonProps} />
        <Button variant="tertiary" size="s" loading {...buttonProps} />
      </div>
    )
  },
  parameters: {
    pseudo: {
      hover: ['#primary_l_hovered', '#primary_m_hovered', '#primary_s_hovered'],
      focusVisible: ['#primary_l_focused', '#primary_m_focused', '#primary_s_focused'],
      active: ['#primary_l_pressed', '#primary_m_pressed', '#primary_s_pressed'],
    },
  },
}
