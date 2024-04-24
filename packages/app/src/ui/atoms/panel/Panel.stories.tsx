import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { Banana } from 'lucide-react'

import { Panel } from './Panel'

const meta: Meta<typeof Panel> = {
  title: 'Components/Atoms/Panel',
  args: {},
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Default',
  render: () => {
    return (
      <Panel>
        <Panel.Header>
          <Panel.Title>Title</Panel.Title>
        </Panel.Header>
        <Panel.Content>Content</Panel.Content>
      </Panel>
    )
  },
}

export const Mobile = getMobileStory(Default)
export const Tablet = getTabletStory(Default)

export const WithExtraHeaderContent: Story = {
  name: 'With extra header content',
  render: () => {
    return (
      <Panel>
        <Panel.Header>
          <Panel.Title>Title</Panel.Title>
          <Banana size={16} />
        </Panel.Header>
        <Panel.Content>Content</Panel.Content>
      </Panel>
    )
  },
}

export const AsCard: Story = {
  name: 'As Card',
  render: () => {
    return <Panel.Wrapper>Any content</Panel.Wrapper>
  },
}

export const AsGreenCard: Story = {
  name: 'As Green Card',
  render: () => {
    return <Panel.Wrapper variant="green">Any content</Panel.Wrapper>
  },
}

export const Collapsible: Story = {
  name: 'Collapsible',
  render: () => {
    return (
      <Panel collapsibleOptions={{ collapsible: true }}>
        <Panel.Header>
          <Panel.Title>Title</Panel.Title>
        </Panel.Header>
        <Panel.Content>Content</Panel.Content>
      </Panel>
    )
  },
}

export const CollapsibleClosed: Story = {
  name: 'Collapsible Closed',
  render: () => {
    return (
      <Panel collapsibleOptions={{ collapsible: true, defaultOpen: false }}>
        <Panel.Header>
          <Panel.Title>Title</Panel.Title>
        </Panel.Header>
        <Panel.Content>Content</Panel.Content>
      </Panel>
    )
  },
}

export const CollapsibleMobile = getMobileStory(Collapsible)
export const CollapsibleTablet = getTabletStory(Collapsible)

export const CollapsibleAboveMobileBreakpoint: Story = {
  name: 'Collapsible Above Mobile Breakpoint',
  render: () => {
    return (
      <Panel collapsibleOptions={{ collapsible: true, collapsibleAbove: 'sm' }}>
        <Panel.Header>
          <Panel.Title>Title</Panel.Title>
        </Panel.Header>
        <Panel.Content>Content</Panel.Content>
      </Panel>
    )
  },
}

export const GreenAccent: Story = {
  name: 'Default',
  render: () => {
    return (
      <Panel>
        <Panel.Header>
          <Panel.Title>Title</Panel.Title>
        </Panel.Header>
        <Panel.Content>Content</Panel.Content>
      </Panel>
    )
  },
}
