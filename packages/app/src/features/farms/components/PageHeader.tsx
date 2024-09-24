import { getChainConfigEntry } from '@/config/chain'
import { Typography } from '@/ui/atoms/typography/Typography'

export interface PageHeaderProps {
  chainId: number
}

export function PageHeader({ chainId }: PageHeaderProps) {
  const { logo: chainLogo, name: chainName } = getChainConfigEntry(chainId).meta
  return (
    <div className="flex flex-row items-center gap-4">
      <Typography variant="h2">Farms</Typography>
      <div className="flex translate-y-0.5 flex-row items-center gap-1">
        <img src={chainLogo} className="h-5 w-5" />
        <Typography className="font-semibold text-primary text-xs">{chainName}</Typography>
      </div>
    </div>
  )
}
