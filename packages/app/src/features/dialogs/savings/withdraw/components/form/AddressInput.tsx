import { cn } from '@/ui/utils/style'
import { InputHTMLAttributes, forwardRef } from 'react'

interface AddressInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(({ error, ...rest }, ref) => {
  return (
    <div
      className={cn(
        'relative flex border-basics-border text-basics-dark-grey',
        'w-full flex-grow items-center rounded-xl border text-sm sm:text-base',
        error && 'border-error bg-error/10 text-error',
      )}
    >
      <input
        className={cn('flex h-full w-full rounded-xl pl-3 sm:pl-4', error && 'outline-error')}
        maxLength={42}
        ref={ref}
        placeholder="Receiver address"
        type="text"
        inputMode="text"
        {...rest}
      />
    </div>
  )
})
AddressInput.displayName = 'AddressInput'
