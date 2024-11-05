import { TokenAmount, TokenAmountProps } from '@/ui/molecules/token-amount/TokenAmount'

export type TransactionOverviewTokenAmountProps = Omit<TokenAmountProps, 'variant'>

export function TransactionOverviewTokenAmount(props: TransactionOverviewTokenAmountProps) {
  return <TokenAmount {...props} variant="horizontal" />
}
