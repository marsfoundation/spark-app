import { Controller, UseFormReturn } from 'react-hook-form'
import { ReceiverFormSchema } from '../../types'
import { AddressInput } from './AddressInput'

interface ControlledAddressInputProps {
  form: UseFormReturn<ReceiverFormSchema>
  blockExplorerUrl: string | undefined
}

export function ControlledAddressInput({ form, blockExplorerUrl }: ControlledAddressInputProps) {
  return (
    <Controller
      control={form.control}
      name="receiver"
      render={({ field }) => (
        <AddressInput {...field} error={form.formState.errors.receiver?.message} blockExplorerUrl={blockExplorerUrl} />
      )}
    />
  )
}
