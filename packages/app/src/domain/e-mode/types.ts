import { eModeCategoryIdToName } from './constants'

export type EModeCategoryId = keyof typeof eModeCategoryIdToName
export type EModeCategoryName = (typeof eModeCategoryIdToName)[EModeCategoryId]
