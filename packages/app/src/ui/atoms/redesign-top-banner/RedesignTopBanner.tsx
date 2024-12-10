import { cn } from '@/ui/utils/style'
import { XIcon } from 'lucide-react'
import { IconButton } from '../icon-button/IconButton'
import { Sparkles } from '../sparkles/Sparkles'

interface RedesignTopBannerProps {
  onClose: () => void
  className?: string
}

export const REDESIGN_TOP_BANNER_ID = 'redesign-top-banner'

export function RedesignTopBanner({ onClose, className }: RedesignTopBannerProps) {
  return (
    <div
      className={cn(
        'relative z-10 flex w-full flex-col items-center justify-center gap-2 bg-primary p-2.5 text-center shadow-inner sm:flex-row md:p-1.5',
        className,
      )}
    >
      <div className="typography-label-3 md:typography-label-2 text-primary">
        Welcome to the{'  '}
        <Sparkles sizeRange={[12, 20]} className="mx-1 whitespace-nowrap">
          <span className="bg-gradient-spark-secondary bg-clip-text text-transparent">New Spark!</span>
        </Sparkles>
        {'  '}
        <br className="md:hidden" />
        Enjoy a fresh look and enhanced experience.
      </div>

      <IconButton
        icon={XIcon}
        variant="transparent"
        size="s"
        onClick={onClose}
        className="-translate-y-1/2 absolute top-1/2 right-3 text-primary active:text-primary/50 hover:text-primary/70"
      />
    </div>
  )
}
