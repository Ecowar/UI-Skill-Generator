import { useRef, useState, useEffect, useMemo } from 'react'
import { useCanvasStore } from '../store/canvasStore'
import type { CanvasComponent, ComponentType } from '../store/canvasStore'

const VIEWPORT_SIZES = {
  desktop: { width: 800, height: 600 },
  tablet: { width: 768, height: 600 },
  mobile: { width: 375, height: 600 },
}

const SNAP_THRESHOLD = 5

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { components, selectedId, addComponent, setSelectedId, updatePosition, deleteComponent, settings, undo, redo } = useCanvasStore()
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [snapLines, setSnapLines] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] })
  
  const showGuide = useMemo(() => components.length === 0, [components.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = document.activeElement
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault()
        deleteComponent(selectedId)
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          redo()
        } else {
          undo()
        }
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId, deleteComponent, undo, redo])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const componentType = e.dataTransfer.getData('componentType') as ComponentType
    if (!componentType || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - 60
    const y = e.clientY - rect.top - 20

    addComponent(componentType, Math.max(0, x), Math.max(0, y))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const getSnapLines = (currentComp: CanvasComponent, newX: number, newY: number) => {
    if (!settings.snapToGrid) return { x: [], y: [] }
    
    const lines: { x: number[]; y: number[] } = { x: [], y: [] }
    const others = components.filter(c => c.id !== currentComp.id)
    
    others.forEach(other => {
      if (Math.abs(newX - other.x) < SNAP_THRESHOLD) lines.x.push(other.x)
      if (Math.abs(newX + currentComp.style.width - other.x - other.style.width) < SNAP_THRESHOLD) {
        lines.x.push(other.x + other.style.width - currentComp.style.width)
      }
      if (Math.abs(newY - other.y) < SNAP_THRESHOLD) lines.y.push(other.y)
      if (Math.abs(newY + currentComp.style.height - other.y - other.style.height) < SNAP_THRESHOLD) {
        lines.y.push(other.y + other.style.height - currentComp.style.height)
      }
    })
    
    return lines
  }

  const handleMouseDown = (e: React.MouseEvent, component: CanvasComponent) => {
    if (e.button !== 0) return
    e.stopPropagation()
    setSelectedId(component.id)
    setDraggingId(component.id)
    
    const offsetX = e.clientX - component.x
    const offsetY = e.clientY - component.y
    setDragOffset({ x: offsetX, y: offsetY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !canvasRef.current) return

    const draggingComp = components.find(c => c.id === draggingId)
    if (!draggingComp) return

    let newX = e.clientX - dragOffset.x
    let newY = e.clientY - dragOffset.y

    const viewportSize = VIEWPORT_SIZES[settings.viewportMode]
    newX = Math.max(0, Math.min(newX, viewportSize.width - draggingComp.style.width))
    newY = Math.max(0, Math.min(newY, viewportSize.height - draggingComp.style.height))

    if (settings.snapToGrid) {
      const lines = getSnapLines(draggingComp, newX, newY)
      setSnapLines(lines)
      
      if (lines.x.length > 0) newX = lines.x[0]
      if (lines.y.length > 0) newY = lines.y[0]
    }

    updatePosition(draggingId, newX, newY)
  }

  const handleMouseUp = () => {
    setDraggingId(null)
    setSnapLines({ x: [], y: [] })
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedId(null)
    }
  }

  const getBoxShadow = (component: CanvasComponent): string => {
    const { shadow } = component.style
    if (!shadow) return 'none'
    return `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`
  }

  const getBorderStyle = (component: CanvasComponent): string => {
    const { borderWidth, borderStyle, borderColor } = component.style
    if (borderStyle === 'none') return 'none'
    return `${borderWidth}px ${borderStyle} ${borderColor}`
  }

  const renderComponentContent = (component: CanvasComponent) => {
    switch (component.type) {
      case 'input':
        return (
          <input
            type="text"
            placeholder={component.content}
            className="w-full h-full bg-transparent outline-none text-inherit"
            style={{ fontSize: component.style.fontSize, textAlign: component.style.textAlign }}
            onClick={(e) => e.stopPropagation()}
          />
        )
      case 'textarea':
        return (
          <textarea
            placeholder={component.content}
            className="w-full h-full bg-transparent outline-none text-inherit resize-none"
            style={{ fontSize: component.style.fontSize, lineHeight: component.style.lineHeight, textAlign: component.style.textAlign }}
            onClick={(e) => e.stopPropagation()}
          />
        )
      case 'switch':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full shadow-md transform translate-x-3" />
          </div>
        )
      case 'select':
        return (
          <div className="w-full h-full flex items-center justify-between px-2">
            <span style={{ fontSize: component.style.fontSize }}>{component.content}</span>
            <span className="text-gray-400">▼</span>
          </div>
        )
      case 'card':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <span className="text-sm font-medium" style={{ fontSize: component.style.fontSize, fontWeight: component.style.fontWeight }}>
              {component.content}
            </span>
            <span className="text-xs text-gray-400 mt-1">卡片内容区域</span>
          </div>
        )
      case 'navbar':
        return (
          <div className="w-full h-full flex items-center px-4">
            <span className="font-medium" style={{ color: component.style.color }}>{component.content}</span>
            <div className="flex-1" />
            <span style={{ color: component.style.color, fontSize: 14 }}>菜单</span>
          </div>
        )
      case 'image':
        return component.imageUrl ? (
          <img src={component.imageUrl} alt="组件图片" className="w-full h-full" style={{ objectFit: component.style.objectFit }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">📷</div>
        )
      default:
        return <span>{component.content}</span>
    }
  }

  const sortedComponents = [...components].sort((a, b) => a.zIndex - b.zIndex)
  const viewportSize = VIEWPORT_SIZES[settings.viewportMode]
  const scale = settings.viewportMode === 'mobile' ? 1 : settings.viewportMode === 'tablet' ? 0.95 : 1

  return (
    <div className="flex-1 h-full bg-gray-100 flex items-center justify-center overflow-auto p-8">
      <div className="absolute top-16 right-80 z-10 bg-white px-3 py-1.5 rounded-lg shadow-md text-xs text-gray-600 space-x-3">
        <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">Delete</kbd> 删除</span>
        <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">Ctrl+Z</kbd> 撤销</span>
        <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">Ctrl+Y</kbd> 重做</span>
      </div>
      
      <div
        ref={canvasRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ width: viewportSize.width, height: viewportSize.height, transform: `scale(${scale})` }}
        className={`bg-white border-2 border-gray-300 relative shadow-lg origin-center ${settings.showGridLines ? 'canvas-grid-dots' : ''}`}
      >
        {snapLines.x.map((x, i) => (
          <div key={`x-${i}`} className="absolute top-0 bottom-0 w-px bg-blue-400 pointer-events-none" style={{ left: x }} />
        ))}
        {snapLines.y.map((y, i) => (
          <div key={`y-${i}`} className="absolute left-0 right-0 h-px bg-blue-400 pointer-events-none" style={{ top: y }} />
        ))}

        {sortedComponents.map((component) => (
          <div
            key={component.id}
            onMouseDown={(e) => handleMouseDown(e, component)}
            style={{
              position: 'absolute',
              left: component.x,
              top: component.y,
              width: component.style.width,
              height: component.style.height,
              fontSize: component.style.fontSize,
              fontWeight: component.style.fontWeight,
              color: component.style.color,
              backgroundColor: component.style.backgroundColor,
              borderRadius: component.style.borderRadius,
              padding: component.style.padding,
              border: selectedId === component.id ? '2px solid #3b82f6' : getBorderStyle(component),
              cursor: draggingId === component.id ? 'grabbing' : 'grab',
              userSelect: 'none',
              zIndex: component.zIndex,
              boxShadow: getBoxShadow(component),
              opacity: component.style.opacity,
              textAlign: component.style.textAlign,
              lineHeight: component.style.lineHeight,
            }}
            className="overflow-hidden flex items-center justify-center"
          >
            {renderComponentContent(component)}
          </div>
        ))}

        {components.length === 0 && showGuide && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-center space-y-4">
              <div className="text-6xl">🎨</div>
              <p className="text-xl font-medium text-gray-700">拖拽组件到画布开始设计</p>
              <p className="text-sm text-gray-500">从左侧组件库选择组件，拖放到此处</p>
              <div className="flex gap-2 justify-center pt-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs">支持撤销重做</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded text-xs">多种预设模板</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
