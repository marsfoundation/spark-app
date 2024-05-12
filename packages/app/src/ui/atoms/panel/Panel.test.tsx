import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'

import { expectRenderingError } from '@/test/integration/renderError'

import { Panel } from './Panel'

const queryClient = new QueryClient()

describe(Panel.name, () => {
  test('renders correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Panel>
          <Panel.Header>
            <Panel.Title>Hello!</Panel.Title>
          </Panel.Header>
          <Panel.Content>Content</Panel.Content>
        </Panel>
      </QueryClientProvider>,
    )

    expect(await screen.findByText('Hello!')).toBeVisible()
  })

  test('throws on missing header', async () => {
    expectRenderingError(
      <QueryClientProvider client={queryClient}>
        <Panel>
          <Panel.Title>Hello!</Panel.Title>
          <Panel.Content>Content</Panel.Content>
        </Panel>
      </QueryClientProvider>,
      'Invariant failed: Panel.Header must be the first child of Panel',
    )
  })

  test('throws on missing content', async () => {
    expectRenderingError(
      <QueryClientProvider client={queryClient}>
        <Panel>
          <Panel.Header>
            <Panel.Title>Hello!</Panel.Title>
          </Panel.Header>
          Content
        </Panel>
      </QueryClientProvider>,
      'Invariant failed: Panel.Content must be the second child of Panel',
    )
  })
})
