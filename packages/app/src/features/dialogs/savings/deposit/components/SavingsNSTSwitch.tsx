import { assets } from "@/ui/assets";
import { Switch } from "@/ui/atoms/switch/Switch";

export interface SavingsNSTSwitchProps {
  checked: boolean
  onSwitchClick: () => void
}

export function SavingsNSTSwitch({ checked, onSwitchClick }: SavingsNSTSwitchProps) {
  return (
    <div className="rounded-xl border border-basics-green/50 p-4 flex justify-between items-center bg-basics-green/5">
      <div className="flex items-center gap-3">
        <img src={assets.rocket} />
        <div>Deposit into <span className="text-basics-green">Savings NST</span> and get more benefits!</div>
      </div>
      <Switch checked={checked} onClick={onSwitchClick} />
    </div>
  )
}
