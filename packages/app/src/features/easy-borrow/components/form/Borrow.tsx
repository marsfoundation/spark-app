import { Control } from 'react-hook-form'

import { paths } from '@/config/paths'
import { TokenWithBalance } from '@/domain/common/types'
import { Link } from '@/ui/atoms/link/Link'
import { Tooltip, TooltipContentShort, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { Typography } from '@/ui/atoms/typography/Typography'
import { AssetSelector } from '@/ui/molecules/asset-selector/AssetSelector'
import { ControlledMultiSelectorAssetInput } from '@/ui/organisms/multi-selector/MultiSelector'
import { testIds } from '@/ui/utils/testIds'
import { raise } from '@/utils/raise'

import { EasyBorrowFormSchema } from '../../logic/form/validation'
import { ExistingPosition } from '../../logic/types'
import { TokenSummary } from './TokenSummary'

interface BorrowProps {
  selectedAssets: TokenWithBalance[]
  alreadyBorrowed: ExistingPosition
  control: Control<EasyBorrowFormSchema>
  disabled: boolean
}

export function Borrow({ selectedAssets, alreadyBorrowed, control, disabled }: BorrowProps) {
  const { token } = selectedAssets[0] ?? raise('No borrow token selected')

  return (
    <div data-testid={testIds.easyBorrow.form.borrow} className="flex flex-1 flex-col">
      <Typography variant="h4" className="flex h-10 items-center">
        Borrow
      </Typography>

      {alreadyBorrowed.tokens.length > 0 && <TokenSummary position={alreadyBorrowed} type="borrow" />}

      <div className="mt-2 flex flex-row items-start gap-2">
        <Tooltip>
          <TooltipTrigger>
            <AssetSelector assets={[{ token }]} selectedAsset={token} setSelectedAsset={() => {}} disabled={disabled} />
          </TooltipTrigger>
          <TooltipContentShort>
            You can only borrow {token.symbol} using Easy Borrow Flow. Head to{' '}
            <Link to={paths.dashboard}>Dashboard</Link> to borrow other assets.
          </TooltipContentShort>
        </Tooltip>
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
