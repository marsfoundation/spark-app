import { assets } from '@/ui/assets'
import { cn } from '@/ui/utils/style'
import { XIcon } from 'lucide-react'
import { Button } from '../button/Button'
import { Link } from '../link/Link'
import { Sparkles } from '../sparkles/Sparkles'

interface SkyMigrationTopBannerProps {
  onClose: () => void
  className?: string
}

export const SKY_MIGRATION_TOP_BANNER_ID = 'sky-migration-top-banner'

export function SkyMigrationTopBanner({ onClose, className }: SkyMigrationTopBannerProps) {
  return (
    <div
      className={cn(
        'relative z-10 flex w-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-[#9042C9] to-[#A047CC] p-1.5 text-center text-basics-white/85 text-sm sm:flex-row sm:text-base',
        className,
      )}
    >
      <span className="flex items-center gap-2">
        <img src={assets.banners.mkrToSkyTransform} />
        <span>
          MakerDAO is now{' '}
          <Sparkles sizeRange={[12, 20]} className="text-basics-white">
            Sky
          </Sparkles>
          .
        </span>
      </span>

      <Link
        to="https://forum.makerdao.com/t/sky-has-arrived/24959"
        external
        className="inline text-basics-white/90 underline hover:text-basics-white"
      >
        Read the announcement
      </Link>
      <Button variant="icon" size="sm" className="-translate-y-1/2 absolute top-1/2 right-1.5" onClick={onClose}>
        <XIcon className="h-5 w-5" />
      </Button>
    </div>
  )
}
