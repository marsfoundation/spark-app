import BoxArrowTopRight from '@/ui/assets/box-arrow-top-right.svg?react'
import { Link } from '@/ui/atoms/link/Link'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { InputHTMLAttributes, forwardRef } from 'react'

interface AddressInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error: string | undefined
  blockExplorerUrl: string | undefined
}

export const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(
  ({ error, blockExplorerUrl, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <div
          className={cn(
            'relative flex h-14 border-basics-border bg-input-background text-basics-dark-grey',
            'w-full flex-grow items-center rounded-xl border text-[0.7rem] leading-none sm:text-base',
            error && 'border-error bg-error/10 text-error',
          )}
        >
          <input
            className={cn('flex h-full w-full rounded-xl pl-3 sm:pl-4 focus:outline-none', error && 'outline-error')}
            maxLength={42}
            ref={ref}
            placeholder="Receiver address"
            type="text"
            inputMode="text"
            data-testid={testIds.component.AddressInput.input}
            {...rest}
          />
          {blockExplorerUrl && (
            <div className="absolute right-0 mr-3 sm:mr-4">
              <Link
                to={blockExplorerUrl}
                external
                className="flex items-center gap-2.5 font-medium text-basics-dark-grey text-sm"
              >
                <BoxArrowTopRight className={cn('h-4 w-4', error && 'text-error')} />
              </Link>
            </div>
          )}
        </div>
        {error && (
          <div className="text-error text-xs" data-testid={testIds.component.AddressInput.error}>
            {error}
          </div>
        )}
      </div>
    )
  },
)
AddressInput.displayName = 'AddressInput'
