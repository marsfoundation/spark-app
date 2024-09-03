import { StateCreator } from 'zustand'
import { StoreState, useStore } from '.'

export interface Savings {
  confirmedWelcomeDialog: boolean
  setConfirmedWelcomeDialog: (confirmedWelcomeDialog: boolean) => void
}

export interface SavingsSlice {
  savings: Savings
}

// eslint-disable-next-line func-style
export const initSavingsSlice: StateCreator<StoreState, [], [], SavingsSlice> = (set) => ({
  savings: {
    confirmedWelcomeDialog: false,
    setConfirmedWelcomeDialog: (confirmedWelcomeDialog: boolean) =>
      set((state) => ({ savings: { ...state.savings, confirmedWelcomeDialog } })),
  },
})

export interface UseSavingsStoreResult {
  confirmedWelcomeDialog: boolean
  saveConfirmedWelcomeDialog: (confirmedWelcomeDialog: boolean) => void
}
export function useSavingsStore(): UseSavingsStoreResult {
  const { confirmedWelcomeDialog, setConfirmedWelcomeDialog } = useStore((state) => state.savings)

  return {
    confirmedWelcomeDialog,
    saveConfirmedWelcomeDialog: setConfirmedWelcomeDialog,
  }
}

export interface PersistedSavingsSlice {
  savings: {
    confirmedWelcomeModal: boolean
  }
}
export function persistSavingsSlice(state: StoreState): PersistedSavingsSlice {
  return {
    savings: {
      confirmedWelcomeModal: state.savings.confirmedWelcomeDialog,
    },
  }
}
