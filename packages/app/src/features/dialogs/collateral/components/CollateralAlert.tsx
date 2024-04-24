import {
  SetUseAsCollateralValidationIssue,
  setUseAsCollateralValidationIssueToMessage,
} from '@/domain/market-validators/validateSetUseAsCollateral'

import { Alert } from '../../common/components/alert/Alert'
import { CollateralSetting } from '../types'

interface CollateralAlertProps {
  collateralSetting: CollateralSetting
  issue: SetUseAsCollateralValidationIssue | undefined
}

export function CollateralAlert({ collateralSetting, issue }: CollateralAlertProps) {
  if (issue) {
    return <Alert variant="danger">{setUseAsCollateralValidationIssueToMessage[issue]}</Alert>
  }

  if (collateralSetting === 'enabled') {
    return (
      <Alert variant="info">
        Enabling this asset as collateral increases your borrowing power and Health Factor. However, it can get
        liquidated if your health factor drops below 1.
      </Alert>
    )
  }

  return <Alert variant="info">Disabling asset as collateral affects your borrowing power and Health Factor.</Alert>
}
