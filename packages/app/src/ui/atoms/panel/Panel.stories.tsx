import { StoryGrid } from '@sb/components/StoryGrid'
import type { Meta, StoryObj } from '@storybook/react'
import { NutIcon, SquirrelIcon } from 'lucide-react'
import { Fragment } from 'react'
import { Panel } from './Panel'

const variants = ['primary', 'secondary', 'tertiary', 'quaternary'] as const
const spacings = ['none', 'xs', 's', 'm'] as const

type Variant = (typeof variants)[number]
type Spacing = (typeof spacings)[number]

function PanelExample({ variant, spacing }: { variant: Variant; spacing: Spacing }) {
  return (
    <Panel variant={variant} spacing={spacing} className="flex flex-col gap-2">
      <div className="typography-heading-5">{variant}</div>
      <div className="flex items-end gap-0.5">
        <SquirrelIcon className="icon-md" />
        <NutIcon className="icon-sm" />
      </div>
    </Panel>
  )
}

const meta: Meta<typeof Panel> = {
  title: 'Components/Atoms/Panel',
  component: () => (
    <StoryGrid className="grid-cols-5 bg-transparent">
      <div />
      {variants.map((variant) => (
        <StoryGrid.Label key={variant}>{variant}</StoryGrid.Label>
      ))}

      {spacings.map((spacing) => (
        <Fragment key={spacing}>
          <StoryGrid.Label>spacing {spacing}</StoryGrid.Label>
          {variants.map((variant) => (
            <PanelExample key={`${variant}-${spacing}`} variant={variant} spacing={spacing} />
          ))}
        </Fragment>
      ))}
    </StoryGrid>
  ),
}

export default meta
type Story = StoryObj<typeof Panel>

export const Default: Story = {}
