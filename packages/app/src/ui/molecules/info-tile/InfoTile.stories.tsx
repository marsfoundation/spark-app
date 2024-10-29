import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { InfoTile } from './InfoTile'

const meta: Meta<typeof InfoTile> = {
  title: 'Components/Molecules/InfoTile',
  component: InfoTile,
}

export default meta
type Story = StoryObj<typeof InfoTile>

export const Default: Story = {
  name: 'Default',
  render: () => {
    return (
      <InfoTile>
        <InfoTile.Label>Total supplied</InfoTile.Label>
        <InfoTile.Value>167.37M</InfoTile.Value>
        <InfoTile.ComplementaryLine>of $375.39M</InfoTile.ComplementaryLine>
      </InfoTile>
    )
  },
}

export const WithoutComplementaryLine: Story = {
  name: 'Without Complementary Line',
  render: () => {
    return (
      <InfoTile>
        <InfoTile.Label>Total supplied</InfoTile.Label>
        <InfoTile.Value>167.37M</InfoTile.Value>
      </InfoTile>
    )
  },
}

export const Mobile = getMobileStory(Default)
export const Tablet = getTabletStory(Default)
