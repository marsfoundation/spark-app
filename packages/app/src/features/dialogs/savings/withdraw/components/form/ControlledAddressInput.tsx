import { Controller, UseFormReturn } from 'react-hook-form'
import { AddressInput } from './AddressInput'

interface ControlledAddressInputProps {
  form: UseFormReturn<ReceiverFormSchema>
}

export function ControlledAddressInput({ form }: ControlledAddressInputProps) {
  return (
    <Controller
      control={form.control}
      name="receiver"
      render={({ field }) => (
        <AddressInput
          {...field}
          value={field.value}
          error={form.formState.errors.receiver?.message}
          onChange={field.onChange}
        />
      )}
    />
  )
}
