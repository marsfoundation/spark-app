import { paths } from '@/config/paths'
import { usePageChainId } from '@/domain/hooks/usePageChainId'
import { IconButton } from '@/ui/atoms/icon-button/IconButton'
import { cn } from '@/ui/utils/style'
import { XIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface UsdcSavingsTopBannerProps {
  onClose: () => void
  className?: string
}

export const USDC_SAVINGS_TOP_BANNER_ID = 'usdc-savings-top-banner'

export function UsdcSavingsTopBanner({ onClose, className }: UsdcSavingsTopBannerProps) {
  const { activePathGroup } = usePageChainId()
  const navigate = useNavigate()
  function onBannerClick() {
    if (activePathGroup !== 'savings') {
      navigate(paths.savings)
    }
  }
  const clickable = activePathGroup !== 'savings'

  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-center',
        'min-h-10 p-2.5 text-center shadow-inner sm:flex-row md:p-1.5',
        'bg-[#5723F2]',
        clickable && 'cursor-pointer hover:bg-[#3a00a6]',
        className,
      )}
      onClick={clickable ? onBannerClick : undefined}
    >
      <div className="typography-body-3 flex max-w-[80%] items-center text-primary-inverse">
        Welcome USDC Savings! <br className="sm:hidden" /> The easiest way to earn interest on USDC. Start saving
        effortlessly today!
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
  )
}
