import { TokenWithValue } from '@/domain/common/types'
import { assets } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { FarmConfig } from '../../types'

export interface FarmTileProps {
  farmConfig: FarmConfig
  deposit?: TokenWithValue
}

export function FarmTile({ farmConfig, deposit }: FarmTileProps) {
  return (
    <div
      style={{ background: 'linear-gradient(to bottom, #F6A021 73px, white 73px)', backgroundRepeat: 'no-repeat' }}
      className="flex w-full flex-col rounded-2xl border border-basics-border px-6 pt-10 pb-7"
    >
      <img src={assets.token.mkr} alt="farm-reward-icon" className="mb-5 h-16 w-16" />
      <div className="grid w-full grid-cols-2 grid-rows-[auto,auto]">
        <div className="text-basics-dark-grey text-sm">Deposit Stablecoins</div>
        <div className="justify-self-end text-basics-dark-grey text-sm">APY</div>
        <div className="font-semibold text-2xl">Earn NGT</div>
        <div className="justify-self-end font-semibold text-2xl">5%</div>
      </div>
      <div className="mt-11 mb-6 border-basics-border border-t" />
      <div className="mb-2 text-basics-dark-grey text-sm">Tokens to deposit:</div>
      <IconStack paths={[assets.token.mkr, assets.token.mkr]} iconBorder />
    </div>
  )
}
