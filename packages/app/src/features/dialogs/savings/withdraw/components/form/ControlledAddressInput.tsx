import { UseFormReturn, useController } from 'react-hook-form'
import { ReceiverFormSchema } from '../../types'
import { AddressInput } from './AddressInput'

interface ControlledAddressInputProps {
  label?: string
  form: UseFormReturn<ReceiverFormSchema>
  blockExplorerUrl: string | undefined
}

export function ControlledAddressInput({ label, form, blockExplorerUrl }: ControlledAddressInputProps) {
  const { field } = useController({ control: form.control, name: 'receiver' })
  return (
    <AddressInput
      {...field}
      label={label}
      error={form.formState.errors.receiver?.message}
      blockExplorerUrl={blockExplorerUrl}
    />
  )
}
