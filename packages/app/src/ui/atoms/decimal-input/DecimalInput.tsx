import { InputHTMLAttributes } from 'react'

const decimalNumberRegex = /^\d+\.?\d*$/

export function DecimalInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      onChange={(e) => {
        if (decimalNumberRegex.test(e.target.value)) {
          e.target.value = e.target.value.replace(/,/g, '.')
          props.onChange?.(e)
        }
      }}
    />
  )
}
