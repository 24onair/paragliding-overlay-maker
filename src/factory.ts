import type {
  Anchor,
  ImageElement,
  OverlayElement,
  Project,
  TextElement,
} from './types'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './types'

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return 'id-' + Math.random().toString(36).slice(2, 10)
}

export function createTextElement(partial: Partial<TextElement> = {}): TextElement {
  return {
    id: uid(),
    type: 'text',
    name: '텍스트',
    anchor: 'top-center',
    offsetX: 0,
    offsetY: 0,
    visible: true,
    text: '텍스트를 입력하세요',
    fontFamily: '"Noto Sans KR"',
    fontSize: 72,
    fontWeight: 700,
    color: '#ffffff',
    strokeColor: '#000000',
    strokeWidth: 6,
    shadow: true,
    bgBox: false,
    bgColor: 'rgba(0,0,0,0.5)',
    bgPadding: 16,
    ...partial,
  }
}

export function createImageElement(
  partial: Partial<ImageElement> = {},
): ImageElement {
  return {
    id: uid(),
    type: 'image',
    name: '이미지',
    anchor: 'bottom-center',
    offsetX: 0,
    offsetY: 0,
    visible: true,
    src: '',
    maxWidth: 480,
    maxHeight: 240,
    opacity: 1,
    ...partial,
  }
}

/** 방송용 기본 레이아웃 시드 */
export function createDefaultProject(): Project {
  const elements: OverlayElement[] = [
    createTextElement({
      name: '이벤트명',
      text: '2026 전국 패러글라이딩 대회',
      anchor: 'top-center' as Anchor,
      fontSize: 84,
      fontWeight: 900,
      offsetY: 8,
    }),
    createTextElement({
      name: '장소',
      text: '강원도 평창 활공장',
      anchor: 'top-center' as Anchor,
      fontSize: 44,
      fontWeight: 500,
      offsetY: 130,
    }),
    createImageElement({
      name: '채널 배너',
      anchor: 'top-right' as Anchor,
      maxWidth: 360,
      maxHeight: 160,
    }),
    createImageElement({
      name: '후원사 배너',
      anchor: 'bottom-center' as Anchor,
      maxWidth: 900,
      maxHeight: 160,
    }),
  ]
  return {
    canvas: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
    margin: 48,
    elements,
  }
}
