import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { useDebounce } from '@/utils/useDebounce'
import { zodResolver } from '@hookform/resolvers/zod'
import { assert } from '@marsfoundation/common-universal'
import { UseFormReturn, useForm } from 'react-hook-form'
import { ConvertStablesFormFields, NormalizedConvertStablesFormValues } from '../../types'
import { getConvertStablesFormFields } from './getConvertStablesFormFields'
import { getNormalizedFormValuesKey, normalizeFormValues } from './normalizeFormValues'
import { ConvertStablesFormSchema } from './schema'
import { getConvertStablesFormValidator } from './validator'

export interface UseConvertStablesFormParams {
  tokensInfo: TokensInfo
  psmStables: TokenSymbol[] | undefined
}

export interface UseConvertStablesFormResult {
  form: UseFormReturn<ConvertStablesFormSchema>
  formValues: NormalizedConvertStablesFormValues
  isFormValid: boolean
  isDebouncing: boolean
  formFields: ConvertStablesFormFields
}

export function useConvertStablesForm({
  tokensInfo,
  psmStables,
}: UseConvertStablesFormParams): UseConvertStablesFormResult {
  assert(psmStables, 'PSM stables are not defined on this chain')
  assert(psmStables.length > 1, 'PSM stables should have at least 2 stables to be able to convert')

  const form = useForm<ConvertStablesFormSchema>({
    resolver: zodResolver(getConvertStablesFormValidator(tokensInfo)),
    defaultValues: {
      isMaxSelected: false,
      inTokenSymbol: psmStables[0],
      outTokenSymbol: psmStables[1],
      amount: '',
    },
  })
  const formFields = getConvertStablesFormFields({
    form,
    tokensInfo,
    psmStables,
  })
  const formValues = normalizeFormValues({
    formValues: form.watch(),
    tokensInfo,
  })

  const isFormValid = form.formState.isValid
  const { debouncedValue, isDebouncing } = useDebounce(
    { formValues, isFormValid },
    getNormalizedFormValuesKey(formValues) + isFormValid.toString(),
  )

  return {
    form,
    formValues: debouncedValue.formValues,
    isFormValid,
    isDebouncing,
    formFields,
  }
}
