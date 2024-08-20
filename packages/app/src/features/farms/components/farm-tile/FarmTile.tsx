import { formatPercentage } from '@/domain/common/format'
import { TokenWithValue } from '@/domain/common/types'
import { Percentage } from '@/domain/types/NumericValues'
import { getTokenDominantColor, getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { FarmConfig, FarmInfo } from '../../types'

export interface FarmTileProps {
  farmConfig: FarmConfig
  farmInfo: FarmInfo
  deposit?: TokenWithValue
}

export function FarmTile({ farmConfig, farmInfo, deposit }: FarmTileProps) {
  const headerAccentColor = getTokenDominantColor(farmConfig.reward, { opacity: Percentage(0.25) })
  const rewardIcon = getTokenImage(farmConfig.reward)
  const entryTokenIcons = farmConfig.entryAssetsGroup.assets.map((token) => getTokenImage(token))

  return (
    <div
      style={{
        background: `linear-gradient(to bottom, white -20px, ${headerAccentColor} 73px, white 73px)`,
        backgroundRepeat: 'no-repeat',
      }}
      className="flex w-full cursor-pointer flex-col rounded-2xl border border-basics-border px-6 pt-10 pb-7 transition-shadow hover:shadow-tooltip"
    >
      <img src={rewardIcon} alt="farm-reward-icon" className="mb-5 h-16 w-16" />
      <div className="grid w-full grid-cols-[auto,auto] grid-rows-[auto,auto]">
        <div className="text-basics-dark-grey text-sm">Deposit {farmConfig.entryAssetsGroup.name}</div>
        <div className="justify-self-end text-basics-dark-grey text-sm">APY</div>
        <div className="font-semibold text-2xl">Earn {farmConfig.reward}</div>
        <div className="justify-self-end font-semibold text-2xl">
          {formatPercentage(farmInfo.apy, { minimumFractionDigits: 0 })}
        </div>
      </div>
      <div className="mt-11 mb-6 border-basics-border border-t" />
      {deposit ? (
        <>
          <div className="mb-2 text-basics-dark-grey text-sm">Tokens deposited:</div>
          <div className="flex items-center gap-1.5 font-medium">
            <IconStack paths={[getTokenImage(deposit.token.symbol)]} iconBorder />
            {deposit.token.format(deposit.value, { style: 'auto' })} {deposit.token.symbol}
          </div>
        </>
      ) : (
        <>
          <div className="mb-2 text-basics-dark-grey text-sm">Tokens to deposit:</div>
          <IconStack paths={entryTokenIcons} iconBorder />
        </>
      )}
    </div>
  )
}
