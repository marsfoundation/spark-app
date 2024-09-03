import { assets } from '@/ui/assets'
import { Link } from '../link/Link'
import { Sparkles } from '../sparkles/Sparkles'

export function TopBanner() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-[#9042C9] to-[#A047CC] p-1.5 text-center text-basics-white/85 text-sm sm:flex-row sm:text-base">
      <span className="flex items-center gap-2">
        <img src={assets.banners.mkrToSkyTransform} />
        <span>
          MakerDAO is now{' '}
          <Sparkles sizeRange={[8, 12]} className="text-basics-white">
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
    </div>
  )
}
