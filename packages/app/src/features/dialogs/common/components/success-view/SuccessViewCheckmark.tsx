import { assets } from '@/ui/assets'

export function SuccessViewCheckmark() {
  return (
    <div className="flex flex-col items-center gap-5">
      <img src={assets.success} alt="success-img" />
      <h2 className="font-semibold text-[1.75rem]">Congrats! All done!</h2>
    </div>
  )
}
