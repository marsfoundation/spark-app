import { featureAvailability, getChainConfigEntry } from '@/config/chain'
import { SupportedChainId } from '@/config/chain/types'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { SavingsMeta } from '@/features/savings/logic/makeSavingsMeta'
import { getTokenImage } from '@/ui/assets'
import { testIds } from '@/ui/utils/testIds'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { SlashIcon } from 'lucide-react'

export interface ExplainerProps {
  stablecoinValue?: NormalizedUnitNumber
  savingsMeta: SavingsMeta
  originChainId: SupportedChainId
}

export function Explainer({ stablecoinValue, savingsMeta, originChainId }: ExplainerProps) {
  const { stablecoin, rateName } = savingsMeta.primary
  const { savings } = getChainConfigEntry(originChainId)

  return (
    <div className="flex flex-col justify-end gap-5">
      <div className="flex items-center gap-1">
        {savings?.inputTokens.map((symbol) => (
          <img key={symbol} src={getTokenImage(TokenSymbol(symbol))} className="h-6 w-6" />
        ))}
        <SlashIcon className="icon-xs icon-tertiary -rotate-12" />
        {featureAvailability.savings.map((chainId) => (
          <img key={chainId} src={getChainConfigEntry(chainId).meta.logo} className="h-6 w-6" />
        ))}
      </div>
      <div className="typography-body-4 max-w-[52ch] text-tertiary">
        {stablecoinValue ? (
          <>
            You have{' '}
            <span data-testid={testIds.savings.stablecoinsAmount}>~{USD_MOCK_TOKEN.formatUSD(stablecoinValue)}</span>{' '}
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
