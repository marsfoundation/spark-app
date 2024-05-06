import { DeepPartial } from 'ts-essentials'
import { StateCreator } from 'zustand'

import { tryOrDefault } from '@/utils/tryOrDefault'

import { Percentage } from '../types/NumericValues'
import { type StoreState } from '.'

export interface ActionsSettings {
  preferPermits: boolean
  setPreferPermits: (preferPermits: boolean) => void
  exchangeMaxSlippage: Percentage
}

export interface ActionsSettingsSlice {
  actionsSettings: ActionsSettings
}

const defaultExchangeMaxSlippage = Percentage(0.001)

// eslint-disable-next-line func-style
export const initActionsSettingsSlice: StateCreator<StoreState, [], [], ActionsSettingsSlice> = (set) => ({
  actionsSettings: {
    preferPermits: true,
    setPreferPermits: (preferPermits: boolean) =>
      set((state) => ({ actionsSettings: { ...state.actionsSettings, preferPermits } })),
    exchangeMaxSlippage: defaultExchangeMaxSlippage,
  },
})

export interface PersistedActionsSettingsSlice {
  actionsSettings: {
    preferPermits: boolean
    exchangeMaxSlippage: string
  }
}

export function persistActionsSettingsSlice(state: StoreState): PersistedActionsSettingsSlice {
  return {
    actionsSettings: {
      preferPermits: state.actionsSettings.preferPermits,
      exchangeMaxSlippage: state.actionsSettings.exchangeMaxSlippage.toFixed(),
    },
  }
}

export function unPersistActionsSettingsSlice(
  persistedState: DeepPartial<PersistedActionsSettingsSlice>,
): DeepPartial<ActionsSettingsSlice> {
  if (!persistedState.actionsSettings) {
    return {}
  }

  return {
    actionsSettings: {
      preferPermits: persistedState.actionsSettings.preferPermits,
      exchangeMaxSlippage: tryOrDefault(() => {
        const rawSlippage = persistedState.actionsSettings?.exchangeMaxSlippage
        return rawSlippage && Percentage(rawSlippage)
      }, undefined),
    },
  }
}
