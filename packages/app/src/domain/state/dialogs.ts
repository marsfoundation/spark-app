import { CommonDialogProps, DialogConfig } from '@/features/dialogs/common/types'
import { StateCreator } from 'zustand'
import { StoreState, useStore } from '.'

export interface DialogSlice<P = {}> {
  dialogs: {
    openedDialog?: {
      config: DialogConfig<P & CommonDialogProps>
      props: P
    }
    openDialog: (config: DialogConfig<P & CommonDialogProps>, props: P) => void
    closeDialog: () => void
  }
}

// eslint-disable-next-line func-style
export const initDialogSlice: StateCreator<StoreState, [], [], DialogSlice> = (set) => ({
  dialogs: {
    openedDialog: undefined,
    openDialog: (config, props) => {
      set((state) => ({ dialogs: { ...state.dialogs, openedDialog: { config, props } } }))
    },
    closeDialog: () => {
      set((state) => ({ dialogs: { ...state.dialogs, openedDialog: undefined } }))
    },
  },
})

export type OpenDialogFunction = <P>(dialog: DialogConfig<P & CommonDialogProps>, props: P) => void
export function useOpenDialog(): OpenDialogFunction {
  const openDialog = useStore((state) => state.dialogs.openDialog)
  return openDialog as OpenDialogFunction
}

export function useCloseDialog(): () => void {
  const closeDialog = useStore((state) => state.dialogs.closeDialog)
  return closeDialog
}
