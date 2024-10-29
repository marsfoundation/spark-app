import { WithClassname } from '@storybook-config/decorators'
import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

const meta: Meta = {
  title: 'Components/Atoms/Tabs',
  decorators: [WithClassname('max-w-6xl')],
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
