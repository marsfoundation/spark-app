import { Meta, StoryObj } from '@storybook/react'

import { assets } from '@/ui/assets'
import { Sparkles } from './Sparkles'

const meta: Meta<typeof Sparkles> = {
  title: 'Components/Atoms/Sparkles',
  component: Sparkles,
}

export default meta
type Story = StoryObj<typeof Sparkles>

export const SparklesOnText: Story = {
  name: 'Sparkles on text',
  render: () => <Sparkles>Text</Sparkles>,
}

export const SparklesOnImage: Story = {
  name: 'Sparkles on image',
  render: () => (
    <Sparkles sizeRange={[8, 12]}>
      <img src={assets.token.eth} className="h-5 w-5" />
    </Sparkles>
  ),
}
