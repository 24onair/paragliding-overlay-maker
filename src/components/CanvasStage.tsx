import { useEffect, useRef, useState } from 'react'
import type { Project } from '../types'
import { drawScene } from '../render/drawScene'
import { ImageCache } from '../render/imageCache'

interface Props {
  project: Project
  canvasRef: React.RefObject<HTMLCanvasElement>
  showChecker: boolean
  bgImage: string | null
}

export default function CanvasStage({
  project,
  canvasRef,
  showChecker,
  bgImage,
}: Props) {
  const cacheRef = useRef<ImageCache | null>(null)
  const [tick, setTick] = useState(0)

  if (!cacheRef.current) {
    cacheRef.current = new ImageCache(() => setTick((t) => t + 1))
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = () => drawScene(ctx, project, cacheRef.current!)
    render()
    // 웹폰트 로드가 끝나면 정확한 글자폭으로 재렌더
    document.fonts.ready.then(render)
    // 의존성: project 변경 + 이미지 로드(tick)
  }, [project, tick, canvasRef])

  const { width, height } = project.canvas

  return (
    <div className="flex h-full items-center justify-center overflow-hidden p-4">
      <div
        className={`relative w-full max-w-full shadow-2xl ${
          showChecker ? 'checkerboard' : ''
        }`}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {bgImage && (
          <img
            src={bgImage}
            alt="배경 참조"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
        )}
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="relative block h-full w-full"
        />
      </div>
    </div>
  )
}
