import type { OverlayElement } from '../types'

interface Props {
  elements: OverlayElement[]
  selectedId: string | null
  onSelect: (id: string) => void
  onToggleVisible: (id: string) => void
  onRemove: (id: string) => void
  onMove: (id: string, dir: -1 | 1) => void
}

// 목록 순서 = 그리는 순서(위 항목이 아래에 깔리고, 아래 항목이 위에 그려짐)
export default function ElementList({
  elements,
  selectedId,
  onSelect,
  onToggleVisible,
  onRemove,
  onMove,
}: Props) {
  if (elements.length === 0) {
    return (
      <p className="px-1 py-4 text-center text-xs text-slate-500">
        요소가 없습니다. 아래에서 추가하세요.
      </p>
    )
  }
  return (
    <ul className="space-y-1">
      {elements.map((el, i) => {
        const active = el.id === selectedId
        return (
          <li
            key={el.id}
            className={`flex items-center gap-1 rounded border px-2 py-1.5 ${
              active
                ? 'border-sky-400 bg-sky-500/10'
                : 'border-slate-700 bg-slate-800/50'
            }`}
          >
            <button
              type="button"
              onClick={() => onToggleVisible(el.id)}
              title={el.visible ? '숨기기' : '표시'}
              className="text-sm"
            >
              {el.visible ? '👁️' : '🚫'}
            </button>
            <button
              type="button"
              onClick={() => onSelect(el.id)}
              className="flex-1 truncate text-left text-sm text-slate-200"
            >
              <span className="mr-1 text-xs text-slate-500">
                {el.type === 'text' ? 'T' : '🖼'}
              </span>
              {el.name}
            </button>
            <button
              type="button"
              disabled={i === 0}
              onClick={() => onMove(el.id, -1)}
              className="px-1 text-xs text-slate-400 disabled:opacity-30"
              title="아래로 (뒤로)"
            >
              ↓
            </button>
            <button
              type="button"
              disabled={i === elements.length - 1}
              onClick={() => onMove(el.id, 1)}
              className="px-1 text-xs text-slate-400 disabled:opacity-30"
              title="위로 (앞으로)"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => onRemove(el.id)}
              className="px-1 text-xs text-rose-400 hover:text-rose-300"
              title="삭제"
            >
              ✕
            </button>
          </li>
        )
      })}
    </ul>
  )
}
