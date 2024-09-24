import { OpenDialogFunction } from '@/domain/state/dialogs'
import { savingsDepositDialogConfig } from '@/features/dialogs/savings/deposit/SavingsDepositDialog'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { DataTable, DataTableProps } from '@/ui/molecules/data-table/DataTable'
import { useMemo } from 'react'
import { MigrationInfo } from '../../logic/makeMigrationInfo'
import { AssetInWallet } from '../../logic/useSavings'
import { MoreDropdown } from './components/MoreDropdown'
import { TokenCell } from './components/TokenCell'

export interface StablecoinsInWalletProps {
  assets: AssetInWallet[]
  openDialog: OpenDialogFunction
  migrationInfo?: MigrationInfo
}

export function StablecoinsInWallet({ assets, openDialog, migrationInfo }: StablecoinsInWalletProps) {
  const columnDef: DataTableProps<AssetInWallet>['columnDef'] = useMemo(
    () => ({
      token: {
        header: 'Token',
        renderCell: ({ token }) => <TokenCell token={token} migrationInfo={migrationInfo} />,
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
        renderCell: ({ token, balance, blockExplorerLink }) => {
          return (
            <div className="flex justify-end gap-1 sm:gap-3">
              <Button
                variant="secondary"
                size="sm"
                disabled={balance.eq(0)}
                onClick={() => openDialog(savingsDepositDialogConfig, { initialToken: token })}
              >
                Deposit
              </Button>
              <MoreDropdown
                token={token}
                migrationInfo={migrationInfo}
                blockExplorerLink={blockExplorerLink}
                balance={balance}
              />
            </div>
          )
        },
      },
    }),
    [openDialog, migrationInfo],
  )

  return (
    <Panel>
      <Panel.Header>
        <Panel.Title>Stablecoins in wallet</Panel.Title>
      </Panel.Header>
      <Panel.Content>
        <DataTable
          gridTemplateColumnsClassName="grid-cols-[repeat(2,_1fr)_120px] sm:grid-cols-[repeat(2,_1fr)_140px]"
          data={assets}
          columnDef={columnDef}
        />
      </Panel.Content>
    </Panel>
  )
}
