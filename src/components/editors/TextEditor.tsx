import type { TextElement } from '../../types'
import { FONT_FAMILIES } from '../../types'
import AnchorPicker from '../AnchorPicker'
import OffsetControls from './OffsetControls'
import {
  ColorInput,
  Field,
  NumberInput,
  Slider,
  TextArea,
  TextInput,
  Toggle,
} from '../fields'

interface Props {
  el: TextElement
  patch: (p: Partial<TextElement>) => void
}

const FONT_LABELS: Record<string, string> = {
  '"Noto Sans KR"': 'Noto Sans KR (기본)',
  '"Black Han Sans"': 'Black Han Sans (굵은 제목)',
  'system-ui, sans-serif': '시스템 기본',
}

export default function TextEditor({ el, patch }: Props) {
  return (
    <div className="space-y-4">
      <Field label="이름 (목록 표시용)">
        <TextInput value={el.name} onChange={(v) => patch({ name: v })} />
      </Field>

      <Field label="텍스트 내용 (줄바꿈 가능)">
        <TextArea value={el.text} onChange={(v) => patch({ text: v })} />
      </Field>

      <Field label="위치 (앵커)">
        <AnchorPicker value={el.anchor} onChange={(a) => patch({ anchor: a })} />
      </Field>

      <OffsetControls el={el} patch={patch} />

      <div className="grid grid-cols-2 gap-3">
        <Field label="폰트">
          <select
            className="w-full rounded border border-slate-600 bg-slate-800 px-2 py-1 text-sm text-slate-100"
            value={el.fontFamily}
            onChange={(e) => patch({ fontFamily: e.target.value })}
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f} value={f}>
                {FONT_LABELS[f] ?? f}
              </option>
            ))}
          </select>
        </Field>
        <Field label="굵기">
          <select
            className="w-full rounded border border-slate-600 bg-slate-800 px-2 py-1 text-sm text-slate-100"
            value={el.fontWeight}
            onChange={(e) => patch({ fontWeight: Number(e.target.value) })}
          >
            {[400, 500, 700, 900].map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label={`글자 크기 (${el.fontSize}px)`}>
        <Slider
          min={16}
          max={200}
          value={el.fontSize}
          onChange={(v) => patch({ fontSize: v })}
        />
      </Field>

      <Field label="글자 색">
        <ColorInput value={el.color} onChange={(v) => patch({ color: v })} />
      </Field>

      <div className="rounded border border-slate-700 p-3">
        <p className="mb-2 text-xs font-semibold text-slate-300">
          가독성 (영상 위 겹침용)
        </p>
        <div className="space-y-3">
          <Field label="외곽선 색">
            <ColorInput
              value={el.strokeColor}
              onChange={(v) => patch({ strokeColor: v })}
            />
          </Field>
          <Field label={`외곽선 두께 (${el.strokeWidth}px)`}>
            <Slider
              min={0}
              max={24}
              value={el.strokeWidth}
              onChange={(v) => patch({ strokeWidth: v })}
            />
          </Field>
          <Toggle
            label="그림자"
            value={el.shadow}
            onChange={(v) => patch({ shadow: v })}
          />
        </div>
      </div>

      <div className="rounded border border-slate-700 p-3">
        <Toggle
          label="배경 박스 사용"
          value={el.bgBox}
          onChange={(v) => patch({ bgBox: v })}
        />
        {el.bgBox && (
          <div className="mt-3 space-y-3">
            <Field label="배경 색 (rgba 가능)">
              <ColorInput
                value={el.bgColor}
                onChange={(v) => patch({ bgColor: v })}
              />
            </Field>
            <Field label="여백 (padding)">
              <NumberInput
                value={el.bgPadding}
                onChange={(v) => patch({ bgPadding: v })}
              />
            </Field>
          </div>
        )}
      </div>
    </div>
  )
}
