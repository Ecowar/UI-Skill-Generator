import { useState } from 'react'
import type { ShadowPreset } from '../../store/canvasStore'

interface ShadowSelectorProps {
  shadow: ShadowPreset | null
  onChange: (shadow: ShadowPreset | null) => void
}

const presets: { name: string; shadow: ShadowPreset | null }[] = [
  { 
    name: '无', 
    shadow: null 
  },
  { 
    name: '轻微', 
    shadow: { offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: 'rgba(0, 0, 0, 0.1)' } 
  },
  { 
    name: '柔和', 
    shadow: { offsetX: 0, offsetY: 4, blur: 6, spread: 0, color: 'rgba(0, 0, 0, 0.1)' } 
  },
  { 
    name: '中等', 
    shadow: { offsetX: 0, offsetY: 10, blur: 15, spread: 0, color: 'rgba(0, 0, 0, 0.1)' } 
  },
  { 
    name: '强烈', 
    shadow: { offsetX: 0, offsetY: 20, blur: 25, spread: 0, color: 'rgba(0, 0, 0, 0.15)' } 
  },
  { 
    name: '内阴影', 
    shadow: { offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: 'rgba(0, 0, 0, 0.1)' } 
  },
]

export function ShadowSelector({ shadow, onChange }: ShadowSelectorProps) {
  const [showCustom, setShowCustom] = useState(false)

  const getShadowStyle = (s: ShadowPreset | null): string => {
    if (!s) return 'none'
    const inset = s.offsetX < 0 || s.offsetY < 0 ? 'inset ' : ''
    return `${inset}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${s.color}`
  }

  const handlePresetClick = (preset: typeof presets[0]) => {
    onChange(preset.shadow)
    setShowCustom(preset.shadow !== null)
  }

  return (
    <div>
      <label className="block text-xs text-gray-600 mb-2">阴影</label>
      <div className="grid grid-cols-3 gap-2 mb-2">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(preset)}
            className={`p-2 text-xs border rounded transition-all ${
              JSON.stringify(shadow) === JSON.stringify(preset.shadow)
                ? 'border-blue-500 bg-blue-50 text-blue-600'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div 
              className="w-full h-6 mb-1 bg-white rounded"
              style={{ boxShadow: getShadowStyle(preset.shadow) }}
            />
            {preset.name}
          </button>
        ))}
      </div>
      
      {showCustom && shadow && (
        <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">X偏移</label>
              <input
                type="number"
                value={shadow.offsetX}
                onChange={(e) => onChange({ ...shadow, offsetX: Number(e.target.value) })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Y偏移</label>
              <input
                type="number"
                value={shadow.offsetY}
                onChange={(e) => onChange({ ...shadow, offsetY: Number(e.target.value) })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">模糊</label>
              <input
                type="number"
                value={shadow.blur}
                onChange={(e) => onChange({ ...shadow, blur: Number(e.target.value) })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">扩展</label>
              <input
                type="number"
                value={shadow.spread}
                onChange={(e) => onChange({ ...shadow, spread: Number(e.target.value) })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">颜色</label>
            <input
              type="text"
              value={shadow.color}
              onChange={(e) => onChange({ ...shadow, color: e.target.value })}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            />
          </div>
        </div>
      )}
    </div>
  )
}
