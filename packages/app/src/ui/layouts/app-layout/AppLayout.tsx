import { usePageChainId } from '@/domain/hooks/usePageChainId'
import { useBannerVisibility } from '@/domain/state/bannersVisibility'
import { useOpenDialog } from '@/domain/state/dialogs'
import { selectNetworkDialogConfig } from '@/features/dialogs/select-network/SelectNetworkDialog'
import { TopbarContainer } from '@/features/topbar/TopbarContainer'
import { REDESIGN_TOP_BANNER_ID, RedesignTopBanner } from '@/ui/atoms/redesign-top-banner/RedesignTopBanner'
import { cn } from '@/ui/utils/style'
import { LayoutBackground } from './components/LayoutBackground'
import { PageNotSupportedWarning } from './components/PageNotSupportedWarning'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { pageSupported, pageName } = usePageChainId()
  const { handleCloseBanner, showBanner } = useBannerVisibility(REDESIGN_TOP_BANNER_ID)
  const openDialog = useOpenDialog()

  return (
    <div
      className={cn(
        // width of the content is calculated by the formula: 100% - 2*padding
        'grid min-h-screen w-full grid-cols-[1fr_calc(100%-40px)_1fr] grid-rows-[auto_auto_1fr_auto] items-start gap-x-[20px]',
        'bg-secondary lg:grid-cols-[1fr_min(calc(100%-128px),1312px)_1fr] lg:gap-x-[64px]',
      )}
    >
      <LayoutBackground />

      {import.meta.env.VITE_FEATURE_TOP_BANNER === '1' && showBanner && (
        <RedesignTopBanner onClose={handleCloseBanner} className="col-span-full " />
      )}
      <div className="z-30 col-start-2 col-end-2 my-2 lg:mt-6 lg:mb-10 sm:mb-8">
        <TopbarContainer />
      </div>

      <main className="isolate z-20 col-span-full grid grid-cols-subgrid pb-16 [&>*]:col-start-2 [&>*]:col-end-2">
        {children}
      </main>

      {!pageSupported && (
        <PageNotSupportedWarning
          pageName={pageName}
          openNetworkSelectDialog={() => openDialog(selectNetworkDialogConfig, {})}
        />
      )}
    </div>
  )
}
