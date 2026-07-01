import type { Project, TextElement, ImageElement } from '../types'
import { computePosition } from './anchors'
import { ImageCache } from './imageCache'

const LINE_HEIGHT_RATIO = 1.25

/** 텍스트 요소의 렌더 박스 크기(가장 넓은 줄 폭 x 전체 높이)를 계산 */
function measureText(
  ctx: CanvasRenderingContext2D,
  el: TextElement,
): { lines: string[]; width: number; height: number; lineHeight: number } {
  ctx.font = `${el.fontWeight} ${el.fontSize}px ${el.fontFamily}`
  const lines = el.text.split('\n')
  let width = 0
  for (const line of lines) {
    const w = ctx.measureText(line).width
    if (w > width) width = w
  }
  const lineHeight = el.fontSize * LINE_HEIGHT_RATIO
  return { lines, width, height: lineHeight * lines.length, lineHeight }
}

function drawText(
  ctx: CanvasRenderingContext2D,
  el: TextElement,
  project: Project,
) {
  const { lines, width, height, lineHeight } = measureText(ctx, el)
  const { width: cw, height: ch } = project.canvas
  const { x, y } = computePosition(
    el.anchor,
    width,
    height,
    cw,
    ch,
    project.margin,
    el.offsetX,
    el.offsetY,
  )

  ctx.save()
  ctx.textBaseline = 'top'
  ctx.textAlign = 'left'

  // 배경 박스
  if (el.bgBox) {
    ctx.fillStyle = el.bgColor
    ctx.fillRect(
      x - el.bgPadding,
      y - el.bgPadding,
      width + el.bgPadding * 2,
      height + el.bgPadding * 2,
    )
  }

  ctx.font = `${el.fontWeight} ${el.fontSize}px ${el.fontFamily}`
  ctx.lineJoin = 'round'
  ctx.miterLimit = 2

  lines.forEach((line, i) => {
    const ly = y + i * lineHeight
    // 그림자 (외곽선 위에 겹쳐 번지지 않게 fill 단계에서만 적용)
    if (el.strokeWidth > 0) {
      ctx.save()
      ctx.strokeStyle = el.strokeColor
      ctx.lineWidth = el.strokeWidth
      ctx.strokeText(line, x, ly)
      ctx.restore()
    }
    ctx.save()
    if (el.shadow) {
      ctx.shadowColor = 'rgba(0,0,0,0.6)'
      ctx.shadowBlur = el.fontSize * 0.12
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = el.fontSize * 0.06
    }
    ctx.fillStyle = el.color
    ctx.fillText(line, x, ly)
    ctx.restore()
  })

  ctx.restore()
}

/** 종횡비 유지하며 max 박스에 맞춘 렌더 크기 계산 */
export function fitImage(
  imgW: number,
  imgH: number,
  maxW: number,
  maxH: number,
): { width: number; height: number } {
  if (imgW <= 0 || imgH <= 0) return { width: 0, height: 0 }
  const scale = Math.min(maxW / imgW, maxH / imgH)
  return { width: imgW * scale, height: imgH * scale }
}

function drawImageEl(
  ctx: CanvasRenderingContext2D,
  el: ImageElement,
  project: Project,
  cache: ImageCache,
) {
  const img = cache.get(el.src)
  if (!img) return
  const { width, height } = fitImage(
    img.naturalWidth,
    img.naturalHeight,
    el.maxWidth,
    el.maxHeight,
  )
  const { width: cw, height: ch } = project.canvas
  const { x, y } = computePosition(
    el.anchor,
    width,
    height,
    cw,
    ch,
    project.margin,
    el.offsetX,
    el.offsetY,
  )
  ctx.save()
  ctx.globalAlpha = el.opacity
  ctx.drawImage(img, x, y, width, height)
  ctx.restore()
}

/** 전체 씬을 캔버스에 그린다. 배경은 칠하지 않아 투명 유지. */
export function drawScene(
  ctx: CanvasRenderingContext2D,
  project: Project,
  cache: ImageCache,
) {
  const { width, height } = project.canvas
  ctx.clearRect(0, 0, width, height)
  for (const el of project.elements) {
    if (!el.visible) continue
    if (el.type === 'text') drawText(ctx, el, project)
    else drawImageEl(ctx, el, project, cache)
  }
}
