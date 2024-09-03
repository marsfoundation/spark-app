import { StateCreator } from 'zustand'

import { StoreState, useStore } from '.'

export interface Banners {
  bannerStatus: {
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
    bannerStatus: {},
    closeBanner: (id) => {
      set((state) => ({
        banners: {
          ...state.banners,
          bannerStatus: {
            ...state.banners.bannerStatus,
            [id]: false,
          },
        },
      }))
    },
  },
})

export interface PersistedBannersSlice {
  banners: {
    bannerStatus?: {
      [id: string]: boolean
    }
  }
}

export function persistBannersSlice(state: StoreState): PersistedBannersSlice {
  return {
    banners: {
      bannerStatus: state.banners.bannerStatus,
    },
  }
}

interface UseBannerResults {
  showBanner: boolean
  handleCloseBanner: () => void
}

export function useBanner(id: string): UseBannerResults {
  const { bannerStatus, closeBanner } = useStore((state) => state.banners)

  return {
    showBanner: bannerStatus[id] ?? true,
    handleCloseBanner: () => {
      closeBanner(id)
    },
  }
}
