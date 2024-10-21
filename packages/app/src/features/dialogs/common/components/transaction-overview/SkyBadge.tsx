import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { assets } from '@/ui/assets'
import { Info } from '@/ui/molecules/info/Info'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'

export interface SkyBadgeProps {
  tokens: TokenSymbol[]
}

export function SkyBadge({ tokens }: SkyBadgeProps) {
  return (
    <div
      className={cn(
        'relative flex flex-row items-center gap-2',
        '-mt-4 -z-10 px-4 pt-7 pb-3',
        'rounded-lg border border-basics-border bg-[#EADEF8] text-[#6F21D3] text-xs',
      )}
      data-testid={testIds.dialog.transactionOverview.skyBadge}
    >
      <img src={assets.token.sky} className="h-5 w-5 rounded-full border-2 border-[#DBCAF4]" />
      <div className="flex-1 font-light">
        <span className="hidden font-medium md:inline">Powered by Sky </span>
        <span className="hidden md:inline">(prev. MakerDAO). </span>
        No slippage & fees for {formatTokens(tokens)}.
      </div>
      <Info className="text-inherit">
        The conversion between DAI, USDS, and USDC is conducted through the Sky PSM, a component of Sky that allows
        users to freely swap USDS for stablecoins without any slippage.
      </Info>
    </div>
  )
}

function formatTokens(tokens: TokenSymbol[]): string {
  if (tokens.length === 1) {
    return tokens[0]!
  }
  if (tokens.length === 2) {
    return `${tokens[0]} and ${tokens[1]}`
  }
  return `${tokens.slice(0, -1).join(', ')} and ${tokens[tokens.length - 1]}`
}
