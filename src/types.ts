// 6개 앵커 위치(상단 좌/중/우, 하단 좌/중/우)
export type Anchor =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export const ANCHORS: Anchor[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]

export const ANCHOR_LABELS: Record<Anchor, string> = {
  'top-left': '상단 좌측',
  'top-center': '상단 중앙',
  'top-right': '상단 우측',
  'bottom-left': '하단 좌측',
  'bottom-center': '하단 중앙',
  'bottom-right': '하단 우측',
}

export type ElementType = 'text' | 'image'

export interface BaseElement {
  id: string
  type: ElementType
  name: string
  anchor: Anchor
  offsetX: number
  offsetY: number
  visible: boolean
}

export interface TextElement extends BaseElement {
  type: 'text'
  text: string
  fontFamily: string
  fontSize: number
  fontWeight: number
  color: string
  strokeColor: string
  strokeWidth: number
  shadow: boolean
  bgBox: boolean
  bgColor: string
  bgPadding: number
}

export interface ImageElement extends BaseElement {
  type: 'image'
  src: string // data URL (base64) — 템플릿 저장 시 이미지도 함께 보존
  maxWidth: number
  maxHeight: number
  opacity: number
}

export type OverlayElement = TextElement | ImageElement

export interface Project {
  canvas: { width: number; height: number }
  margin: number
  elements: OverlayElement[]
}

export const CANVAS_WIDTH = 1920
export const CANVAS_HEIGHT = 1080

export const FONT_FAMILIES = [
  '"Noto Sans KR"',
  '"Black Han Sans"',
  'system-ui, sans-serif',
]
