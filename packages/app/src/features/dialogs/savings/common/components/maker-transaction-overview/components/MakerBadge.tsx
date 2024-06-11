import { Token } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { Info } from '@/ui/molecules/info/Info'

export interface MakerBadgeProps {
  token: Token
}

export function MakerBadge({ token }: MakerBadgeProps) {
  return (
    <div className="flex flex-row items-center gap-1.5 rounded-lg bg-emerald-300/10 px-2.5 py-1.5 text-emerald-400 text-sm">
      <img src={assets.makerLogo} className="h-5 w-5" />
      <span>
        <span className="hidden font-medium md:inline"> Powered by Maker. </span>
        <span className="font-light">No slippage & fees for {token.symbol}.</span>
      </span>
      <Info className="text-inherit">The transaction uses Maker infrastructure without any third-parties.</Info>
    </div>
  )
}
