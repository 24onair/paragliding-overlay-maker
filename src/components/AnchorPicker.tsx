import type { Anchor } from '../types'
import { ANCHOR_LABELS, ANCHORS } from '../types'

interface Props {
  value: Anchor
  onChange: (a: Anchor) => void
}

// 3열 x 2행 그리드로 6개 앵커를 시각적으로 선택
export default function AnchorPicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {ANCHORS.map((a) => {
        const active = a === value
        return (
          <button
            key={a}
            type="button"
            onClick={() => onChange(a)}
            title={ANCHOR_LABELS[a]}
            className={`rounded border px-1 py-2 text-[11px] transition ${
              active
                ? 'border-sky-400 bg-sky-500/20 text-sky-200'
                : 'border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-400'
            }`}
          >
            {ANCHOR_LABELS[a]}
          </button>
        )
      })}
    </div>
  )
}
