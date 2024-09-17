import { OracleFeedProvider } from '@/config/chain/types'
import { assets } from '@/ui/assets'
import { raise } from '@/utils/assert'

interface ProvidersListProps {
  providers: OracleFeedProvider[]
}

export function ProvidersList({ providers }: ProvidersListProps) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-2 border-gray-200 border-t-[1px] pt-6 sm:gap-6">
      <div className="my-auto text-slate-500 text-sm leading-none sm:text-xs sm:leading-none">Provided by</div>

      <div className="mt-auto flex flex-wrap gap-2 place-self-end sm:gap-4 sm:place-self-auto">
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
