import { paths } from '@/config/paths'
import { cn } from '@/ui/utils/style'
import { XIcon } from 'lucide-react'
import { IconButton } from '../icon-button/IconButton'
import { LinkDecorator } from '../link-decorator/LinkDecorator'
import { Sparkles } from '../sparkles/Sparkles'

interface SavingsAccountsTopBannerProps {
  onClose: () => void
  className?: string
}

export const SAVINGS_ACCOUNTS_TOP_BANNER_ID = 'savings-accounts-top-banner'

export function SavingsAccountsTopBanner({ onClose, className }: SavingsAccountsTopBannerProps) {
  return (
    <div
      className={cn(
        'relative z-10 flex w-full flex-col items-center justify-center',
        'gap-2 p-2.5 text-center shadow-inner sm:flex-row md:p-1.5',
        'bg-[radial-gradient(155.75%_155.75%_at_50%_-55.75%,#FFEF79_0%,#00C2A1_100%)]',
        className,
      )}
    >
      <div className="typography-label-3 md:typography-label-2 text-primary-inverse">
        New!{'  '}
        <br className="md:hidden" />
        <Sparkles sizeRange={[12, 20]} className="mx-1 whitespace-nowrap">
          <LinkDecorator to={paths.savings}>
            <span className="text-[#FFCB4A]">Savings Accounts</span>
          </LinkDecorator>
        </Sparkles>
        are here - start saving today.
      </div>

      <IconButton
        icon={XIcon}
        variant="transparent"
        size="s"
        onClick={onClose}
        className="-translate-y-1/2 absolute top-1/2 right-3 text-primary-inverse hover:text-primary-inverse/70 active:text-primary-inverse/50"
      />
    </div>
  )
}
