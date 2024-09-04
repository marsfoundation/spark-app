import { Meta, StoryObj } from '@storybook/react'
import { KeyPoints } from './KeyPoints'

const meta: Meta<typeof KeyPoints> = {
  title: 'Components/Atoms/KeyPoints',
}

export default meta
type Story = StoryObj<typeof meta>

export const Positive: Story = {
  render: () => (
    <KeyPoints>
      <KeyPoints.Item variant="positive">nice weather</KeyPoints.Item>
      <KeyPoints.Item variant="positive">good drinks</KeyPoints.Item>
      <KeyPoints.Item variant="positive">tasty food</KeyPoints.Item>
    </KeyPoints>
  ),
}

export const Negative: Story = {
  render: () => (
    <KeyPoints>
      <KeyPoints.Item variant="negative">bad weather</KeyPoints.Item>
      <KeyPoints.Item variant="negative">bad drinks</KeyPoints.Item>
      <KeyPoints.Item variant="negative">nasty food</KeyPoints.Item>
    </KeyPoints>
  ),
}
