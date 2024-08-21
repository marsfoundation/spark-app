import { Token } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { Info } from '@/ui/molecules/info/Info'

export interface MakerBadgeProps {
  token: Token
  'data-testid'?: string
}

export function MakerBadge({ token, 'data-testid': dataTestId }: MakerBadgeProps) {
  return (
    <div className="-mt-4 -z-10 relative rounded-b-lg border border-basics-border border-t-0 bg-panel-bg">
      <div
        className="flex flex-row items-center gap-2 rounded-b-lg bg-teal-400/10 px-3 pt-7 pb-3 text-sm text-teal-500"
        data-testid={dataTestId}
      >
        <img src={assets.makerLogo} className="h-4 w-4" />
        <span>
          <span className="hidden font-medium md:inline"> Powered by Maker. </span>
          <span className="font-light">No slippage & fees for {token.symbol}.</span>
        </span>
        <Info className="text-inherit">The transaction uses Maker infrastructure without any third-parties.</Info>
      </div>
    </div>
  )
}
