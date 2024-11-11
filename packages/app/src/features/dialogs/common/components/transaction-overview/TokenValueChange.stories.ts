import { WithClassname } from '@sb/decorators'
import { Meta, StoryObj } from '@storybook/react'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { TokenValueChange } from './TokenValueChange'

const meta: Meta<typeof TokenValueChange> = {
  title: 'Features/Dialogs/Components/TokenValueChange',
  component: TokenValueChange,
  decorators: [WithClassname('max-w-sm')],
}

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  args: {
    token: tokens.DAI,
    label: 'DAI change',
    currentValue: NormalizedUnitNumber(100),
    updatedValue: NormalizedUnitNumber(200),
  },
}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
