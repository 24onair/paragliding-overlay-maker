import { useRef } from 'react'
import type { ImageElement } from '../../types'
import AnchorPicker from '../AnchorPicker'
import OffsetControls from './OffsetControls'
import { Field, Slider, TextInput } from '../fields'

interface Props {
  el: ImageElement
  patch: (p: Partial<ImageElement>) => void
}

export default function ImageEditor({ el, patch }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const onFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => patch({ src: String(reader.result) })
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4">
      <Field label="이름 (목록 표시용)">
        <TextInput value={el.name} onChange={(v) => patch({ name: v })} />
      </Field>

      <Field label="이미지 파일">
        <div className="space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0])}
            className="block w-full text-xs text-slate-400 file:mr-3 file:rounded file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-sky-500"
          />
          {el.src ? (
            <div className="flex items-center gap-2 rounded border border-slate-700 bg-slate-800/60 p-2">
              <img
                src={el.src}
                alt="미리보기"
                className="h-10 w-16 object-contain"
              />
              <button
                type="button"
                onClick={() => {
                  patch({ src: '' })
                  if (fileRef.current) fileRef.current.value = ''
                }}
                className="ml-auto text-xs text-rose-400 hover:text-rose-300"
              >
                제거
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              이미지를 업로드하면 아래 최대 크기에 맞춰 자동 리사이즈됩니다.
            </p>
          )}
        </div>
      </Field>

      <Field label="위치 (앵커)">
        <AnchorPicker value={el.anchor} onChange={(a) => patch({ anchor: a })} />
      </Field>

      <OffsetControls el={el} patch={patch} />

      <Field label={`최대 너비 (${el.maxWidth}px)`}>
        <Slider
          min={40}
          max={1920}
          value={el.maxWidth}
          onChange={(v) => patch({ maxWidth: v })}
        />
      </Field>
      <Field label={`최대 높이 (${el.maxHeight}px)`}>
        <Slider
          min={40}
          max={1080}
          value={el.maxHeight}
          onChange={(v) => patch({ maxHeight: v })}
        />
      </Field>
      <Field label={`불투명도 (${Math.round(el.opacity * 100)}%)`}>
        <Slider
          min={0}
          max={1}
          step={0.05}
          value={el.opacity}
          onChange={(v) => patch({ opacity: v })}
        />
      </Field>
    </div>
  )
}
