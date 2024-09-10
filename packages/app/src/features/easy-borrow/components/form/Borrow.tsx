import { TokenWithBalance } from '@/domain/common/types'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { Typography } from '@/ui/atoms/typography/Typography'
import { AssetSelector } from '@/ui/molecules/asset-selector/AssetSelector'
import { ControlledMultiSelectorAssetInput } from '@/ui/organisms/multi-selector/MultiSelector'
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
  disabled: boolean
}

export function Borrow({ selectedAssets, allAssets, changeAsset, alreadyBorrowed, control, disabled }: BorrowProps) {
  const { token } = selectedAssets[0] ?? raise('No borrow token selected')

  return (
    <div data-testid={testIds.easyBorrow.form.borrow} className="flex flex-1 flex-col">
      <Typography variant="h4" className="flex h-10 items-center">
        Borrow
      </Typography>

      {alreadyBorrowed.tokens.length > 0 && <TokenSummary position={alreadyBorrowed} type="borrow" />}

      <div className="mt-2 flex flex-row items-start gap-2">
        <AssetSelector
          assets={allAssets}
          selectedAsset={token}
          setSelectedAsset={(newAsset) => changeAsset(0, newAsset)}
          disabled={disabled}
        />
        <ControlledMultiSelectorAssetInput
          fieldName="assetsToBorrow.0.value"
          control={control}
          disabled={disabled}
          token={token}
        />
      </div>
    </div>
  )
}
