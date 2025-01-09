import { Action } from '../../logic/types'

export interface BatchAction {
  type: 'batch'
  actions: Action[]
}
