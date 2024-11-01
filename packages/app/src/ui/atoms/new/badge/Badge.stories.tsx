import { StoryGrid } from '@sb/components/StoryGrid'
import type { Meta, StoryObj } from '@storybook/react'
import { MagnetIcon, SkullIcon } from 'lucide-react'
import { Fragment } from 'react'
import { Badge, BadgeIcon } from './Badge'

const variants = ['success', 'warning', 'error', 'neutral'] as const
const sizes = ['xs', 'sm'] as const
const appearances = ['soft', 'solid'] as const

const BadgeExample = ({
  appearance,
  size,
  variant,
}: {
  appearance: (typeof appearances)[number]
  size: (typeof sizes)[number]
  variant: (typeof variants)[number]
}) => (
  <Badge appearance={appearance} size={size} variant={variant}>
    <BadgeIcon icon={MagnetIcon} />
    Badge
    <BadgeIcon icon={SkullIcon} />
  </Badge>
)

const meta: Meta<typeof Badge> = {
  title: 'Components/Atoms/New/Badge',
  args: {
    children: 'Badge',
  },
  component: () => (
    <StoryGrid className="grid-cols-5">
      <div />
      {variants.map((variant) => (
        <StoryGrid.Label key={variant}>{variant}</StoryGrid.Label>
      ))}

      {appearances.map((appearance) =>
        sizes.map((size) => (
          <Fragment key={`${appearance}-${size}`}>
            <StoryGrid.Label>
              {appearance} {size.toUpperCase()}
            </StoryGrid.Label>
            {variants.map((variant) => (
              <BadgeExample
                key={`${appearance}-${size}-${variant}`}
                appearance={appearance}
                size={size}
                variant={variant}
              />
            ))}
          </Fragment>
        )),
      )}
    </StoryGrid>
  ),
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {}
