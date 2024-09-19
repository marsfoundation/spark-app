import { assertNever } from '@/utils/assertNever'
import { JSONStringifyRich } from '@/utils/object'
import { Objective } from './types'

export function stringifyObjectivesDeep(objectives: Objective[]): string {
  return JSONStringifyRich(objectives)
}

export function stringifyObjectivesToStableActions(objectives: Objective[]): string {
  return JSON.stringify(
    objectives.map((objective) => {
      switch (objective.type) {
        case 'deposit':
        case 'borrow':
          return [objective.type, objective.token.address, objective.value]
        case 'withdraw':
          return [objective.type, objective.reserve.token.address, objective.value]
        case 'repay':
          return [objective.type, objective.reserve.token.address, objective.value, objective.useAToken]
        case 'setUseAsCollateral':
          return [objective.type, objective.useAsCollateral]
        case 'setUserEMode':
          return [objective.type, objective.eModeCategoryId]
        case 'claimRewards':
          return [objective.type, objective.token.address, objective.assets]
        case 'withdrawFromSavings':
          return [objective.type, objective.token.address, objective.amount]
        case 'depositToSavings':
          return [objective.type, objective.token.address, objective.savingsToken.address, objective.value]
        case 'upgrade':
        case 'downgrade':
        case 'unstake':
          return [objective.type, objective.amount]
        case 'stake':
          return [objective.type, objective.token.address, objective.amount]
        default:
          assertNever(objective)
      }
    }),
  )
}
