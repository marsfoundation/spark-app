import { StateCreator } from 'zustand'

import { StoreState, useStore } from '.'

export interface BannersVisibility {
  bannerVisibilityStatus: {
    [id: string]: boolean
  }
  closeBanner: (id: string) => void
}

export interface BannersVisibilitySlice {
  bannersVisibility: BannersVisibility
}

// eslint-disable-next-line func-style
export const initBannersVisibilitySlice: StateCreator<StoreState, [], [], BannersVisibilitySlice> = (set) => ({
  bannersVisibility: {
    bannerVisibilityStatus: {},
    closeBanner: (id) => {
      set((state) => ({
        bannersVisibility: {
          ...state.bannersVisibility,
          bannerVisibilityStatus: {
            ...state.bannersVisibility.bannerVisibilityStatus,
            [id]: false,
          },
        },
      }))
    },
  },
})

export interface PersistedBannersSlice {
  bannersVisibility: {
    bannerVisibilityStatus?: {
      [id: string]: boolean
    }
  }
}

export function persistBannersVisibilitySlice(state: StoreState): PersistedBannersSlice {
  return {
    bannersVisibility: {
      bannerVisibilityStatus: state.bannersVisibility.bannerVisibilityStatus,
    },
  }
}

interface UseBannerResults {
  showBanner: boolean
  handleCloseBanner: () => void
}

export function useBannerVisibility(id: string): UseBannerResults {
  const { bannerVisibilityStatus, closeBanner } = useStore((state) => state.bannersVisibility)

  return {
    showBanner: bannerVisibilityStatus[id] ?? true,
    handleCloseBanner: () => {
      closeBanner(id)
    },
  }
}
