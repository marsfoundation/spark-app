import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { TokenSymbol } from '@/domain/types/TokenSymbol'

import { TokenBadge } from './TokenBadge'

const meta: Meta<typeof TokenBadge> = {
  title: 'Features/MarketDetails/Components/StatusPanel/Components/TokenBadge',
  component: TokenBadge,
}

export default meta
type Story = StoryObj<typeof TokenBadge>

export const DaiDesktop: Story = {
  name: 'DAI Desktop',
  args: {
    symbol: TokenSymbol('DAI'),
  },
}
export const DaiMobile = {
  ...getMobileStory(DaiDesktop),
  name: 'DAI Mobile',
}
export const DaiTablet = {
  ...getTabletStory(DaiDesktop),
  name: 'DAI Tablet',
}

export const sDaiDesktop: Story = {
  name: 'sDAI Desktop',
  args: {
    symbol: TokenSymbol('sDAI'),
  },
}
export const sDaiMobile = {
  ...getMobileStory(sDaiDesktop),
  name: 'sDAI Mobile',
}
export const sDaiTablet = {
  ...getTabletStory(sDaiDesktop),
  name: 'sDAI Tablet',
}

export const OtherTokenDesktop: Story = {
  name: 'Other Token Desktop',
  args: {
    symbol: TokenSymbol('OTHER'),
  },
}
export const OtherTokenMobile = {
  ...getMobileStory(OtherTokenDesktop),
  name: 'Other Token Mobile',
}
export const OtherTokenTablet = {
  ...getTabletStory(OtherTokenDesktop),
  name: 'Other Token Tablet',
}
