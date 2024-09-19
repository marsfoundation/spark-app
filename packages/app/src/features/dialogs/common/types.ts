import { TokenWithFormValue } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

export interface CommonDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export interface DialogContentContainerProps {
  token: Token
  closeDialog: () => void
}

export interface DialogProps extends CommonDialogProps {
  token: Token
}

export type PageState = 'form' | 'success'

export interface PageStatus {
  state: PageState
  actionsEnabled: boolean
  goToSuccessScreen: () => void
}

export interface FormFieldsForDialog {
  selectedAsset: TokenWithFormValue
  maxValue?: NormalizedUnitNumber
  maxSelectedFieldName?: string // can't be used with maxValue
  changeAsset?: (newSymbol: TokenSymbol) => void
}

export interface TxOverviewRouteItem {
  token: Token
  value: NormalizedUnitNumber
  usdValue: NormalizedUnitNumber
}
