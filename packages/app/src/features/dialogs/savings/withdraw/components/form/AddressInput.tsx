import { ButtonIcon } from '@/ui/atoms/button/Button'
import { LinkButton } from '@/ui/atoms/link-button/LinkButton'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { SquareArrowOutUpRight } from 'lucide-react'
import { InputHTMLAttributes, forwardRef } from 'react'

interface AddressInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error: string | undefined
  blockExplorerUrl: string | undefined
  label?: string
}

export const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(
  ({ error, blockExplorerUrl, label, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && <div className="typography-label-5 text-secondary">{label}</div>}
        <div
          className={cn(
            'grid h-14 grid-cols-[1fr_auto] gap-2',
            'typography-label-6 sm:typography-label-4 text-primary',
            'rounded-sm border border-primary bg-secondary',
            'focus-within:border-brand-primary',
            'items-center rounded-sm px-3 sm:px-4',
            error && 'border-error-200 bg-system-error-primary',
          )}
        >
          <input
            className={cn('flex w-full focus:outline-none')}
            maxLength={42}
            ref={ref}
            placeholder="Receiver address"
            type="text"
            inputMode="text"
            data-testid={testIds.component.AddressInput.input}
            {...rest}
          />
          {blockExplorerUrl && (
            <LinkButton to={blockExplorerUrl} variant="transparent" size="s" className="h-fit rounded-[1px] p-0">
              <ButtonIcon icon={SquareArrowOutUpRight} />
            </LinkButton>
          )}
        </div>
        {error && (
          <div
            className="typography-label-6 text-system-error-primary"
            data-testid={testIds.component.AddressInput.error}
          >
            {error}
          </div>
        )}
      </div>
    )
  },
)
AddressInput.displayName = 'AddressInput'
