import { tokens } from '@sb/tokens'
import type { Meta, StoryObj } from '@storybook/react'
import { FieldValues, useForm } from 'react-hook-form'

import { TokenWithBalance } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Form } from '@/ui/atoms/form/Form'

import { testIds } from '@/ui/utils/testIds'
import { expect, within } from '@storybook/test'
import { useEffect } from 'react'
import { AssetInput, AssetInputProps } from './AssetInput'

const assets: TokenWithBalance[] = [
  {
    token: tokens.ETH,
    balance: NormalizedUnitNumber('1'),
  },
  {
    token: tokens.DAI,
    balance: NormalizedUnitNumber('500'),
  },
  {
    token: tokens.wstETH,
    balance: NormalizedUnitNumber('7'),
  },
  {
    token: tokens.USDC,
    balance: NormalizedUnitNumber('300'),
  },
]

function AssetInputWrapper({ error, ...props }: AssetInputProps<FieldValues> & { error?: string }) {
  const form = useForm()
  useEffect(() => {
    if (error) {
      form.setError(props.fieldName, { message: error })
    }
  }, [form.setError, props.fieldName, error])

  return (
    <div className="max-w-[361px]">
      <Form {...form}>
        <AssetInput {...props} control={form.control} />
      </Form>
    </div>
  )
}

const meta: Meta<typeof AssetInputWrapper> = {
  title: 'Components/Organisms/New/AssetInput',
  component: AssetInputWrapper,
  args: {
    selectorAssets: assets,
    selectedAsset: assets[0],
    setSelectedAsset: () => {},
    maxValue: NormalizedUnitNumber('1000'),
    fieldName: 'name',
    maxSelectedFieldName: 'isMaxSelected',
  },
}

export default meta
type Story = StoryObj<typeof AssetInputWrapper>
export const Default: Story = {}
export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
export const Errored: Story = {
  args: {
    error: 'Provided value is incorrect',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const error = await canvas.findByTestId(testIds.component.AssetInput.error)
    await expect(error).toBeVisible()
  },
}
