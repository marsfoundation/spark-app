import { paths } from '@/config/paths'
import { usePageChainId } from '@/domain/hooks/usePageChainId'
import { cn } from '@/ui/utils/style'
import { Slot } from '@radix-ui/react-slot'
import { ArrowUpRightIcon, XIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { IconButton } from '../icon-button/IconButton'
import { LinkDecorator } from '../link-decorator/LinkDecorator'

interface SavingsAccountsTopBannerProps {
  onClose: () => void
  className?: string
}

export const SAVINGS_ACCOUNTS_TOP_BANNER_ID = 'savings-accounts-top-banner'

export function SavingsAccountsTopBanner({ onClose, className }: SavingsAccountsTopBannerProps) {
  const { activePathGroup } = usePageChainId()
  const isOnSavingsPage = activePathGroup === 'savings'
  const Wrapper = !isOnSavingsPage
    ? ({ children }: { children: ReactNode }) => <LinkDecorator to={paths.savings}>{children}</LinkDecorator>
    : Slot

  return (
    <Wrapper>
      <div
        className={cn(
          'relative z-10 flex w-full flex-col items-center justify-center',
          'min-h-10 p-2.5 text-center shadow-inner sm:flex-row md:p-1.5',
          'bg-[#5723F2]',
          !isOnSavingsPage && 'hover:bg-[#3a00a6]',
          className,
        )}
      >
        <div className="typography-body-3 flex max-w-[80%] items-center text-primary-inverse">
          <div>New! Savings Accounts are here - start saving today</div>
          {!isOnSavingsPage && <ArrowUpRightIcon strokeWidth={1.25} />}
        </div>

        <IconButton
          icon={XIcon}
          variant="transparent"
          size="s"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="-translate-y-1/2 absolute top-1/2 right-3 text-primary-inverse hover:text-primary-inverse/70 active:text-primary-inverse/50"
        />
      </div>
    </Wrapper>
  )
}
