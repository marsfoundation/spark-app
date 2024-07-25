import { Objective } from '@/features/actions/logic/types'

import { MarketInfo } from '@/domain/market-info/marketInfo'
import { DialogFormNormalizedData } from '../../common/logic/form'

export interface CreateWithdrawObjectivesParams {
  formValues: DialogFormNormalizedData
  marketInfoIn1Epoch: MarketInfo
}

export function createWithdrawObjectives({
  formValues,
  marketInfoIn1Epoch,
}: CreateWithdrawObjectivesParams): Objective[] {
  const withdrawAll = formValues.isMaxSelected && formValues.position.collateralBalance.eq(formValues.value)
  const gatewayApprovalValue =
    formValues.token.symbol !== marketInfoIn1Epoch.nativeAssetInfo.nativeAssetSymbol
      ? undefined
      : withdrawAll
        ? marketInfoIn1Epoch.findOnePositionByToken(formValues.token).collateralBalance
        : formValues.value

  return [
    {
      type: 'withdraw',
      reserve: formValues.reserve,
      value: formValues.value,
      all: withdrawAll,
      gatewayApprovalValue,
    },
  ]
}
