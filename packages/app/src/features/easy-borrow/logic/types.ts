import { ReserveWithValue } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export type PageState = 'form' | 'confirmation' | 'success'
export interface PageStatus {
  actionsEnabled: boolean
  state: PageState
  onProceedToForm: () => void
  goToSuccessScreen: () => void
  submitForm: () => void
}

export interface ExistingPosition {
  tokens: Token[]
  totalValueUSD: NormalizedUnitNumber
}

export interface EasyBorrowFormNormalizedData {
  borrows: ReserveWithValue[] // @todo: should it merge value of native base asset with wrapped native asset?
  deposits: ReserveWithValue[]
}
