import { getChainConfigEntry } from '@/config/chain'
import { Typography } from '@/ui/atoms/typography/Typography'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { mainnet } from 'viem/chains'

export type FarmsViewProps = {}

export function FarmsView() {
  const { logo: chainLogo, name: chainName } = getChainConfigEntry(mainnet.id).meta
  return (
    <PageLayout className="max-w-6xl gap-8 px-3 lg:px-0">
      <div className="flex flex-row items-center gap-4">
        <Typography variant="h2">Farms</Typography>
        <div className="flex translate-y-0.5 flex-row items-center gap-1">
          <img src={chainLogo} className="h-5 w-5" />
          <Typography className="font-semibold text-primary text-xs">{chainName}</Typography>
        </div>
      </div>
    </PageLayout>
  )
}
