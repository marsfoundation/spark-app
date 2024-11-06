import { TokenWithBalance } from '@/domain/common/types'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { Panel } from '@/ui/atoms/new/panel/Panel'
import { AssetInput } from '@/ui/organisms/new/asset-input/AssetInput'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { raise } from '@/utils/assert'
import { Control } from 'react-hook-form'
import { EasyBorrowFormSchema } from '../../logic/form/validation'
import { ExistingPosition } from '../../logic/types'
import { TokenSummary } from './TokenSummary'

interface BorrowProps {
  selectedAssets: TokenWithBalance[]
  allAssets: TokenWithBalance[]
  changeAsset: (index: number, newSymbol: TokenSymbol) => void
  alreadyBorrowed: ExistingPosition
  control: Control<EasyBorrowFormSchema>
  disabled?: boolean
}

export function Borrow({ selectedAssets, allAssets, changeAsset, alreadyBorrowed, control, disabled }: BorrowProps) {
  const selectedAsset = selectedAssets[0] ?? raise('No borrow token selected')
  const showTokenSummary = alreadyBorrowed.tokens.length > 0

  return (
    <Panel className="flex flex-1 flex-col" data-testid={testIds.easyBorrow.form.borrow} spacing="none">
      <Panel className={cn('flex flex-col gap-4 bg-primary', showTokenSummary && 'rounded-b-none')}>
        <h4 className="typography-label-2 h-8 text-primary">Borrow</h4>

        <AssetInput
          fieldName={'assetsToBorrow.0.value'}
          control={control}
          selectorAssets={allAssets.filter((s) => !selectedAssets.some((a) => a.token.symbol === s.token.symbol))}
          selectedAsset={selectedAsset}
          setSelectedAsset={(newAsset) => changeAsset(0, newAsset)}
          disabled={disabled}
          showError
        />
      </Panel>
      {showTokenSummary && (
        <Panel className="rounded-t-none bg-secondary px-8 py-3.5" spacing="none">
          <TokenSummary position={alreadyBorrowed} type="borrow" />
        </Panel>
      )}
    </Panel>
  )
}
