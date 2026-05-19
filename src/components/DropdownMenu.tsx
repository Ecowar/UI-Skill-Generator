import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface MenuItem {
  label: string
  shortcut?: string
  action?: () => void
  divider?: boolean
  disabled?: boolean
}

interface DropdownMenuProps {
  label: string
  items: MenuItem[]
}

export function DropdownMenu({ label, items }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  const handleItemClick = (item: MenuItem) => {
    if (!item.disabled && item.action) {
      item.action()
      setIsOpen(false)
    }
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className={`px-3 py-1.5 text-sm flex items-center gap-1 rounded hover:bg-gray-100 ${
          isOpen ? 'bg-gray-100' : ''
        }`}
      >
        {label}
        <ChevronDown size={12} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-48 py-1 z-50">
          {items.map((item, index) => {
            if (item.divider) {
              return <div key={index} className="border-t border-gray-200 my-1" />
            }
            return (
              <button
                key={index}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={`w-full px-4 py-2 text-sm text-left flex items-center justify-between ${
                  item.disabled 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <span>{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs text-gray-400 ml-4">{item.shortcut}</span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
