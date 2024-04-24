import { StoryObj } from '@storybook/react'

export const chromatic = {
  mobile: 375,
  tablet: 767,
} as const

export function getMobileStory<T>(story: StoryObj<T>): StoryObj<T> {
  return {
    ...story,
    parameters: {
      viewport: {
        defaultViewport: 'mobile',
      },
      chromatic: { viewports: [chromatic.mobile] },
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
      chromatic: { viewports: [chromatic.tablet] },
    },
  }
}
