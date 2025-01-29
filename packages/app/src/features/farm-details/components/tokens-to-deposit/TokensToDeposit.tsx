import { TokenWithBalance } from '@/domain/common/types'
import { Token } from '@/domain/types/Token'
import { TokenCell } from '@/features/savings/components/entry-assets-panel/components/TokenCell'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { DataTable, DataTableColumnDefinitions } from '@/ui/molecules/data-table/DataTable'
import { useMemo } from 'react'

export interface TokensToDepositProps {
  assets: TokenWithBalance[]
  openStakeDialog: (token: Token) => void
}

export function TokensToDeposit({ assets, openStakeDialog }: TokensToDepositProps) {
  const columnDef: DataTableColumnDefinitions<TokenWithBalance> = useMemo(
    () => ({
      token: {
        header: 'Token',
        renderCell: ({ token }) => <TokenCell token={token} />,
      },
      balance: {
        header: 'Balance',
        headerAlign: 'right',
        renderCell: ({ balance, token }) => (
          <div className="typography-label-2 flex w-full flex-row justify-end">
            {balance.eq(0) ? '-' : token.format(balance, { style: 'auto' })}
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
      <h3 className="typography-heading-5">Tokens to deposit</h3>
      <DataTable gridTemplateColumnsClassName="grid-cols-[repeat(2,_1fr)_100px]" data={assets} columnDef={columnDef} />
    </Panel>
  )
}
