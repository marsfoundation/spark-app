import { StateCreator } from 'zustand'
import { StoreState } from '.'

export interface Analytics {
  accepted: boolean | undefined
  setAccepted: (accepted: boolean) => void
}

export interface AnalyticsSlice {
  analytics: Analytics
}

// eslint-disable-next-line func-style
export const initAnalyticsSlice: StateCreator<StoreState, [], [], AnalyticsSlice> = (set) => ({
  analytics: {
    accepted: undefined,
    setAccepted: (accepted: boolean) => set((state) => ({ analytics: { ...state.analytics, accepted } })),
  },
})

export interface PersistedAnalyticsSlice {
  analytics: {
    accepted: boolean | undefined
  }
}
export function persistAnalyticsSlice(state: StoreState): PersistedAnalyticsSlice {
  return {
    analytics: {
      accepted: state.analytics.accepted,
    },
  }
}
