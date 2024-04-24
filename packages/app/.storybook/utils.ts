import { StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import { ByRoleMatcher } from '@testing-library/react'

export function getHoveredStory<T>(story: StoryObj<T>, role: ByRoleMatcher): StoryObj<T> {
  return {
    ...story,
    play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
      await userEvent.hover(await within(canvasElement).findByRole(role))
    },
  }
}

export const fakeBigInt = 0 as any as bigint // @note: storybook does not support BigInt
