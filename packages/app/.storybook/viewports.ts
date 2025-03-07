import { StoryObj } from '@storybook/react'

export const chromatic = {
  mobile: 375, // iPhone 6, iPhone SE
  tablet: 768, // iPad
} as const

export function getMobileStory<T>(story: StoryObj<T>): StoryObj<T> {
  return {
    ...story,
    globals: {
      viewport: {
        value: 'mobile',
      },
    },
    parameters: {
      chromatic: {
        viewports: [chromatic.mobile],
      },
    },
  }
}

export function getTabletStory<T>(story: StoryObj<T>): StoryObj<T> {
  return {
    ...story,
    globals: {
      viewport: {
        value: 'tablet',
      },
    },
    parameters: {
      chromatic: {
        viewports: [chromatic.tablet],
      },
    },
  }
}
