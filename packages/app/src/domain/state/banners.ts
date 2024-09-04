import { StateCreator } from 'zustand'

import { StoreState, useStore } from '.'

export interface Banners {
  showBannerStatus: {
    [id: string]: boolean
  }
  closeBanner: (id: string) => void
}

export interface BannersSlice {
  banners: Banners
}

// eslint-disable-next-line func-style
export const initBannersSlice: StateCreator<StoreState, [], [], BannersSlice> = (set) => ({
  banners: {
    showBannerStatus: {},
    closeBanner: (id) => {
      set((state) => ({
        banners: {
          ...state.banners,
          showBannerStatus: {
            ...state.banners.showBannerStatus,
            [id]: false,
          },
        },
      }))
    },
  },
})

export interface PersistedBannersSlice {
  banners: {
    showBannerStatus?: {
      [id: string]: boolean
    }
  }
}

export function persistBannersSlice(state: StoreState): PersistedBannersSlice {
  return {
    banners: {
      showBannerStatus: state.banners.showBannerStatus,
    },
  }
}

interface UseBannerResults {
  showBanner: boolean
  handleCloseBanner: () => void
}

export function useBanner(id: string): UseBannerResults {
  const { showBannerStatus, closeBanner } = useStore((state) => state.banners)

  return {
    showBanner: showBannerStatus[id] ?? true,
    handleCloseBanner: () => {
      closeBanner(id)
    },
  }
}
