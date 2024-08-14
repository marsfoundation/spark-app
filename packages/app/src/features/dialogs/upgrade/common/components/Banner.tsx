import { Token } from '@/domain/types/Token'
import { assets, getTokenImage } from '@/ui/assets'

export interface BannerProps {
  fromToken: Token
  toToken: Token
}

export function Banner({ fromToken, toToken }: BannerProps) {
  return (
    <div
      className="flex h-44 items-center justify-center gap-8 rounded-2xl bg-center bg-cover"
      style={{ backgroundImage: `url(${assets.banners.upgradeBannerBg})` }}
    >
      <img src={getTokenImage(fromToken.symbol)} alt="from-token-icon" className="h-20 w-20" />
      <img src={assets.arrowRight} alt="arrow-right" className="h-7 w-7" />
      <img src={getTokenImage(toToken.symbol)} alt="to-token-icon" className="h-20 w-20" />
    </div>
  )
}
