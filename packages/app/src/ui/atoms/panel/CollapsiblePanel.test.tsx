import { act, fireEvent, render, screen } from '@testing-library/react'

import { expectRenderingError } from '@/test/integration/renderError'

import { CollapsiblePanel } from './CollapsiblePanel'

describe(CollapsiblePanel.displayName!, () => {
  it('renders correctly', async () => {
    render(
      <CollapsiblePanel>
        <CollapsiblePanel.Header>
          <CollapsiblePanel.Title>Hello!</CollapsiblePanel.Title>
        </CollapsiblePanel.Header>
        <CollapsiblePanel.Content>Content</CollapsiblePanel.Content>
      </CollapsiblePanel>,
    )

    expect(await screen.findByText('Hello!')).toBeVisible()
    expect(await screen.findByText('Content')).toBeVisible()
  })

  it('closes', async () => {
    render(
      <CollapsiblePanel>
        <CollapsiblePanel.Header>
          <CollapsiblePanel.Title>Hello!</CollapsiblePanel.Title>
        </CollapsiblePanel.Header>
        <CollapsiblePanel.Content>Content</CollapsiblePanel.Content>
      </CollapsiblePanel>,
    )

    act(() => {
      fireEvent.click(screen.getByRole('switch'))
    })
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('throws on missing header', async () => {
    expectRenderingError(
      <CollapsiblePanel>
        <CollapsiblePanel.Title>Hello!</CollapsiblePanel.Title>
        <CollapsiblePanel.Content>Content</CollapsiblePanel.Content>
      </CollapsiblePanel>,
      'CollapsiblePanel.Header must be the first child of CollapsiblePanel',
    )
  })

  it('throws on missing content', async () => {
    expectRenderingError(
      <CollapsiblePanel>
        <CollapsiblePanel.Header>
          <CollapsiblePanel.Title>Hello!</CollapsiblePanel.Title>
        </CollapsiblePanel.Header>
        Content
      </CollapsiblePanel>,
      'CollapsiblePanel.Content must be the second child of CollapsiblePanel',
    )
  })
})
