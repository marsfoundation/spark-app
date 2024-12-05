import { getChainConfigEntry } from '@/config/chain'
import { SupportedChainId } from '@/config/chain/types'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { SavingsMeta } from '@/features/savings/logic/makeSavingsMeta'
import { getTokenImage } from '@/ui/assets'
import { testIds } from '@/ui/utils/testIds'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { ArrowRightIcon } from 'lucide-react'

export interface ExplainerProps {
  stablecoinValue?: NormalizedUnitNumber
  savingsMeta: SavingsMeta
  originChainId: SupportedChainId
}

export function Explainer({ stablecoinValue, savingsMeta, originChainId }: ExplainerProps) {
  const { stablecoin, rateName } = savingsMeta.primary
  const { savings, sdaiSymbol, susdsSymbol } = getChainConfigEntry(originChainId)

  return (
    <div className="flex flex-col justify-end gap-5">
      <div className="flex items-center gap-1">
        {savings?.inputTokens.map((symbol) => (
          <img key={symbol} src={getTokenImage(TokenSymbol(symbol))} className="h-6 w-6" />
        ))}
        <ArrowRightIcon className="icon-xs text-primary-inverse" />
        {[sdaiSymbol, susdsSymbol].filter(Boolean).map((symbol) => (
          <img key={symbol} src={getTokenImage(TokenSymbol(symbol))} className="h-6 w-6" />
        ))}
      </div>
      <div className="typography-body-6 max-w-[52ch] text-tertiary">
        {stablecoinValue ? (
          <>
            You have{' '}
            <span className="font-bold" data-testid={testIds.savings.stablecoinsAmount}>
              ~{USD_MOCK_TOKEN.formatUSD(stablecoinValue)}
            </span>{' '}
            worth of stablecoins in your wallet. Earn while you hold it!
          </>
        ) : (
          <>
            Deposit your stablecoins into Savings {stablecoin} to tap into the {rateName}, which grants you a
            predictable APY in {stablecoin}.
          </>
        )}
      </div>
    </div>
  )
}
