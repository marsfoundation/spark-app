import { Token } from '@/domain/types/Token'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { cn } from '@/ui/utils/style'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

interface AccountNavigationItem {
  token: Token
  deposited: NormalizedUnitNumber
  active: boolean
  onClick: () => void
}

export interface AccountsNavigationProps {
  accounts: AccountNavigationItem[]
}

export function AccountsNavigation({ accounts }: AccountsNavigationProps) {
  return (
    <div className="flex gap-2 sm:flex-col">
      {accounts.map((account) => (
        <NavigationItem key={account.token.symbol} {...account} />
      ))}
    </div>
  )
}

function NavigationItem({ token, deposited, active, onClick }: AccountNavigationItem) {
  const transitionStyles = cn('transition-all duration-200 ease-in-out')

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative size-28 flex-shrink-0 rounded-[10px] border border-primary bg-white shadow-xs sm:h-16 sm:w-full',
        'hover:border-secondary hover:shadow-sm',
        'focus-visible:bg-primary focus-visible:text-neutral-950',
        'focus-visible:outline-none focus-visible:ring focus-visible:ring-primary-200 focus-visible:ring-offset-0',
        active && 'w-36 border-savings-600 hover:border-savings-500 sm:h-28 sm:w-full',
        transitionStyles,
      )}
    >
      <TokenIcon
        token={token}
        className={cn(
          'sm:-translate-y-1/2 -translate-y-10 absolute size-6 translate-x-4',
          active && 'sm:-translate-y-10 size-8',
          transitionStyles,
        )}
      />
      <div
        className={cn(
          'sm:-translate-y-1/2 absolute flex translate-x-4 flex-col items-start gap-0.5 sm:translate-x-[52px]',
          deposited.eq(0) ? 'translate-y-6' : 'translate-y-2',
          active && cn('sm:translate-x-4', deposited.eq(0) ? 'sm:translate-y-6' : 'sm:translate-y-2'),
          transitionStyles,
        )}
      >
        <div className="typography-label-3 text-primary">{token.symbol}</div>
        {deposited.gt(0) && (
          <div className="typography-label-4 text-secondary">
            <span className="hidden sm:inline">{token.formatUSD(deposited)}</span>
            <span className="sm:hidden">{token.formatUSD(deposited, { compact: true })}</span>
          </div>
        )}
      </div>
    </button>
  )
}
