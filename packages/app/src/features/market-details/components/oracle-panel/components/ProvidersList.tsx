import { OracleFeedProvider } from '@/config/chain/types'
import { assets } from '@/ui/assets'
import { testIds } from '@/ui/utils/testIds'
import { raise } from '@/utils/assert'

interface ProvidersListProps {
  providers: OracleFeedProvider[]
}

export function ProvidersList({ providers }: ProvidersListProps) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-2 border-white/15 border-t pt-6 sm:gap-6">
      <div className="my-auto text-sm text-white/40 leading-none sm:text-xs sm:leading-none">Provided by</div>

      <div
        className="mt-auto flex flex-row-reverse flex-wrap gap-2 place-self-end sm:flex-row sm:gap-4 sm:place-self-auto"
        data-testid={testIds.marketDetails.oraclePanel.providersList}
      >
        {providers.map((provider) => (
          <img
            key={provider}
            src={assets.oracleProviders[provider] ?? raise('Unknown provider')}
            alt={`${provider} logo`}
            className="h-5"
          />
        ))}
      </div>
    </div>
  )
}
