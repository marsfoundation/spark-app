import { getTokenColor } from '@/ui/assets'
import { Checkbox } from '@/ui/atoms/checkbox/Checkbox'
import { DoughnutChart } from '@/ui/atoms/doughnut-chart/DoughnutChart'
import { Panel } from '@/ui/atoms/panel/Panel'
import { Info } from '@/ui/molecules/info/Info'
import { getRandomColor } from '@/ui/utils/get-random-color'
import { useBreakpoint } from '@/ui/utils/useBreakpoint'
import { Wallet } from 'lucide-react'
import { WalletCompositionInfo } from '../../logic/wallet-composition'
import { AssetTable } from './AssetTable'

export type WalletCompositionProps = Omit<WalletCompositionInfo, 'chainId'>

export function WalletComposition({
  assets,
  includeDeposits,
  setIncludeDeposits,
  hasCollaterals,
}: WalletCompositionProps) {
  const chartData = assets.map((asset) => ({
    value: asset.token.toUSD(asset.value).toNumber(),
    color: getTokenColor(asset.token.symbol, { fallback: getRandomColor() }),
  }))
  const sm = useBreakpoint('sm')

  return (
    <Panel collapsibleOptions={{ collapsible: true, collapsibleAbove: 'sm' }}>
      <Panel.Header>
        <Panel.Title>Your wallet</Panel.Title>
        <Info>List of assets in your wallet supported by Last.</Info>
        {hasCollaterals && (
          <div className="ml-5 flex items-center gap-2">
            <Checkbox
              id="checkbox-include-deposit"
              checked={includeDeposits}
              onCheckedChange={(checked) => setIncludeDeposits(!!checked.valueOf())}
            />
            <label
              htmlFor="checkbox-include-deposit"
              className="font-light text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              include my deposits
            </label>
          </div>
        )}
      </Panel.Header>

      <Panel.Content className="flex flex-col gap-8 sm:flex-row md:gap-10">
        {assets.length > 1 && <DoughnutChart data={chartData} className="shrink-0 sm:max-h-64" />}
        <div className="w-full sm:max-h-64">
          {assets.length !== 0 ? (
            <AssetTable rows={assets} scroll={sm ? { height: 256 } : undefined} />
          ) : (
            <div className="flex w-full flex-col items-center justify-center gap-2 sm:my-10 sm:flex-row">
              <Wallet size={32} className="mx-auto text-gray-400 sm:mx-0" />
              <p className="text-gray-500">You don't have any assets in your wallet</p>
            </div>
          )}
        </div>
      </Panel.Content>
    </Panel>
  )
}
