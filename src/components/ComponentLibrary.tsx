import { 
  Type, 
  Square, 
  Minus, 
  Image, 
  CreditCard, 
  Layout,
  Star,
  ToggleLeft,
  FileText,
  ChevronDown
} from 'lucide-react'

type ComponentType = 
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

interface ComponentItem {
  type: ComponentType
  label: string
  icon: React.ReactNode
}

const componentList: ComponentItem[] = [
  { type: 'text', label: '文本', icon: <Type size={20} /> },
  { type: 'button', label: '按钮', icon: <Square size={20} /> },
  { type: 'input', label: '输入框', icon: <Minus size={20} /> },
  { type: 'image', label: '图片', icon: <Image size={20} /> },
  { type: 'card', label: '卡片', icon: <CreditCard size={20} /> },
  { type: 'navbar', label: '导航栏', icon: <Layout size={20} /> },
  { type: 'icon', label: '图标', icon: <Star size={20} /> },
  { type: 'switch', label: '开关', icon: <ToggleLeft size={20} /> },
  { type: 'textarea', label: '文本域', icon: <FileText size={20} /> },
  { type: 'select', label: '下拉框', icon: <ChevronDown size={20} /> },
]

interface ComponentLibraryProps {
  onDragStart: () => void
}

export function ComponentLibrary({ onDragStart }: ComponentLibraryProps) {
  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700">组件库</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2">
          {componentList.map((item) => (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('componentType', item.type)
                onDragStart()
              }}
              className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-grab hover:bg-gray-100 transition-colors border border-gray-200 active:cursor-grabbing"
            >
              <div className="text-gray-600">{item.icon}</div>
              <span className="text-xs text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
