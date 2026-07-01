import { useCallback, useEffect, useState } from 'react'
import type { Project } from '../types'

const STORAGE_KEY = 'pg-overlay-templates'

export interface SavedTemplate {
  name: string
  savedAt: number
  project: Project
}

function readAll(): SavedTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(list: SavedTemplate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function useTemplates() {
  const [templates, setTemplates] = useState<SavedTemplate[]>([])

  useEffect(() => {
    setTemplates(readAll())
  }, [])

  const save = useCallback((name: string, project: Project) => {
    const list = readAll().filter((t) => t.name !== name)
    list.push({ name, savedAt: Date.now(), project })
    list.sort((a, b) => b.savedAt - a.savedAt)
    writeAll(list)
    setTemplates(list)
  }, [])

  const remove = useCallback((name: string) => {
    const list = readAll().filter((t) => t.name !== name)
    writeAll(list)
    setTemplates(list)
  }, [])

  return { templates, save, remove }
}
