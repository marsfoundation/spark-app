import { StoryObj } from '@storybook/react'

export const chromatic = {
  mobile: 375,
  tablet: 760,
} as const

export function getMobileStory<T>(story: StoryObj<T>): StoryObj<T> {
  return {
    ...story,
    parameters: {
      viewport: {
        defaultViewport: 'mobile',
      },
      chromatic: {
        viewports: [chromatic.mobile],
        delay: 300, // Some components use hook for media queries, and chromatic might take a screenshot to early
      },
    },
  }
}

export function getTabletStory<T>(story: StoryObj<T>): StoryObj<T> {
  return {
    ...story,
    parameters: {
      viewport: {
        defaultViewport: 'tablet',
      },
      chromatic: {
        viewports: [chromatic.tablet],
        delay: 300,
      },
    },
  }
}
