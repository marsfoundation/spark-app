import { Reserve } from '../market-info/marketInfo'

export function assetCanBeBorrowed({ borrowEligibilityStatus }: Reserve): boolean {
  return borrowEligibilityStatus === 'yes' || borrowEligibilityStatus === 'only-in-siloed-mode'
}
