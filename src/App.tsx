import { useMemo, useRef, useState } from 'react'
import type { OverlayElement, Project } from './types'
import { createDefaultProject, createImageElement, createTextElement } from './factory'
import CanvasStage from './components/CanvasStage'
import ElementList from './components/ElementList'
import TextEditor from './components/editors/TextEditor'
import ImageEditor from './components/editors/ImageEditor'
import TemplateManager from './components/TemplateManager'

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-slate-800 p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function App() {
  const [project, setProject] = useState<Project>(() => createDefaultProject())
  const [selectedId, setSelectedId] = useState<string | null>(
    () => project.elements[0]?.id ?? null,
  )
  const [bgImage, setBgImage] = useState<string | null>(null)
  const [showChecker, setShowChecker] = useState(true)
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const selected = useMemo(
    () => project.elements.find((e) => e.id === selectedId) ?? null,
    [project, selectedId],
  )

  const updateElement = (id: string, patch: Partial<OverlayElement>) => {
    setProject((p) => ({
      ...p,
      elements: p.elements.map((e) =>
        e.id === id ? ({ ...e, ...patch } as OverlayElement) : e,
      ),
    }))
  }

  const patchSelected = (patch: Partial<OverlayElement>) => {
    if (selectedId) updateElement(selectedId, patch)
  }

  const addElement = (el: OverlayElement) => {
    setProject((p) => ({ ...p, elements: [...p.elements, el] }))
    setSelectedId(el.id)
  }

  const removeElement = (id: string) => {
    setProject((p) => ({ ...p, elements: p.elements.filter((e) => e.id !== id) }))
    setSelectedId((cur) => (cur === id ? null : cur))
  }

  const toggleVisible = (id: string) =>
    setProject((p) => ({
      ...p,
      elements: p.elements.map((e) =>
        e.id === id ? { ...e, visible: !e.visible } : e,
      ),
    }))

  const moveElement = (id: string, dir: -1 | 1) => {
    setProject((p) => {
      const idx = p.elements.findIndex((e) => e.id === id)
      const next = idx + dir
      if (idx < 0 || next < 0 || next >= p.elements.length) return p
      const arr = [...p.elements]
      ;[arr[idx], arr[next]] = [arr[next], arr[idx]]
      return { ...p, elements: arr }
    })
  }

  const loadProject = (p: Project) => {
    setProject(p)
    setSelectedId(p.elements[0]?.id ?? null)
  }

  const onBgFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setBgImage(String(reader.result))
    reader.readAsDataURL(file)
  }

  const baseName = () => {
    const evt = project.elements.find(
      (e) => e.type === 'text' && e.name.includes('이벤트'),
    ) as { text: string } | undefined
    const raw =
      evt?.text ??
      (project.elements.find((e) => e.type === 'text') as { text?: string })
        ?.text ??
      'overlay'
    return (
      raw
        .split('\n')[0]
        .trim()
        .replace(/[^\w가-힣ㄱ-ㅎㅏ-ㅣ\s-]/g, '')
        .replace(/\s+/g, '_')
        .slice(0, 40) || 'overlay'
    )
  }

  const exportPng = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${baseName()}_overlay_1920x1080.png`
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden font-sans lg:flex-row">
      {/* 모바일 전용 상단 바: 탭 전환 + 내보내기 */}
      <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 p-2 lg:hidden">
        <div className="flex overflow-hidden rounded-md border border-slate-700">
          <button
            type="button"
            onClick={() => setMobileView('edit')}
            className={`px-3 py-1.5 text-sm ${
              mobileView === 'edit'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            편집
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`px-3 py-1.5 text-sm ${
              mobileView === 'preview'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            미리보기
          </button>
        </div>
        <button
          type="button"
          onClick={exportPng}
          className="ml-auto rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          ⬇ PNG
        </button>
      </div>

      {/* 좌측 컨트롤 패널 */}
      <aside
        className={`${
          mobileView === 'edit' ? 'flex' : 'hidden'
        } min-h-0 flex-1 flex-col overflow-y-auto border-slate-800 bg-slate-900 lg:flex lg:w-[380px] lg:flex-none lg:border-r`}
      >
        <div className="sticky top-0 z-10 hidden border-b border-slate-800 bg-slate-900/95 p-4 backdrop-blur lg:block">
          <h1 className="text-lg font-bold text-white">
            패러글라이딩 방송 오버레이 제작기
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">
            1920×1080 투명 PNG · OBS 오버레이용
          </p>
          <button
            type="button"
            onClick={exportPng}
            className="mt-3 w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            ⬇ 투명 PNG 내보내기
          </button>
        </div>

        <Section title="요소 목록">
          <ElementList
            elements={project.elements}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onToggleVisible={toggleVisible}
            onRemove={removeElement}
            onMove={moveElement}
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => addElement(createTextElement())}
              className="flex-1 rounded border border-slate-600 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 hover:border-slate-400"
            >
              + 텍스트
            </button>
            <button
              type="button"
              onClick={() => addElement(createImageElement())}
              className="flex-1 rounded border border-slate-600 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 hover:border-slate-400"
            >
              + 이미지
            </button>
          </div>
        </Section>

        <Section title={selected ? `속성 · ${selected.name}` : '속성'}>
          {selected ? (
            selected.type === 'text' ? (
              <TextEditor
                el={selected}
                patch={patchSelected as (p: Partial<typeof selected>) => void}
              />
            ) : (
              <ImageEditor
                el={selected}
                patch={patchSelected as (p: Partial<typeof selected>) => void}
              />
            )
          ) : (
            <p className="text-xs text-slate-500">
              편집할 요소를 목록에서 선택하세요.
            </p>
          )}
        </Section>

        <Section title="템플릿 저장/불러오기">
          <TemplateManager project={project} onLoad={loadProject} />
        </Section>
      </aside>

      {/* 우측 미리보기 */}
      <main
        className={`${
          mobileView === 'preview' ? 'flex' : 'hidden'
        } min-h-0 flex-1 flex-col bg-slate-950 lg:flex`}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-800 px-4 py-2 text-xs text-slate-400">
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={showChecker}
              onChange={(e) => setShowChecker(e.target.checked)}
              className="h-3.5 w-3.5 accent-sky-500"
            />
            투명 격자
          </label>
          <label className="flex items-center gap-1.5">
            배경 참조 이미지
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onBgFile(e.target.files?.[0])}
              className="text-[11px] file:mr-2 file:rounded file:border-0 file:bg-slate-700 file:px-2 file:py-0.5 file:text-slate-200"
            />
          </label>
          {bgImage && (
            <button
              type="button"
              onClick={() => setBgImage(null)}
              className="text-rose-400 hover:text-rose-300"
            >
              배경 제거
            </button>
          )}
          <span className="ml-auto text-slate-500">
            미리보기 배경은 내보내기 PNG에 포함되지 않습니다
          </span>
        </div>
        <CanvasStage
          project={project}
          canvasRef={canvasRef}
          showChecker={showChecker}
          bgImage={bgImage}
        />
      </main>
    </div>
  )
}
