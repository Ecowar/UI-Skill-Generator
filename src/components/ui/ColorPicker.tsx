import { HexColorPicker } from 'react-colorful'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  label?: string
}

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={pickerRef}>
      {label && <label className="block text-xs text-gray-600 mb-1">{label}</label>}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="w-full h-8 border border-gray-300 rounded cursor-pointer flex items-center gap-2 px-2"
      >
        <div 
          className="w-6 h-6 rounded border border-gray-300" 
          style={{ backgroundColor: color }}
        />
        <span className="text-xs text-gray-600 flex-1">{color}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 z-50 bg-white p-3 rounded-lg shadow-lg border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <HexColorPicker color={color} onChange={onChange} style={{ width: 200, height: 150 }} />
          <input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2 w-full px-2 py-1 text-xs border border-gray-300 rounded"
          />
        </div>
      )}
    </div>
  )
}
