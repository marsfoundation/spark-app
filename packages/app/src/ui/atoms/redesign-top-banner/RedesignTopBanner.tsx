import { cn } from '@/ui/utils/style'
import { XIcon } from 'lucide-react'
import { IconButton } from '../new/icon-button/IconButton'
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
        'relative z-10 flex w-full flex-col items-center justify-center gap-2 bg-gradient-to-r from-[#414141] via-[#0e0e0e] to-[#414141] p-2.5 text-center sm:flex-row md:p-1.5',
        className,
      )}
    >
      <span className="typography-label-5 md:typography-label-4 text-primary-inverse">
        Welcome to the{'  '}
        <Sparkles sizeRange={[12, 20]} className="mx-1 whitespace-nowrap">
          New Spark!
        </Sparkles>
        {'  '}
        <br className="md:hidden" />
        Enjoy a fresh look and enhanced experience.
      </span>

      <IconButton
        icon={XIcon}
        variant="transparent"
        size="s"
        onClick={onClose}
        className="-translate-y-1/2 absolute top-1/2 right-3 text-white active:text-white/50 hover:text-white/70"
      />
    </div>
  )
}
