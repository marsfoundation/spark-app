import { Token } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { Info } from '@/ui/molecules/info/Info'
import { cn } from '@/ui/utils/style'

export interface SkyBadgeProps {
  token: Token
  'data-testid'?: string
}

export function SkyBadge({ token, 'data-testid': dataTestId }: SkyBadgeProps) {
  return (
    <div
      className={cn(
        'relative flex flex-row items-center gap-2',
        '-mt-4 -z-10 px-4 pt-7 pb-3',
        'rounded-lg border border-basics-border bg-[#EADEF8] text-[#6F21D3] text-xs',
      )}
      data-testid={dataTestId}
    >
      <img src={assets.token.sky} className="h-5 w-5 rounded-full border-2 border-[#DBCAF4]" />
      <div className="flex-1 font-light">
        <span className="hidden font-medium md:inline"> Powered by SKY </span>
        <span className="hidden md:inline">(prev. MakerDAO). </span>
        No slippage & fees for {token.symbol}.
      </div>
      <Info className="text-inherit">The transaction uses SKY infrastructure without any third&#x2011;parties.</Info>
    </div>
  )
}
