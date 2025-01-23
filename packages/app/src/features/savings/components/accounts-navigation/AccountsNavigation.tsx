import { Token } from '@/domain/types/Token'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { cn } from '@/ui/utils/style'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export interface AccountsNavigationProps {
  accounts: {
    token: Token
    deposit: NormalizedUnitNumber
    active: boolean
    onClick: () => void
  }[]
}

export function AccountsNavigation({ accounts }: AccountsNavigationProps) {
  return (
    <div className="flex flex-col gap-2">
      {accounts.map((account) => (
        <NavigationItem key={account.token.symbol} {...account} />
      ))}
    </div>
  )
}

export interface NavigationItemProps {
  token: Token
  deposit: NormalizedUnitNumber
  active: boolean
  onClick: () => void
}

function NavigationItem({ token, deposit, active, onClick }: NavigationItemProps) {
  const transitionStyles = 'transition-all duration-200 ease-in-out'

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative h-16 rounded-[10px] border border-primary bg-white shadow-xs',
        'hover:border-secondary hover:shadow-sm',
        'focus-visible:bg-primary focus-visible:text-neutral-950',
        'focus-visible:outline-none focus-visible:ring focus-visible:ring-primary-200 focus-visible:ring-offset-0',
        active && 'h-28 border-savings-600 hover:border-savings-500',
        transitionStyles,
      )}
    >
      <TokenIcon
        token={token}
        className={cn(
          '-translate-y-1/2 absolute size-6 translate-x-4',
          active && '-translate-y-10 size-8',
          transitionStyles,
        )}
      />
      <div
        className={cn(
          '-translate-y-1/2 absolute flex translate-x-[52px] flex-col items-start gap-0.5',
          active && `translate-x-4 ${deposit.eq(0) ? 'translate-y-6' : 'translate-y-2'}`,
          transitionStyles,
        )}
      >
        <div className="typography-label-3 text-primary">{token.symbol}</div>
        {deposit.gt(0) && <div className="typography-label-4 text-secondary">{token.formatUSD(deposit)}</div>}
      </div>
    </button>
  )
}
