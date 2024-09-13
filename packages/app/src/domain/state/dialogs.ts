import { StateCreator } from 'zustand'

import { CommonDialogProps } from '@/features/dialogs/common/types'

import { StoreState, useStore } from '.'

interface DialogParams {
  chainSensitive: boolean
}

export interface DialogSlice<P = {}> {
  dialogs: {
    openedDialog?: {
      element: React.ElementType<P & CommonDialogProps>
      props: P
      params: DialogParams
    }
    openDialog: (dialog: React.ElementType<P & CommonDialogProps>, props: P, params?: DialogParams) => void
    closeDialog: () => void
  }
}

// eslint-disable-next-line func-style
export const initDialogSlice: StateCreator<StoreState, [], [], DialogSlice> = (set) => ({
  dialogs: {
    openedDialog: undefined,
    openDialog: (
      dialog,
      props,
      params = {
        chainSensitive: false,
      },
    ) => {
      set((state) => ({ dialogs: { ...state.dialogs, openedDialog: { element: dialog, props, params } } }))
    },
    closeDialog: () => {
      set((state) => ({ dialogs: { ...state.dialogs, openedDialog: undefined } }))
    },
  },
})

export type OpenDialogFunction = <P>(
  dialog: React.ElementType<P & CommonDialogProps>,
  props: P,
  params?: DialogParams,
) => void
export function useOpenDialog(): OpenDialogFunction {
  const openDialog = useStore((state) => state.dialogs.openDialog)
  return openDialog as OpenDialogFunction
}

export function useCloseDialog(): () => void {
  const closeDialog = useStore((state) => state.dialogs.closeDialog)
  return closeDialog
}
