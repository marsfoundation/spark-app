import { assets } from '@/ui/assets'

export function SuccessViewCheckmark() {
  return (
    <div className="flex flex-col items-center gap-5">
      <img src={assets.success} alt="success-img" />
      <h2 className="text-[1.75rem] font-semibold">Congrats! All done!</h2>
    </div>
  )
}
