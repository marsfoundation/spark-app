import { useMemo } from 'react'

import { TokenWithBalance } from '@/domain/common/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { SavingsDepositDialog } from '@/features/dialogs/savings/deposit/SavingsDepositDialog'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { DataTable, DataTableProps } from '@/ui/molecules/data-table/DataTable'

export interface CashInWalletProps {
  assets: TokenWithBalance[]
  openDialog: OpenDialogFunction
}

export function CashInWallet({ assets, openDialog }: CashInWalletProps) {
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
              <Button
                variant="secondary"
                size="sm"
                disabled={balance.eq(0)}
                onClick={() => openDialog(SavingsDepositDialog, { initialToken: token })}
              >
                Deposit
              </Button>
            </div>
          )
        },
      },
    }),
    [openDialog],
  )

  return (
    <Panel>
      <Panel.Header>
        <Panel.Title>Cash in wallet</Panel.Title>
      </Panel.Header>
      <Panel.Content>
        <DataTable
          gridTemplateColumnsClassName="grid-cols-[repeat(2,_1fr)_100px]"
          data={assets}
          columnDef={columnDef}
        />
      </Panel.Content>
    </Panel>
  )
}
