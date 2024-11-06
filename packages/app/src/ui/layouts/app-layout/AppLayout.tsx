import { usePageChainId } from '@/domain/hooks/usePageChainId'
import { useBannerVisibility } from '@/domain/state/bannersVisibility'
import { useOpenDialog } from '@/domain/state/dialogs'
import { selectNetworkDialogConfig } from '@/features/dialogs/select-network/SelectNetworkDialog'
import { TopbarContainer } from '@/features/topbar/TopbarContainer'
import { cn } from '@/ui/utils/style'
import {
  SKY_MIGRATION_TOP_BANNER_ID,
  SkyMigrationTopBanner,
} from '../../atoms/sky-migration-top-banner/SkyMigrationTopBanner'
import { LayoutBackground } from './components/LayoutBackground'
import { PageNotSupportedWarning } from './components/PageNotSupportedWarning'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { pageSupported, pageName } = usePageChainId()
  const { handleCloseBanner, showBanner } = useBannerVisibility(SKY_MIGRATION_TOP_BANNER_ID)
  const openDialog = useOpenDialog()

  return (
    <div
      className={cn(
        'grid min-h-screen w-full grid-cols-[1fr_calc(100%-48px)_1fr] grid-rows-[auto_auto_1fr_auto] items-start gap-x-[24px]',
        'bg-secondary lg:grid-cols-[1fr_min(calc(100%-128px),1440px)_1fr] lg:gap-x-[64px]',
      )}
    >
      <LayoutBackground />

      {import.meta.env.VITE_FEATURE_TOP_BANNER === '1' && showBanner && (
        <SkyMigrationTopBanner onClose={handleCloseBanner} className="col-span-full " />
      )}
      <div className="sticky top-0 z-30 col-start-2 col-end-2 mb-6">
        <TopbarContainer />
      </div>

      <main className="isolate z-20 col-span-full grid grid-cols-subgrid [&>*]:col-start-2 [&>*]:col-end-2">
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
