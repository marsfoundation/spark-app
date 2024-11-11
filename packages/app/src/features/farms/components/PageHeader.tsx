import { getChainConfigEntry } from '@/config/chain'
import { Typography } from '@/ui/atoms/typography/Typography'

export interface PageHeaderProps {
  chainId: number
}

export function PageHeader({ chainId }: PageHeaderProps) {
  const { logo: chainLogo, name: chainName } = getChainConfigEntry(chainId).meta
  return (
    <div className="flex flex-row items-center gap-4">
      <h1 className="typography-heading-1">Farms</h1>
      <div className="flex translate-y-1 items-center gap-1">
        <img src={chainLogo} className="icon-sm" />
        <Typography className="typography-label-6">{chainName}</Typography>
      </div>
    </div>
  )
}
