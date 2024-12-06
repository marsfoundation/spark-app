import { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'
import { MenuItem } from '../new/menu-item/MenuItem'
import { Link } from './Link'

const meta: Meta<typeof Link> = {
  decorators: [withRouter()],
  title: 'Components/Atoms/new/Link',
  component: Link,
}

export default meta
type Story = StoryObj<typeof Link>

export const Primary: Story = {
  render: () => (
    <div className="typography-body-4">
      Lorem ipsum dolor sit amend{' '}
      <Link to="" variant="primary">
        consectetur
      </Link>{' '}
      adipiscing elit.
    </div>
  ),
}

export const Secondary: Story = {
  render: () => (
    <div className="typography-body-4">
      Lorem ipsum dolor sit amend{' '}
      <Link to="" variant="secondary">
        consectetur
      </Link>{' '}
      adipiscing elit.
    </div>
  ),
}

export const Underline: Story = {
  render: () => (
    <div className="typography-body-4 text-system-success-primary">
      Lorem ipsum dolor sit amend{' '}
      <Link to="" variant="underline">
        consectetur
      </Link>{' '}
      adipiscing elit.
    </div>
  ),
}

export const External: Story = {
  render: () => (
    <div className="typography-body-4">
      Lorem ipsum dolor sit amend{' '}
      <Link to="https://app.spark.fi" variant="secondary" external>
        consectetur
      </Link>{' '}
      adipiscing elit.
    </div>
  ),
}

export const MergedIntoLink: Story = {
  render: () => (
    <MenuItem asChild className="w-28 cursor-pointer justify-center">
      <Link to="" variant="unstyled">
        Menu Item
      </Link>
    </MenuItem>
  ),
}
