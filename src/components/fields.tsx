import type { ReactNode } from 'react'

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-400">
        {label}
      </span>
      {children}
    </label>
  )
}

const inputCls =
  'w-full rounded border border-slate-600 bg-slate-800 px-2 py-1 text-sm text-slate-100 focus:border-sky-400 focus:outline-none'

export function TextInput({
  value,
  onChange,
  ...rest
}: {
  value: string
  onChange: (v: string) => void
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <input
      {...rest}
      className={inputCls}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export function TextArea({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <textarea
      className={`${inputCls} min-h-[60px] resize-y`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export function NumberInput({
  value,
  onChange,
  ...rest
}: {
  value: number
  onChange: (v: number) => void
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <input
      {...rest}
      type="number"
      className={inputCls}
      value={Number.isFinite(value) ? value : 0}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  )
}

export function Slider({
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 flex-1 accent-sky-500"
      />
      <span className="w-12 text-right text-xs tabular-nums text-slate-400">
        {value}
      </span>
    </div>
  )
}

export function ColorInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={toHex(value)}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-10 cursor-pointer rounded border border-slate-600 bg-slate-800"
      />
      <input
        className={inputCls}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

// color input은 rgba()를 못 받으므로 hex만 안전하게 넘긴다
function toHex(v: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(v) ? v : '#000000'
}

export function Toggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-300">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-sky-500"
      />
      {label}
    </label>
  )
}
