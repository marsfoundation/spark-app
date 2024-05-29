import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { formFormat } from '@/domain/common/format'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { usePrevious } from '@/utils/usePrevious'

import { AssetInputSchema } from './form'

interface useUpdateFormMaxValueParams {
  isMaxSet: boolean
  maxValue: NormalizedUnitNumber
  token: Token
  form: UseFormReturn<AssetInputSchema>
}

export function useUpdateFormMaxValue({ isMaxSet, maxValue, form, token }: useUpdateFormMaxValueParams): void {
  const prevMaxSet = usePrevious(isMaxSet)
  const prevMaxValue = usePrevious(maxValue)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(
    function updateFormValue() {
      if (prevMaxSet && prevMaxValue && !maxValue.isEqualTo(prevMaxValue)) {
        form.setValue('value', formFormat(maxValue, token.decimals))
      }
    },
    [isMaxSet, maxValue, prevMaxSet, prevMaxValue, form, token.decimals],
  )
}
