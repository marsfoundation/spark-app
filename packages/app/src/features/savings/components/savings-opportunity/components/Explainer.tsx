import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { SavingsMeta } from '@/features/savings/logic/makeSavingsMeta'
import { Link } from '@/ui/atoms/link/Link'
import { Info } from '@/ui/molecules/info/Info'

export interface ExplainerProps {
  stablecoinValue?: NormalizedUnitNumber
  savingsMeta: SavingsMeta
}

export function Explainer({ stablecoinValue, savingsMeta }: ExplainerProps) {
  const { stablecoin, savingsRateName } = savingsMeta.primary
  return (
    <div className="flex flex-col gap-1 sm:max-w-[28ch]">
      <div className="flex items-center gap-1">
        <h2 className="whitespace-nowrap font-semibold text-base text-basics-black sm:text-xl">
          <HeaderContent savingsMeta={savingsMeta} stablecoinValue={stablecoinValue} />
        </h2>
      </div>
      <p className="text-basics-black/50">
        {stablecoinValue ? (
          <>
            You have ~<span className="font-bold">{USD_MOCK_TOKEN.formatUSD(stablecoinValue)}</span> worth of
            stablecoins in your wallet. Earn while you hold it!
          </>
        ) : (
          `Deposit your stablecoins into Savings ${stablecoin} to tap into the ${savingsRateName}, which grants you a predictable APY in ${stablecoin}.`
        )}
      </p>
    </div>
  )
}

function HeaderContent({ stablecoinValue, savingsMeta }: ExplainerProps) {
  if (stablecoinValue) {
    return 'Savings opportunity'
  }

  const { savingsToken, stablecoin, savingsRateAcronym, savingsRateName } = savingsMeta.primary
  return (
    <div className="flex items-center gap-1">
      Savings{' '}
      <Info>
        Savings {stablecoin}, or {savingsToken}, provides you with fractional ownership of the entire pool of{' '}
        {stablecoin} deposited into the {savingsRateName}. The value of your {savingsToken} holdings gradually increases
        according to the {savingsRateName} ({savingsRateAcronym}). Learn more about it{' '}
        {/* {@todo: add proper link to docs when ready} */}
        <Link to="/" external>
          here
        </Link>
        .
      </Info>
    </div>
  )
}
