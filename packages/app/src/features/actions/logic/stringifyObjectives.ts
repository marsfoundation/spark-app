import { JSONStringifyRich } from '@/utils/object'

import { Objective } from './types'

export function stringifyObjectivesDeep(objectives: Objective[]): string {
  return JSONStringifyRich(objectives)
}

export function stringifyObjectivesToStableActions(objectives: Objective[]): string {
  return JSON.stringify(
    objectives.map((o: any) => [
      // required because of conditional creation of actions
      o.type,
      o?.token?.address,
      o?.reserve?.token.address,
      o?.useAToken,
      // values are stringified to reload actions when inputs change (and for example new approval value is needed)
      o?.value,
      o?.migrateDAIToSNST,
    ]),
  )
}
