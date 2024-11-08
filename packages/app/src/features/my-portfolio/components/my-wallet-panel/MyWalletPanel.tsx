import { TokenWithBalance } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { getTokenColor, getTokenImage } from '@/ui/assets'
import { Panel } from '@/ui/atoms/new/panel/Panel'
import { Switch } from '@/ui/atoms/new/switch/Switch'
import { Info } from '@/ui/molecules/info/Info'
import { getRandomColor } from '@/ui/utils/get-random-color'
import { useState } from 'react'
import { MyWalletChart } from './MyWalletChart'

export interface MyWalletPanelProps {
  assets: TokenWithBalance[]
  includeDeposits: boolean
  setIncludeDeposits: (includeDeposits: boolean) => void
}

export function MyWalletPanel({ assets, includeDeposits, setIncludeDeposits }: MyWalletPanelProps) {
  const totalUsd = assets.reduce(
    (acc, asset) => NormalizedUnitNumber(acc.plus(asset.token.toUSD(asset.balance))),
    NormalizedUnitNumber(0),
  )
  const nonZeroAssets = assets.filter((asset) => asset.balance.gt(0))
  const chartData = nonZeroAssets.map((asset) => ({
    value: asset.token.toUSD(asset.balance).toNumber(),
    color: getTokenColor(asset.token.symbol, { fallback: getRandomColor() }),
  }))

  const [highlightedIndex, setHighlightedIndex] = useState<number | undefined>(undefined)
  const highlightedAsset = highlightedIndex === undefined ? undefined : nonZeroAssets[highlightedIndex]

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
      <div className="relative isolate w-full p-4">
        <div className="absolute inset-0 z-[-10] flex items-center justify-center">
          {highlightedAsset === undefined ? (
            <div className="flex flex-col items-center gap-1.5">
              <div className="typography-body-5">TOTAL</div>
              <div className="typography-heading-4">{USD_MOCK_TOKEN.formatUSD(totalUsd)}</div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-primary-inverse">
              <div className="flex items-center gap-2">
                <img src={getTokenImage(highlightedAsset.token.symbol)} className="h-6 w-6" />
                <div className="typography-body-5">{highlightedAsset.token.symbol}</div>
              </div>
              <div className="typography-heading-4">
                {highlightedAsset.token.format(highlightedAsset.balance, { style: 'auto' })}
              </div>
              <div className="typography-body-5 text-secondary">
                {highlightedAsset.token.formatUSD(highlightedAsset.balance)}
              </div>
            </div>
          )}
        </div>
        <MyWalletChart data={chartData} highlightedIndex={highlightedIndex} setHighlightedIndex={setHighlightedIndex} />
      </div>
    </Panel>
  )
}
