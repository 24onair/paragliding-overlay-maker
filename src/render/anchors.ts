import type { Anchor } from '../types'

export interface Box {
  x: number
  y: number
}

/**
 * 앵커 + 오프셋으로 요소의 좌상단(top-left) 좌표를 계산한다.
 * - top-*    : margin 만큼 위에서 띄움
 * - bottom-* : margin 만큼 아래에서 띄움
 * - *-left   : margin 만큼 왼쪽에서 띄움
 * - *-center : 가로 중앙 정렬
 * - *-right  : margin 만큼 오른쪽에서 띄움
 * 마지막에 offsetX / offsetY 를 더한다.
 */
export function computePosition(
  anchor: Anchor,
  elemW: number,
  elemH: number,
  canvasW: number,
  canvasH: number,
  margin: number,
  offsetX: number,
  offsetY: number,
): Box {
  const [vertical, horizontal] = anchor.split('-') as [
    'top' | 'bottom',
    'left' | 'center' | 'right',
  ]

  let x: number
  if (horizontal === 'left') x = margin
  else if (horizontal === 'right') x = canvasW - margin - elemW
  else x = (canvasW - elemW) / 2

  let y: number
  if (vertical === 'top') y = margin
  else y = canvasH - margin - elemH

  return { x: x + offsetX, y: y + offsetY }
}
