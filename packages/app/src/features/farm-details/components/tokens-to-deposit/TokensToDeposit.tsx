import { TokenWithBalance } from '@/domain/common/types'
import { Token } from '@/domain/types/Token'
import { Button } from '@/ui/atoms/new/button/Button'
import { Panel } from '@/ui/atoms/new/panel/Panel'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { DataTable, DataTableProps } from '@/ui/molecules/data-table/DataTable'
import { useMemo } from 'react'

export interface TokensToDepositProps {
  assets: TokenWithBalance[]
  openStakeDialog: (token: Token) => void
}

export function TokensToDeposit({ assets, openStakeDialog }: TokensToDepositProps) {
  const columnDef: DataTableProps<TokenWithBalance>['columnDef'] = useMemo(
    () => ({
      token: {
        header: 'Token',
        renderCell: ({ token }) => (
          <div className="flex flex-row items-center gap-2">
            <TokenIcon token={token} className="h-6 w-6" />
            {token.symbol}
          </div>
        ),
      },
      balance: {
        header: 'Balance',
        headerAlign: 'right',
        renderCell: ({ balance, token }) => (
          <div>
            <div className="flex w-full flex-row justify-end">
              {balance.eq(0) ? '-' : token.format(balance, { style: 'auto' })}
            </div>
          </div>
        ),
      },
      actions: {
        header: '',
        renderCell: ({ token, balance }) => {
          return (
            <div className="flex w-full flex-row justify-end">
              <Button variant="secondary" size="s" disabled={balance.eq(0)} onClick={() => openStakeDialog(token)}>
                Deposit
              </Button>
            </div>
          )
        },
      },
    }),
    [openStakeDialog],
  )

  return (
    <Panel className="flex flex-col gap-6">
      <h3>Tokens to deposit</h3>
      <DataTable gridTemplateColumnsClassName="grid-cols-[repeat(2,_1fr)_100px]" data={assets} columnDef={columnDef} />
    </Panel>
  )
}
