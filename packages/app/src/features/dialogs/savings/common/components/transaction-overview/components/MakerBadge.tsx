import { Token } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { Info } from '@/ui/molecules/info/Info'
import { cn } from '@/ui/utils/style'

export interface MakerBadgeProps {
  token: Token
  'data-testid'?: string
}

export function MakerBadge({ token, 'data-testid': dataTestId }: MakerBadgeProps) {
  return (
    <div
      className={cn(
        'relative flex flex-row items-center gap-2',
        '-mt-4 -z-10 px-4 pt-7 pb-3',
        'rounded-lg border border-basics-border bg-[#E4F3F0] text-[#4EA89B] text-sm',
      )}
      data-testid={dataTestId}
    >
      <img src={assets.makerLogo} className="h-4 w-4" />
      <span className="flex-1">
        <span className="hidden font-medium md:inline"> Powered by Maker. </span>
        <span className="font-light">No slippage & fees for {token.symbol}.</span>
      </span>
      <Info className="text-inherit">The transaction uses Maker infrastructure without any third&#x2011;parties.</Info>
    </div>
  )
}
