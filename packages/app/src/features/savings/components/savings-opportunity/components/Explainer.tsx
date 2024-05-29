import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'

interface ExplainerProps {
  stablecoinValue?: NormalizedUnitNumber
}

export function Explainer({ stablecoinValue }: ExplainerProps) {
  return (
    <div className="flex flex-col gap-1 sm:max-w-[28ch]">
      <div className="flex items-center gap-1">
        <h2 className="whitespace-nowrap font-semibold text-base text-basics-black sm:text-xl">Savings opportunity</h2>
      </div>
      <p className="text-basics-black/50">
        {stablecoinValue ? (
          <>
            You have ~<span className="font-bold">{USD_MOCK_TOKEN.formatUSD(stablecoinValue)}</span> worth of
            stablecoins in your wallet. Earn while you hold it!
          </>
        ) : (
          'Deposit stablecoins into your wallet and start saving!'
        )}
      </p>
    </div>
  )
}
