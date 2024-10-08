import { formatPercentage } from '@/domain/common/format'
import { AssetsGroup } from '@/domain/farms/types'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { getTokenColor, getTokenImage } from '@/ui/assets'
import { LinkDecorator } from '@/ui/atoms/link-decorator/LinkDecorator'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { useState } from 'react'

export interface FarmTileProps {
  entryAssetsGroup: AssetsGroup
  apy?: Percentage // @todo: Handle loading error states
  stakingToken: Token
  staked: NormalizedUnitNumber
  rewardToken: Token
  detailsLink: string
  isPointsFarm: boolean
  'data-testid'?: string
}

export function FarmTile({
  entryAssetsGroup,
  apy,
  stakingToken,
  staked,
  rewardToken,
  detailsLink,
  isPointsFarm,
  'data-testid': dataTestId,
}: FarmTileProps) {
  const [isHovered, setIsHovered] = useState(false)

  const rewardTokenSymbol = rewardToken.symbol
  const borderAccentColor = getTokenColor(rewardTokenSymbol, { alpha: Percentage(0.7) })
  const headerAccentColor = getTokenColor(rewardTokenSymbol, { alpha: Percentage(0.5) })
  const rewardIcon = getTokenImage(rewardTokenSymbol)
  const entryTokenIcons = entryAssetsGroup.assets.map((token) => getTokenImage(token))

  return (
    <LinkDecorator to={detailsLink}>
      <div
        style={isHovered ? { borderColor: borderAccentColor } : {}}
        className={cn(
          'flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl',
          'group hover:-translate-y-1 border border-basics-border',
          'transition-all duration-300 hover:shadow-tooltip',
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-testid={dataTestId}
      >
        <div className="relative isolate">
          <div
            style={{ background: `linear-gradient(to bottom, white -20px, ${headerAccentColor})` }}
            className={cn(
              'absolute opacity-50 transition-opacity duration-300',
              'z-0 h-20 w-full opacity-50 group-hover:opacity-90',
            )}
          />
          <img src={rewardIcon} alt="farm-reward-icon" className="relative z-10 mt-12 mb-5 ml-6 h-16 w-16" />
        </div>
        <div className="px-6 pb-7">
          <div className="grid w-full grid-flow-col grid-cols-[auto,auto] grid-rows-[auto,auto]">
            <div className="text-basics-dark-grey text-sm" data-testid={testIds.farms.tile.stakeText}>
              Deposit {entryAssetsGroup.name}
            </div>
            <div className="font-semibold text-2xl" data-testid={testIds.farms.tile.rewardText}>
              Earn {rewardTokenSymbol} {isPointsFarm ? 'points' : ''}
            </div>
            {apy?.gt(0) && (
              <>
                <div className="justify-self-end text-basics-dark-grey text-sm">APY</div>
                <div className="justify-self-end font-semibold text-2xl" data-testid={testIds.farms.tile.apy}>
                  {formatPercentage(apy, { minimumFractionDigits: 0 })}
                </div>
              </>
            )}
          </div>
          <div className="mt-11 mb-6 border-basics-border border-t" />
          {staked.gt(0) ? (
            <>
              <div className="mb-2 text-basics-dark-grey text-sm">Tokens deposited:</div>
              <div className="flex items-center gap-1.5 font-medium">
                <img src={getTokenImage(stakingToken.symbol)} alt="farm-reward-icon" className="h-6 w-6" />
                <span data-testid={testIds.farms.tile.staked}>{stakingToken.format(staked, { style: 'auto' })}</span>{' '}
                {stakingToken.symbol}
              </div>
            </>
          ) : (
            <>
              <div className="mb-2 text-basics-dark-grey text-sm">Tokens to deposit:</div>
              <IconStack paths={entryTokenIcons} iconBorder />
            </>
          )}
        </div>
      </div>
    </LinkDecorator>
  )
}
