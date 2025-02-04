import { paths } from '@/config/paths'
import { cn } from '@/ui/utils/style'
import { ArrowUpRightIcon, XIcon } from 'lucide-react'
import { IconButton } from '../icon-button/IconButton'
import { LinkDecorator } from '../link-decorator/LinkDecorator'

interface SavingsAccountsTopBannerProps {
  onClose: () => void
  className?: string
}

export const SAVINGS_ACCOUNTS_TOP_BANNER_ID = 'savings-accounts-top-banner'

export function SavingsAccountsTopBanner({ onClose, className }: SavingsAccountsTopBannerProps) {
  return (
    <LinkDecorator to={paths.savings}>
      <div
        className={cn(
          'relative z-10 flex w-full flex-col items-center justify-center',
          'h-10 text-center shadow-inner sm:flex-row md:p-1.5',
          'bg-[#5723F2] hover:bg-[#3a00a6]',
          className,
        )}
      >
        <div className="flex items-center gap-1 font-light text-primary-inverse">
          <div>New! Savings Accounts are here - start saving today</div>
          <ArrowUpRightIcon strokeWidth={1} />
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
    </LinkDecorator>
  )
}
