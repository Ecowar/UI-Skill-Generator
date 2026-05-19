import { create } from 'zustand'

export type ComponentType = 
  | 'text' 
  | 'button' 
  | 'input'
  | 'image'
  | 'card'
  | 'navbar'
  | 'icon'
  | 'switch'
  | 'textarea'
  | 'select'

export type TextAlign = 'left' | 'center' | 'right'
export type ObjectFit = 'fill' | 'contain' | 'cover' | 'none'

export interface ShadowPreset {
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
}

export interface ResponsiveSettings {
  hiddenOnMobile: boolean
  fullWidthOnMobile: boolean
  mobileWidth?: number
  mobileHeight?: number
  mobileX?: number
  mobileY?: number
}

export interface AnimationSettings {
  hoverEffect: string
  clickEffect: string
}

export interface StyleProps {
  width: number
  height: number
  fontSize: number
  fontWeight: number
  color: string
  backgroundColor: string
  borderRadius: number
  padding: number
  lineHeight: number
  textAlign: TextAlign
  borderWidth: number
  borderColor: string
  borderStyle: 'solid' | 'dashed' | 'dotted' | 'none'
  shadow: ShadowPreset | null
  objectFit: ObjectFit
  opacity: number
}

export interface CanvasComponent {
  id: string
  type: ComponentType
  x: number
  y: number
  zIndex: number
  style: StyleProps
  content: string
  imageUrl?: string
  responsive: ResponsiveSettings
  animation: AnimationSettings
  variableName?: string
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile'

export interface CanvasSettings {
  viewportMode: ViewportMode
  snapToGrid: boolean
  showGridLines: boolean
}

interface HistoryState {
  components: CanvasComponent[]
}

interface CanvasState {
  components: CanvasComponent[]
  selectedId: string | null
  settings: CanvasSettings
  history: HistoryState[]
  historyIndex: number
  addComponent: (type: ComponentType, x: number, y: number) => void
  updateComponent: (id: string, updates: Partial<CanvasComponent>) => void
  deleteComponent: (id: string) => void
  setSelectedId: (id: string | null) => void
  updatePosition: (id: string, x: number, y: number) => void
  moveLayerUp: (id: string) => void
  moveLayerDown: (id: string) => void
  bringToFront: (id: string) => void
  sendToBack: (id: string) => void
  updateSettings: (updates: Partial<CanvasSettings>) => void
  loadProject: (data: CanvasComponent[]) => void
  resetCanvas: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  pushHistory: () => void
}

const defaultShadow: ShadowPreset = {
  offsetX: 0,
  offsetY: 4,
  blur: 6,
  spread: 0,
  color: 'rgba(0, 0, 0, 0.1)',
}

const defaultResponsive: ResponsiveSettings = {
  hiddenOnMobile: false,
  fullWidthOnMobile: false,
}

const defaultAnimation: AnimationSettings = {
  hoverEffect: '',
  clickEffect: '',
}

const getDefaultStyle = (type: ComponentType): StyleProps => {
  const base: StyleProps = {
    width: 120,
    height: 40,
    fontSize: 14,
    fontWeight: 400,
    color: '#1f2937',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    padding: 8,
    lineHeight: 1.5,
    textAlign: 'left',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'solid',
    shadow: null,
    objectFit: 'cover',
    opacity: 1,
  }

  switch (type) {
    case 'text':
      return { ...base, height: 30, backgroundColor: 'transparent', width: 200, borderStyle: 'none' }
    case 'button':
      return { ...base, backgroundColor: '#3b82f6', color: '#ffffff', borderStyle: 'none', shadow: defaultShadow }
    case 'input':
      return { ...base, backgroundColor: '#ffffff', borderRadius: 6, textAlign: 'left' }
    case 'image':
      return { ...base, width: 150, height: 150, backgroundColor: '#f3f4f6', borderRadius: 8, borderStyle: 'dashed', objectFit: 'cover' }
    case 'card':
      return { ...base, width: 280, height: 180, backgroundColor: '#ffffff', borderRadius: 12, padding: 16, shadow: defaultShadow }
    case 'navbar':
      return { ...base, width: 600, height: 56, backgroundColor: '#1f2937', borderRadius: 0, color: '#ffffff', borderStyle: 'none' }
    case 'icon':
      return { ...base, width: 48, height: 48, backgroundColor: 'transparent', borderRadius: 0, borderStyle: 'none' }
    case 'switch':
      return { ...base, width: 50, height: 26, backgroundColor: '#d1d5db', borderRadius: 13, borderStyle: 'none' }
    case 'textarea':
      return { ...base, width: 240, height: 100, backgroundColor: '#ffffff', borderRadius: 6 }
    case 'select':
      return { ...base, width: 180, backgroundColor: '#ffffff', borderRadius: 6 }
    default:
      return base
  }
}

const getDefaultContent = (type: ComponentType): string => {
  const contents: Record<ComponentType, string> = {
    text: '文本内容',
    button: '按钮',
    input: '请输入...',
    image: '📷',
    card: '卡片标题',
    navbar: 'Logo',
    icon: '⭐',
    switch: '',
    textarea: '多行文本...',
    select: '下拉选项',
  }
  return contents[type] || ''
}

let zIndexCounter = 0
const typeCounters: Record<string, number> = {}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  components: [],
  selectedId: null,
  settings: {
    viewportMode: 'desktop',
    snapToGrid: false,
    showGridLines: false,
  },
  history: [],
  historyIndex: -1,

  pushHistory: () => {
    const { components, history, historyIndex } = get()
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ components: JSON.parse(JSON.stringify(components)) })
    if (newHistory.length > 50) newHistory.shift()
    set({ history: newHistory, historyIndex: newHistory.length - 1 })
  },

  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      set({
        components: JSON.parse(JSON.stringify(prevState.components)),
        historyIndex: historyIndex - 1,
        selectedId: null,
      })
    }
  },

  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      set({
        components: JSON.parse(JSON.stringify(nextState.components)),
        historyIndex: historyIndex + 1,
        selectedId: null,
      })
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  addComponent: (type, x, y) => {
    const id = `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    typeCounters[type] = (typeCounters[type] || 0) + 1
    const variableName = `${type}_${typeCounters[type]}`
    const newComponent: CanvasComponent = {
      id,
      type,
      x,
      y,
      zIndex: ++zIndexCounter,
      style: getDefaultStyle(type),
      content: getDefaultContent(type),
      responsive: { ...defaultResponsive },
      animation: { ...defaultAnimation },
      variableName,
    }
    set((state) => ({
      components: [...state.components, newComponent],
      selectedId: id,
    }))
    get().pushHistory()
  },

  updateComponent: (id, updates) => {
    set((state) => ({
      components: state.components.map((comp) =>
        comp.id === id ? { ...comp, ...updates } : comp
      ),
    }))
  },

  deleteComponent: (id) => {
    set((state) => ({
      components: state.components.filter((comp) => comp.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }))
    get().pushHistory()
  },

  setSelectedId: (id) => {
    set({ selectedId: id })
  },

  updatePosition: (id, x, y) => {
    set((state) => ({
      components: state.components.map((comp) =>
        comp.id === id ? { ...comp, x, y } : comp
      ),
    }))
  },

  moveLayerUp: (id) => {
    const { components } = get()
    const sorted = [...components].sort((a, b) => a.zIndex - b.zIndex)
    const idx = sorted.findIndex((c) => c.id === id)
    if (idx < sorted.length - 1) {
      const currentZ = sorted[idx].zIndex
      const nextZ = sorted[idx + 1].zIndex
      set({
        components: components.map((c) => {
          if (c.id === id) return { ...c, zIndex: nextZ }
          if (c.id === sorted[idx + 1].id) return { ...c, zIndex: currentZ }
          return c
        }),
      })
    }
  },

  moveLayerDown: (id) => {
    const { components } = get()
    const sorted = [...components].sort((a, b) => a.zIndex - b.zIndex)
    const idx = sorted.findIndex((c) => c.id === id)
    if (idx > 0) {
      const currentZ = sorted[idx].zIndex
      const prevZ = sorted[idx - 1].zIndex
      set({
        components: components.map((c) => {
          if (c.id === id) return { ...c, zIndex: prevZ }
          if (c.id === sorted[idx - 1].id) return { ...c, zIndex: currentZ }
          return c
        }),
      })
    }
  },

  bringToFront: (id) => {
    const maxZ = Math.max(...get().components.map((c) => c.zIndex), 0)
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, zIndex: maxZ + 1 } : c
      ),
    }))
  },

  sendToBack: (id) => {
    const minZ = Math.min(...get().components.map((c) => c.zIndex), 0)
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, zIndex: minZ - 1 } : c
      ),
    }))
  },

  updateSettings: (updates) => {
    set((state) => ({
      settings: { ...state.settings, ...updates },
    }))
  },

  loadProject: (data) => {
    Object.keys(typeCounters).forEach(key => delete typeCounters[key])
    data.forEach(comp => {
      typeCounters[comp.type] = (typeCounters[comp.type] || 0) + 1
    })
    zIndexCounter = Math.max(...data.map(c => c.zIndex), 0)
    set({ components: data, selectedId: null, history: [], historyIndex: -1 })
  },

  resetCanvas: () => {
    Object.keys(typeCounters).forEach(key => delete typeCounters[key])
    set({ components: [], selectedId: null, history: [], historyIndex: -1 })
  },
}))
