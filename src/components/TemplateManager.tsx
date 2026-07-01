import { useRef, useState } from 'react'
import type { Project } from '../types'
import { useTemplates } from '../hooks/useTemplates'

interface Props {
  project: Project
  onLoad: (p: Project) => void
}

export default function TemplateManager({ project, onLoad }: Props) {
  const { templates, save, remove } = useTemplates()
  const [name, setName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    save(trimmed, project)
    setName('')
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'overlay-template.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJson = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Project
        if (parsed && parsed.canvas && Array.isArray(parsed.elements)) {
          onLoad(parsed)
        } else {
          alert('올바른 템플릿 JSON이 아닙니다.')
        }
      } catch {
        alert('JSON 파싱에 실패했습니다.')
      }
    }
    reader.readAsText(file)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="템플릿 이름"
          className="flex-1 rounded border border-slate-600 bg-slate-800 px-2 py-1 text-sm text-slate-100 focus:border-sky-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSave}
          className="rounded bg-sky-600 px-3 py-1 text-sm text-white hover:bg-sky-500"
        >
          저장
        </button>
      </div>

      {templates.length > 0 && (
        <ul className="space-y-1">
          {templates.map((t) => (
            <li
              key={t.name}
              className="flex items-center gap-2 rounded border border-slate-700 bg-slate-800/50 px-2 py-1.5 text-sm"
            >
              <span className="flex-1 truncate text-slate-200">{t.name}</span>
              <button
                type="button"
                onClick={() => onLoad(t.project)}
                className="text-xs text-sky-400 hover:text-sky-300"
              >
                불러오기
              </button>
              <button
                type="button"
                onClick={() => remove(t.name)}
                className="text-xs text-rose-400 hover:text-rose-300"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={exportJson}
          className="flex-1 rounded border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:border-slate-400"
        >
          JSON 내보내기
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex-1 rounded border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:border-slate-400"
        >
          JSON 가져오기
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => importJson(e.target.files?.[0])}
        />
      </div>
    </div>
  )
}
