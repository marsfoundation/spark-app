import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

const meta: Meta = {
  title: 'Components/Atoms/Tabs',
  decorators: [],
}

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  render: () => {
    return (
      <Tabs defaultValue="first">
        <TabsList>
          <TabsTrigger value="first">First tab</TabsTrigger>
          <TabsTrigger value="second">Second tab</TabsTrigger>
        </TabsList>
        <TabsContent value="first">Content of the first tab.</TabsContent>
        <TabsContent value="second">Content of the second tab.</TabsContent>
      </Tabs>
    )
  },
}

export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const Small: Story = {
  render: () => {
    return (
      <Tabs defaultValue="first">
        <TabsList size="s">
          <TabsTrigger value="first">First tab</TabsTrigger>
          <TabsTrigger value="second">Second tab</TabsTrigger>
        </TabsList>
        <TabsContent value="first">Content of the first tab.</TabsContent>
        <TabsContent value="second">Content of the second tab.</TabsContent>
      </Tabs>
    )
  },
}

export const WithLongTab: Story = {
  render: () => {
    return (
      <Tabs defaultValue="first">
        <TabsList>
          <TabsTrigger value="first">First</TabsTrigger>
          <TabsTrigger value="second">Second</TabsTrigger>
          <TabsTrigger value="third">Third super looooooooooong tab</TabsTrigger>
        </TabsList>
        <TabsContent value="first">Content of the first tab.</TabsContent>
        <TabsContent value="second">Content of the second tab.</TabsContent>
        <TabsContent value="third">Content of the third tab.</TabsContent>
      </Tabs>
    )
  },
}
