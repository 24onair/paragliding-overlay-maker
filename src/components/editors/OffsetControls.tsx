import { Field, Slider } from '../fields'

// 앵커 기준 X/Y 미세 조정 (음수/양수 모두 허용)
// patch 시그니처는 offset만 다루도록 최소화하여 Text/Image 에디터 양쪽에서 재사용
export default function OffsetControls({
  el,
  patch,
}: {
  el: { offsetX: number; offsetY: number }
  patch: (p: { offsetX?: number; offsetY?: number }) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Field label={`X 오프셋 (${el.offsetX}px)`}>
        <Slider
          min={-960}
          max={960}
          value={el.offsetX}
          onChange={(v) => patch({ offsetX: v })}
        />
      </Field>
      <Field label={`Y 오프셋 (${el.offsetY}px)`}>
        <Slider
          min={-540}
          max={540}
          value={el.offsetY}
          onChange={(v) => patch({ offsetY: v })}
        />
      </Field>
    </div>
  )
}
