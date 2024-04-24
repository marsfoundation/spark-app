import { TokenWithBalance } from '@/domain/common/types'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { raise } from '@/utils/raise'

export function getSDaiWithBalance(walletInfo: WalletInfo): TokenWithBalance {
  const sDai =
    walletInfo.walletBalances.find((balance) => balance.token.symbol === TokenSymbol('sDAI')) ??
    raise('sDAI balance not found')
  return {
    balance: sDai.balance,
    token: sDai.token,
  }
}
