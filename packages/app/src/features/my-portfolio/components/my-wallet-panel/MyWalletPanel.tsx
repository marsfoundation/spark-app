import { TokenWithBalance } from '@/domain/common/types'
import { Panel } from '@/ui/atoms/new/panel/Panel'
import { Switch } from '@/ui/atoms/new/switch/Switch'
import { Info } from '@/ui/molecules/info/Info'
import { MyWalletChart } from './MyWalletChart'

export interface MyWalletPanelProps {
  assets: TokenWithBalance[]
  includeDeposits: boolean
  setIncludeDeposits: (includeDeposits: boolean) => void
}

export function MyWalletPanel({ assets, includeDeposits, setIncludeDeposits }: MyWalletPanelProps) {
  return (
    <Panel variant="secondary" className="flex flex-col items-center gap-2 text-primary-inverse" spacing="s">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="typography-heading-5">My Wallet</div>
          <Info>Assets in your wallet supported by Spark.</Info>
        </div>
        <div className="flex items-center gap-2">
          <div className="typography-label-5 text-secondary">Include deposits</div>
          <Switch checked={includeDeposits} onCheckedChange={setIncludeDeposits} />
        </div>
      </div>
      <div className="flex h-full w-full max-w-[340px] items-center">
        <MyWalletChart assets={assets} className="p-4" />
      </div>
    </Panel>
  )
}
