import { Percentage } from '@marsfoundation/common-universal'
import { TokenSymbol } from '../types/TokenSymbol'

export interface SparkReward {
  rewardTokenSymbol: TokenSymbol
  action: 'supply' | 'borrow'
  longDescription: string
  apy?: Percentage
}
