import { paths } from '@/config/paths'
import { usePageChainId } from '@/domain/hooks/usePageChainId'
import { cn } from '@/ui/utils/style'
import { XIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { arbitrum } from 'viem/chains'
import { useChainId, useSwitchChain } from 'wagmi'
import { IconButton } from '../icon-button/IconButton'

interface ArbitrumSavingsTopBannerProps {
  onClose: () => void
  className?: string
}

export const ARBITRUM_SAVINGS_TOP_BANNER_ID = 'savings-on-arbitrum-top-banner'

export function ArbitrumSavingsTopBanner({ onClose, className }: ArbitrumSavingsTopBannerProps) {
  const { activePathGroup } = usePageChainId()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const navigate = useNavigate()
  function onBannerClick() {
    if (chainId !== arbitrum.id) {
      switchChain({ chainId: arbitrum.id })
    }

    if (activePathGroup !== 'savings') {
      navigate(paths.savings)
    }
  }
  const clickable = activePathGroup !== 'savings' || chainId !== arbitrum.id

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
        Now supporting Arbitrum! <br className="sm:hidden" /> Enjoy fast and cost-efficient transactions on the Savings
        Page.
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
