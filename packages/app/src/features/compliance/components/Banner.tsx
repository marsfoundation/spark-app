import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { assets } from '@/ui/assets'

function Banner({ children }: { children: React.ReactNode }) {
  return (
    <MultiPanelDialog>
      <img src={assets.warning} alt="Blocked" className="h-[50px] w-[50px]" />
      {children}
    </MultiPanelDialog>
  )
}

function BannerContent({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>
}

function BannerHeader({ children }: { children: React.ReactNode }) {
  return <h2 className="font-semibold text-2xl text-black">{children}</h2>
}

function BannerDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-basics-black">{children}</p>
}

Banner.Content = BannerContent
Banner.Header = BannerHeader
Banner.Description = BannerDescription
export { Banner }
