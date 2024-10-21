import { OpenDialogFunction } from '@/domain/state/dialogs'
import { convertStablesDialogConfig } from '@/features/dialogs/convert-stables/ConvertStablesDialog'
import { savingsDepositDialogConfig } from '@/features/dialogs/savings/deposit/SavingsDepositDialog'
import { assets as uiAssets } from '@/ui/assets'
import { Button } from '@/ui/atoms/button/Button'
import { DataTable, DataTableProps } from '@/ui/molecules/data-table/DataTable'
import { cn } from '@/ui/utils/style'
import { useMemo } from 'react'
import { MigrationInfo } from '../../logic/makeMigrationInfo'
import { AssetInWallet } from '../../logic/useSavings'
import { MoreDropdown } from './components/MoreDropdown'
import { TokenCell } from './components/TokenCell'

export interface StablecoinsInWalletProps {
  assets: AssetInWallet[]
  openDialog: OpenDialogFunction
  showConvertDialogButton: boolean
  migrationInfo?: MigrationInfo
}

export function StablecoinsInWallet({
  assets,
  openDialog,
  showConvertDialogButton,
  migrationInfo,
}: StablecoinsInWalletProps) {
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
    <section className="rounded-lg border border-basics-border bg-white shadow-sm">
      <div className={cn('flex flex-col gap-6 p-4 md:px-8 md:py-6', showConvertDialogButton && 'pb-0 md:pb-0')}>
        <div className="flex flex-row items-center gap-1">
          <h3 className="font-semibold text-2xl text-primary leading-none tracking-tight">Stablecoins in wallet</h3>
        </div>
        <DataTable
          gridTemplateColumnsClassName="grid-cols-[repeat(2,_1fr)_120px] sm:grid-cols-[repeat(2,_1fr)_140px]"
          data={assets}
          columnDef={columnDef}
        />
      </div>
      {showConvertDialogButton && (
        <div className="w-full gap-6 border-basics-border border-t p-4 md:px-8 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={uiAssets.token.sky} className="h-8 w-8 rounded-full border-2 border-[#DBCAF4]" />
              <div className="flex flex-col">
                <div className="font-semibold text-primary text-sm">
                  Convert stablecoins without fees and slippages!
                </div>
                <div className="text-prompt-foreground text-xs">
                  Use SKY infrastructure to convert between supported stablecoins.
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => openDialog(convertStablesDialogConfig, { proceedText: 'Back to Savings' })}
            >
              Convert
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
