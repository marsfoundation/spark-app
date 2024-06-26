import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Form } from '@/ui/atoms/form/Form'
import { testIds } from '@/ui/utils/testIds'
import { zodResolver } from '@hookform/resolvers/zod'
import { tokens } from '@storybook/tokens'
import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, test } from 'vitest'
import { z } from 'zod'
import { ControlledMultiSelectorAssetInput } from './MultiSelector'

const VALIDATION_ERROR = 'Value must be a valid number'

const FormInputSchema = z
  .object({
    value: z.string(),
    isMaxSelected: z.boolean(),
  })
  .superRefine((field, ctx) => {
    if (field.isMaxSelected) {
      return
    }

    const isValidNumber = !Number.isNaN(Number.parseFloat(field.value))
    if (!isValidNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_ERROR,
        path: ['value'],
      })
    }
  })

interface ControlledMultiSelectorAssetInputTestWrapperProps {
  max?: NormalizedUnitNumber
}

function ControlledMultiSelectorAssetInputTestWrapper({ max }: ControlledMultiSelectorAssetInputTestWrapperProps) {
  const token = tokens.DAI

  const form = useForm<z.infer<typeof FormInputSchema>>({
    resolver: zodResolver(FormInputSchema),
    defaultValues: {
      value: '',
      isMaxSelected: false,
    },
    mode: 'onChange',
  })

  const _ = form.formState.errors // error does not appear without this line

  return (
    <Form {...form}>
      <ControlledMultiSelectorAssetInput
        control={form.control}
        fieldName="value"
        token={token}
        maxSelectedFieldName="isMaxSelected"
        max={max}
      />
    </Form>
  )
}

describe(ControlledMultiSelectorAssetInput.name, () => {
  test('Changes value in input', async () => {
    const value = NormalizedUnitNumber(12345)

    const { getByRole } = render(<ControlledMultiSelectorAssetInputTestWrapper />)

    await waitFor(() => expect(getByRole('textbox')).toHaveValue(''))
    fillInput(getByRole('textbox'), value.toFixed())
    await waitFor(() => expect(getByRole('textbox')).toHaveValue(value.toFixed()))
  })

  test('Validation fails if input value is erased', async () => {
    const value = NormalizedUnitNumber(12345)

    const { getByRole, getByTestId } = render(<ControlledMultiSelectorAssetInputTestWrapper />)

    fillInput(getByRole('textbox'), value.toFixed())
    await waitFor(() => expect(getByRole('textbox')).toHaveValue(value.toFixed()))

    fillInput(getByRole('textbox'), '')
    await waitFor(() => expect(getByRole('textbox')).toHaveValue(''))
    await waitFor(() => expect(getByTestId(testIds.component.AssetInput.error)).toHaveTextContent(VALIDATION_ERROR))
  })

  test('Unable to put non-number input', async () => {
    const value = NormalizedUnitNumber(12345)

    const { getByRole, queryByTestId } = render(<ControlledMultiSelectorAssetInputTestWrapper />)

    fillInput(getByRole('textbox'), value.toFixed())
    await waitFor(() => expect(getByRole('textbox')).toHaveValue(value.toFixed()))

    fillInput(getByRole('textbox'), 'NOTANUMBER')
    await waitFor(() => expect(getByRole('textbox')).toHaveValue(value.toFixed()))
    await waitFor(() => expect(queryByTestId(testIds.component.AssetInput.error)).toBeNull())
  })

  test('Sets input value to MAX if max value is not provided', async () => {
    const { getByRole } = render(<ControlledMultiSelectorAssetInputTestWrapper />)

    act(() => getByRole('button', { name: 'MAX' }).click())
    await waitFor(() => expect(getByRole('textbox')).toHaveValue('MAX'))
  })

  test('Sets input value to max value if it is provided', async () => {
    const max = NormalizedUnitNumber(1234)

    const { getByRole } = render(<ControlledMultiSelectorAssetInputTestWrapper max={max} />)

    act(() => getByRole('button', { name: 'MAX' }).click())
    await waitFor(() => expect(getByRole('textbox')).toHaveValue(max.toFixed()))
  })

  test('Unclicks max', async () => {
    const { getByRole } = render(<ControlledMultiSelectorAssetInputTestWrapper />)

    act(() => getByRole('button', { name: 'MAX' }).click())
    await waitFor(() => expect(getByRole('textbox')).toHaveValue('MAX'))

    act(() => getByRole('button', { name: 'MAX' }).click())
    await waitFor(() => expect(getByRole('textbox')).toHaveValue(''))
  })

  test('Erases MAX if backspace is pressed', async () => {
    const { getByRole } = render(<ControlledMultiSelectorAssetInputTestWrapper />)

    act(() => getByRole('button', { name: 'MAX' }).click())
    await waitFor(() => expect(getByRole('textbox')).toHaveValue('MAX'))

    fillInput(getByRole('textbox'), 'MA') // simulates pressing backspace
    await waitFor(() => expect(getByRole('textbox')).toHaveValue(''))
  })

  test('Unable to input number if MAX is displayed', async () => {
    const { getByRole, queryByTestId } = render(<ControlledMultiSelectorAssetInputTestWrapper />)

    act(() => getByRole('button', { name: 'MAX' }).click())
    await waitFor(() => expect(getByRole('textbox')).toHaveValue('MAX'))

    fillInput(getByRole('textbox'), 'MAX1') // simulates typing character after MAX
    await waitFor(() => expect(getByRole('textbox')).toHaveValue('MAX'))
    await waitFor(() => expect(queryByTestId(testIds.component.AssetInput.error)).toBeNull())
  })

  test('Clicking MAX triggers revalidation', async () => {
    const value = NormalizedUnitNumber(12345)

    const { getByRole, getByTestId, queryByTestId } = render(<ControlledMultiSelectorAssetInputTestWrapper />)

    await waitFor(() => expect(getByRole('textbox')).toHaveValue(''))
    fillInput(getByRole('textbox'), value.toFixed())
    await waitFor(() => expect(getByRole('textbox')).toHaveValue(value.toFixed()))

    fillInput(getByRole('textbox'), '')
    await waitFor(() => expect(getByRole('textbox')).toHaveValue(''))
    await waitFor(() => expect(getByTestId(testIds.component.AssetInput.error)).toHaveTextContent(VALIDATION_ERROR))

    act(() => getByRole('button', { name: 'MAX' }).click())
    // fillInput(getByRole('textbox'), '1')
    await waitFor(() => expect(getByRole('textbox')).toHaveValue('MAX'))
    await waitFor(() => expect(queryByTestId(testIds.component.AssetInput.error)).toBeNull())
  })
})

function fillInput(input: HTMLElement, value: string): void {
  fireEvent.focusIn(input)
  fireEvent.change(input, { target: { value } })
  fireEvent.focusOut(input)
}
