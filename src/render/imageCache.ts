// data URL(src) 문자열을 키로 HTMLImageElement 를 로드/캐시한다.
// 이미지가 새로 로드되면 onLoad 콜백으로 재렌더를 유도한다.

type Entry = { img: HTMLImageElement; loaded: boolean }

export class ImageCache {
  private map = new Map<string, Entry>()
  private onLoad: () => void

  constructor(onLoad: () => void) {
    this.onLoad = onLoad
  }

  /** 로드 완료된 이미지를 반환. 아직 로딩 중이거나 없으면 null. */
  get(src: string): HTMLImageElement | null {
    if (!src) return null
    const existing = this.map.get(src)
    if (existing) return existing.loaded ? existing.img : null

    const img = new Image()
    const entry: Entry = { img, loaded: false }
    this.map.set(src, entry)
    img.onload = () => {
      entry.loaded = true
      this.onLoad()
    }
    img.onerror = () => {
      // 실패해도 무한 로딩되지 않도록 캐시에서 제거
      this.map.delete(src)
    }
    img.src = src
    return null
  }
}
