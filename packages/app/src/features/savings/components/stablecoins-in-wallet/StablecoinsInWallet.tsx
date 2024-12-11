import { OpenDialogFunction } from '@/domain/state/dialogs'
import { convertStablesDialogConfig } from '@/features/dialogs/convert-stables/ConvertStablesDialog'
import { savingsDepositDialogConfig } from '@/features/dialogs/savings/deposit/SavingsDepositDialog'
import { assets as uiAssets } from '@/ui/assets'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { DataTable, DataTableColumnDefinitions } from '@/ui/molecules/data-table/DataTable'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
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
  const columnDef: DataTableColumnDefinitions<AssetInWallet> = useMemo(
    () => ({
      token: {
        header: 'Token',
        renderCell: ({ token }) => <TokenCell token={token} migrationInfo={migrationInfo} />,
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
        renderCell: ({ token, balance, blockExplorerLink }) => {
          return (
            <div className="flex justify-end gap-1 sm:gap-3">
              <Button
                variant="secondary"
                size="s"
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
    <Panel spacing="none">
      <div className={cn('flex flex-col gap-6 p-4 md:px-8 md:py-6', showConvertDialogButton && 'pb-0 md:pb-0')}>
        <h3 className="typography-heading-4 text-primary">Stablecoins in wallet</h3>
        <DataTable
          gridTemplateColumnsClassName="grid-cols-[repeat(2,_1fr)_120px] sm:grid-cols-[repeat(2,_1fr)_140px]"
          data={assets}
          columnDef={columnDef}
        />
      </div>
      {showConvertDialogButton && (
        <div className="w-full gap-6 border-primary border-t p-4 md:px-8 md:py-6">
          <div className="grid grid-cols-[1fr_auto] items-center gap-3">
            <div className="flex items-center gap-3">
              <img src={uiAssets.token.sky} className="h-8 w-8 rounded-full border-2 border-[#DBCAF4]" />
              <div className="flex flex-col">
                <div className="typography-label-3 text-primary">Convert stablecoins without fees and slippage!</div>
                <div className="typography-body-4 text-secondary">
                  Use SKY infrastructure to convert between supported stablecoins.
                </div>
              </div>
            </div>
            <Button
              size="s"
              variant="secondary"
              onClick={() => openDialog(convertStablesDialogConfig, { proceedText: 'Back to Savings' })}
              data-testid={testIds.component.ConvertStablesButton}
            >
              Convert
            </Button>
          </div>
        </div>
      )}
    </Panel>
  )
}
