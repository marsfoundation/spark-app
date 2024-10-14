import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { SavingsMeta } from '@/features/savings/logic/makeSavingsMeta'
import { Link } from '@/ui/atoms/link/Link'
import { links } from '@/ui/constants/links'
import { Info } from '@/ui/molecules/info/Info'
import { testIds } from '@/ui/utils/testIds'

export interface ExplainerProps {
  stablecoinValue?: NormalizedUnitNumber
  savingsMeta: SavingsMeta
}

export function Explainer({ stablecoinValue, savingsMeta }: ExplainerProps) {
  const { stablecoin, rateName } = savingsMeta.primary
  return (
    <div className="flex flex-col gap-1 md:max-w-[28ch]">
      <Header savingsMeta={savingsMeta} stablecoinValue={stablecoinValue} />
      <p className="text-basics-black/50 text-sm sm:text-base">
        {stablecoinValue ? (
          <>
            You have{' '}
            <span className="font-bold" data-testid={testIds.savings.stablecoinsAmount}>
              ~{USD_MOCK_TOKEN.formatUSD(stablecoinValue)}
            </span>{' '}
            worth of stablecoins in your wallet. Earn while you hold it!
          </>
        ) : (
          `Deposit your stablecoins into Savings ${stablecoin} to tap into the ${rateName}, which grants you a predictable APY in ${stablecoin}.`
        )}
      </p>
    </div>
  )
}

function Header({ stablecoinValue, savingsMeta }: ExplainerProps) {
  if (stablecoinValue) {
    return <h2 className="font-semibold text-base text-basics-black sm:text-xl">Savings opportunity</h2>
  }

  const { savingsToken, stablecoin, rateAcronym, rateName } = savingsMeta.primary
  return (
    <h2 className="flex items-center gap-1 whitespace-nowrap font-semibold text-base text-basics-black sm:text-xl">
      Savings {stablecoin}
      {savingsMeta.secondary && ` & ${savingsMeta.secondary.stablecoin}`}
      <Info>
        Savings {stablecoin}, or {savingsToken}, provides you with fractional ownership of the entire pool of{' '}
        {stablecoin} deposited into the {rateName}. The value of your {savingsToken} holdings gradually increases
        according to the {rateName} ({rateAcronym}). Learn more about it{' '}
        <Link to={links.docs.newSavings} external>
          here
        </Link>
        .
      </Info>
    </h2>
  )
}
