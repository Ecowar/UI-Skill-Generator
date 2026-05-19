import { useState, useRef } from 'react'
import { useCanvasStore } from '../store/canvasStore'
import { generatePrompt } from '../utils/promptGenerator'
import { PromptModal } from './PromptModal'
import { Sparkles, Eye, EyeOff, Monitor, Tablet, Smartphone, Save, FolderOpen, Trash2, Grid3X3, FilePlus, Upload, Layout } from 'lucide-react'
import type { CanvasComponent } from '../store/canvasStore'

const VIEWPORT_SIZES = {
  desktop: { width: 800, height: 600, label: '桌面端 1440px' },
  tablet: { width: 768, height: 600, label: '平板 768px' },
  mobile: { width: 375, height: 600, label: '移动端 375px' },
}

const CANVAS_PRESETS = [
  { width: 800, height: 600, label: '标准 (800×600)' },
  { width: 1024, height: 768, label: '大屏 (1024×768)' },
  { width: 1280, height: 720, label: '宽屏 (1280×720)' },
  { width: 375, height: 667, label: '移动端 (375×667)' },
]

const TEMPLATES: { name: string; icon: string; data: CanvasComponent[] }[] = [
  {
    name: '登录页',
    icon: '🔐',
    data: [
      {
        id: 'tpl-card-1',
        type: 'card',
        x: 250,
        y: 150,
        zIndex: 1,
        style: {
          width: 300,
          height: 320,
          fontSize: 14,
          fontWeight: 600,
          color: '#1f2937',
          backgroundColor: '#ffffff',
          borderRadius: 16,
          padding: 32,
          lineHeight: 1.5,
          textAlign: 'center',
          borderWidth: 0,
          borderColor: '#e5e7eb',
          borderStyle: 'none',
          shadow: { offsetX: 0, offsetY: 10, blur: 25, spread: 0, color: 'rgba(0,0,0,0.1)' },
          objectFit: 'cover',
          opacity: 1,
        },
        content: '登录',
        responsive: { hiddenOnMobile: false, fullWidthOnMobile: true },
        animation: { hoverEffect: '', clickEffect: '' },
      },
      {
        id: 'tpl-input-1',
        type: 'input',
        x: 280,
        y: 230,
        zIndex: 2,
        style: {
          width: 240,
          height: 44,
          fontSize: 14,
          fontWeight: 400,
          color: '#374151',
          backgroundColor: '#f9fafb',
          borderRadius: 8,
          padding: 12,
          lineHeight: 1.5,
          textAlign: 'left',
          borderWidth: 1,
          borderColor: '#e5e7eb',
          borderStyle: 'solid',
          shadow: null,
          objectFit: 'cover',
          opacity: 1,
        },
        content: '输入邮箱',
        responsive: { hiddenOnMobile: false, fullWidthOnMobile: false },
        animation: { hoverEffect: '', clickEffect: '' },
      },
      {
        id: 'tpl-input-2',
        type: 'input',
        x: 280,
        y: 284,
        zIndex: 3,
        style: {
          width: 240,
          height: 44,
          fontSize: 14,
          fontWeight: 400,
          color: '#374151',
          backgroundColor: '#f9fafb',
          borderRadius: 8,
          padding: 12,
          lineHeight: 1.5,
          textAlign: 'left',
          borderWidth: 1,
          borderColor: '#e5e7eb',
          borderStyle: 'solid',
          shadow: null,
          objectFit: 'cover',
          opacity: 1,
        },
        content: '输入密码',
        responsive: { hiddenOnMobile: false, fullWidthOnMobile: false },
        animation: { hoverEffect: '', clickEffect: '' },
      },
      {
        id: 'tpl-btn-1',
        type: 'button',
        x: 280,
        y: 350,
        zIndex: 4,
        style: {
          width: 240,
          height: 44,
          fontSize: 16,
          fontWeight: 600,
          color: '#ffffff',
          backgroundColor: '#3b82f6',
          borderRadius: 8,
          padding: 12,
          lineHeight: 1.5,
          textAlign: 'center',
          borderWidth: 0,
          borderColor: '#3b82f6',
          borderStyle: 'none',
          shadow: { offsetX: 0, offsetY: 4, blur: 12, spread: 0, color: 'rgba(59,130,246,0.3)' },
          objectFit: 'cover',
          opacity: 1,
        },
        content: '登录',
        responsive: { hiddenOnMobile: false, fullWidthOnMobile: false },
        animation: { hoverEffect: 'scale', clickEffect: '' },
      },
    ],
  },
  {
    name: '注册表单',
    icon: '📝',
    data: [
      {
        id: 'tpl-text-1',
        type: 'text',
        x: 300,
        y: 80,
        zIndex: 1,
        style: {
          width: 200,
          height: 30,
          fontSize: 24,
          fontWeight: 700,
          color: '#111827',
          backgroundColor: 'transparent',
          borderRadius: 0,
          padding: 0,
          lineHeight: 1.5,
          textAlign: 'center',
          borderWidth: 0,
          borderColor: '#d1d5db',
          borderStyle: 'none',
          shadow: null,
          objectFit: 'cover',
          opacity: 1,
        },
        content: '创建账户',
        responsive: { hiddenOnMobile: false, fullWidthOnMobile: false },
        animation: { hoverEffect: '', clickEffect: '' },
      },
      {
        id: 'tpl-input-3',
        type: 'input',
        x: 250,
        y: 140,
        zIndex: 2,
        style: {
          width: 300,
          height: 40,
          fontSize: 14,
          fontWeight: 400,
          color: '#374151',
          backgroundColor: '#ffffff',
          borderRadius: 6,
          padding: 10,
          lineHeight: 1.5,
          textAlign: 'left',
          borderWidth: 1,
          borderColor: '#d1d5db',
          borderStyle: 'solid',
          shadow: null,
          objectFit: 'cover',
          opacity: 1,
        },
        content: '用户名',
        responsive: { hiddenOnMobile: false, fullWidthOnMobile: false },
        animation: { hoverEffect: '', clickEffect: '' },
      },
      {
        id: 'tpl-input-4',
        type: 'input',
        x: 250,
        y: 190,
        zIndex: 3,
        style: {
          width: 300,
          height: 40,
          fontSize: 14,
          fontWeight: 400,
          color: '#374151',
          backgroundColor: '#ffffff',
          borderRadius: 6,
          padding: 10,
          lineHeight: 1.5,
          textAlign: 'left',
          borderWidth: 1,
          borderColor: '#d1d5db',
          borderStyle: 'solid',
          shadow: null,
          objectFit: 'cover',
          opacity: 1,
        },
        content: '邮箱地址',
        responsive: { hiddenOnMobile: false, fullWidthOnMobile: false },
        animation: { hoverEffect: '', clickEffect: '' },
      },
      {
        id: 'tpl-input-5',
        type: 'input',
        x: 250,
        y: 240,
        zIndex: 4,
        style: {
          width: 300,
          height: 40,
          fontSize: 14,
          fontWeight: 400,
          color: '#374151',
          backgroundColor: '#ffffff',
          borderRadius: 6,
          padding: 10,
          lineHeight: 1.5,
          textAlign: 'left',
          borderWidth: 1,
          borderColor: '#d1d5db',
          borderStyle: 'solid',
          shadow: null,
          objectFit: 'cover',
          opacity: 1,
        },
        content: '设置密码',
        responsive: { hiddenOnMobile: false, fullWidthOnMobile: false },
        animation: { hoverEffect: '', clickEffect: '' },
      },
      {
        id: 'tpl-btn-2',
        type: 'button',
        x: 250,
        y: 300,
        zIndex: 5,
        style: {
          width: 300,
          height: 44,
          fontSize: 16,
          fontWeight: 600,
          color: '#ffffff',
          backgroundColor: '#10b981',
          borderRadius: 6,
          padding: 12,
          lineHeight: 1.5,
          textAlign: 'center',
          borderWidth: 0,
          borderColor: '#10b981',
          borderStyle: 'none',
          shadow: { offsetX: 0, offsetY: 4, blur: 12, spread: 0, color: 'rgba(16,185,129,0.3)' },
          objectFit: 'cover',
          opacity: 1,
        },
        content: '注册',
        responsive: { hiddenOnMobile: false, fullWidthOnMobile: false },
        animation: { hoverEffect: 'scale', clickEffect: '' },
      },
    ],
  },
  {
    name: '产品卡片',
    icon: '🛍️',
    data: [
      {
        id: 'tpl-card-2',
        type: 'card',
        x: 250,
        y: 100,
        zIndex: 1,
        style: {
          width: 300,
          height: 400,
          fontSize: 14,
          fontWeight: 400,
          color: '#1f2937',
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: 0,
          lineHeight: 1.5,
          textAlign: 'left',
          borderWidth: 0,
          borderColor: '#e5e7eb',
          borderStyle: 'none',
          shadow: { offsetX: 0, offsetY: 10, blur: 30, spread: 0, color: 'rgba(0,0,0,0.15)' },
          objectFit: 'cover',
          opacity: 1,
        },
        content: '',
        responsive: { hiddenOnMobile: false, fullWidthOnMobile: false },
        animation: { hoverEffect: 'shadow', clickEffect: '' },
      },
      {
        id: 'tpl-img-1',
        type: 'image',
        x: 250,
        y: 100,
        zIndex: 2,
        style: {
          width: 300,
          height: 200,
          fontSize: 14,
          fontWeight: 400,
          color: '#9ca3af',
          backgroundColor: '#f3f4f6',
          borderRadius: 12,
          padding: 0,
          lineHeight: 1.5,
          textAlign: 'center',
          borderWidth: 0,
          borderColor: '#d1d5db',
          borderStyle: 'none',
          shadow: null,
          objectFit: 'cover',
          opacity: 1,
        },
        content: '📷',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-3d0a6d8f8f8f?w=300&h=200&fit=crop',
        responsive: { hiddenOnMobile: false, fullWidthOnMobile: false },
        animation: { hoverEffect: '', clickEffect: '' },
      },
      {
        id: 'tpl-text-2',
        type: 'text',
        x: 270,
        y: 320,
        zIndex: 3,
        style: {
          width: 260,
          height: 24,
          fontSize: 18,
          fontWeight: 700,
          color: '#111827',
          backgroundColor: 'transparent',
          borderRadius: 0,
          padding: 0,
          lineHeight: 1.3,
          textAlign: 'left',
          borderWidth: 0,
          borderColor: '#d1d5db',
          borderStyle: 'none',
          shadow: null,
          objectFit: 'cover',
          opacity: 1,
        },
        content: '精美产品名称',
        responsive: { hiddenOnMobile: false, fullWidthOnMobile: false },
        animation: { hoverEffect: '', clickEffect: '' },
      },
      {
        id: 'tpl-text-3',
        type: 'text',
        x: 270,
        y: 350,
        zIndex: 4,
        style: {
          width: 260,
          height: 20,
          fontSize: 14,
          fontWeight: 400,
          color: '#6b7280',
          backgroundColor: 'transparent',
          borderRadius: 0,
          padding: 0,
          lineHeight: 1.4,
          textAlign: 'left',
          borderWidth: 0,
          borderColor: '#d1d5db',
          borderStyle: 'none',
          shadow: null,
          objectFit: 'cover',
          opacity: 1,
        },
        content: '产品描述文字...',
        responsive: { hiddenOnMobile: false, fullWidthOnMobile: false },
        animation: { hoverEffect: '', clickEffect: '' },
      },
      {
        id: 'tpl-text-4',
        type: 'text',
        x: 270,
        y: 385,
        zIndex: 5,
        style: {
          width: 100,
          height: 24,
          fontSize: 20,
          fontWeight: 700,
          color: '#ef4444',
          backgroundColor: 'transparent',
          borderRadius: 0,
          padding: 0,
          lineHeight: 1,
          textAlign: 'left',
          borderWidth: 0,
          borderColor: '#d1d5db',
          borderStyle: 'none',
          shadow: null,
          objectFit: 'cover',
          opacity: 1,
        },
        content: '¥199',
        responsive: { hiddenOnMobile: false, fullWidthOnMobile: false },
        animation: { hoverEffect: '', clickEffect: '' },
      },
      {
        id: 'tpl-btn-3',
        type: 'button',
        x: 400,
        y: 380,
        zIndex: 6,
        style: {
          width: 130,
          height: 36,
          fontSize: 14,
          fontWeight: 600,
          color: '#ffffff',
          backgroundColor: '#3b82f6',
          borderRadius: 6,
          padding: 8,
          lineHeight: 1.5,
          textAlign: 'center',
          borderWidth: 0,
          borderColor: '#3b82f6',
          borderStyle: 'none',
          shadow: null,
          objectFit: 'cover',
          opacity: 1,
        },
        content: '立即购买',
        responsive: { hiddenOnMobile: false, fullWidthOnMobile: false },
        animation: { hoverEffect: 'scale', clickEffect: '' },
      },
    ],
  },
]

export function Toolbar() {
  const { components, settings, updateSettings, loadProject, resetCanvas } = useCanvasStore()
  const [showModal, setShowModal] = useState(false)
  const [prompts, setPrompts] = useState<ReturnType<typeof generatePrompt> | null>(null)
  const [detailed, setDetailed] = useState(true)
  const [language, setLanguage] = useState<'zh' | 'en'>('zh')
  const [showTemplates, setShowTemplates] = useState(false)
  const [showNewCanvas, setShowNewCanvas] = useState(false)
  const [customWidth, setCustomWidth] = useState(800)
  const [customHeight, setCustomHeight] = useState(600)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleGenerate = () => {
    const viewportSize = VIEWPORT_SIZES[settings.viewportMode]
    const result = generatePrompt(components, {
      width: viewportSize.width,
      height: viewportSize.height,
      backgroundColor: '#ffffff',
    }, { detailed, language })
    setPrompts(result)
    setShowModal(true)
  }

  const handleSave = () => {
    const data = JSON.stringify(components, null, 2)
    localStorage.setItem('ui-skill-project', data)
    alert('项目已保存到浏览器本地存储！')
  }

  const handleLoad = () => {
    const data = localStorage.getItem('ui-skill-project')
    if (data) {
      try {
        const parsed = JSON.parse(data)
        loadProject(parsed)
        alert('项目加载成功！')
      } catch {
        alert('加载失败：数据格式错误')
      }
    } else {
      alert('没有找到保存的项目')
    }
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        loadProject(data)
        alert('导入成功！')
      } catch {
        alert('导入失败：文件格式错误')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleExport = () => {
    const data = JSON.stringify(components, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ui-skill-project-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleLoadTemplate = (template: typeof TEMPLATES[0]) => {
    if (components.length > 0) {
      if (!confirm('加载模板将清空当前画布，是否继续？')) return
    }
    loadProject(template.data)
    setShowTemplates(false)
  }

  const handleNewCanvas = (width: number, height: number) => {
    if (components.length > 0) {
      if (!confirm('新建画布将清空当前内容，是否继续？')) return
    }
    resetCanvas()
    setShowNewCanvas(false)
    alert(`已创建 ${width}×${height} 画布`)
  }

  const viewportModes = [
    { id: 'desktop' as const, icon: <Monitor size={14} />, label: '桌面' },
    { id: 'tablet' as const, icon: <Tablet size={14} />, label: '平板' },
    { id: 'mobile' as const, icon: <Smartphone size={14} />, label: '移动' },
  ]

  return (
    <>
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-semibold text-gray-800">UI Skill Generator</h1>
          <span className="text-xs text-gray-400">
            ({components.length} 个组件)
          </span>
          
          <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
            {viewportModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => updateSettings({ viewportMode: mode.id })}
                className={`px-2 py-1.5 text-xs rounded flex items-center gap-1 ${
                  settings.viewportMode === mode.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={VIEWPORT_SIZES[mode.id].label}
              >
                {mode.icon}
                {mode.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
            <button
              onClick={() => updateSettings({ snapToGrid: !settings.snapToGrid })}
              className={`px-2 py-1.5 text-xs rounded flex items-center gap-1 ${
                settings.snapToGrid
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="对齐辅助线"
            >
              <Grid3X3 size={14} />
              对齐
            </button>
            <button
              onClick={() => updateSettings({ showGridLines: !settings.showGridLines })}
              className={`px-2 py-1.5 text-xs rounded flex items-center gap-1 ${
                settings.showGridLines
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="显示网格点阵"
            >
              <Grid3X3 size={14} />
              网格
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
            <button
              onClick={() => setLanguage('zh')}
              className={`px-2 py-1.5 text-xs rounded ${
                language === 'zh' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              中文
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1.5 text-xs rounded ${
                language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              EN
            </button>
          </div>
          
          <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
            <button
              onClick={() => setDetailed(!detailed)}
              className={`px-2 py-1.5 text-xs rounded flex items-center gap-1 ${
                detailed ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={detailed ? '包含详细坐标信息' : '仅描述布局结构'}
            >
              {detailed ? <Eye size={14} /> : <EyeOff size={14} />}
              {detailed ? '详细' : '精简'}
            </button>
          </div>

          <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
            <button
              onClick={() => setShowNewCanvas(true)}
              className="px-2 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-1"
              title="新建画布"
            >
              <FilePlus size={14} />
              新建
            </button>
            <button
              onClick={() => setShowTemplates(true)}
              className="px-2 py-1.5 text-xs bg-purple-50 text-purple-700 rounded hover:bg-purple-100 flex items-center gap-1"
              title="预设模板"
            >
              <Layout size={14} />
              模板
            </button>
            <button
              onClick={handleSave}
              className="px-2 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-1"
              title="保存到浏览器"
            >
              <Save size={14} />
              保存
            </button>
            <button
              onClick={handleLoad}
              className="px-2 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-1"
              title="加载项目"
            >
              <FolderOpen size={14} />
              加载
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-1"
              title="导入JSON文件"
            >
              <Upload size={14} />
              导入
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={handleExport}
              className="px-2 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              title="导出JSON"
            >
              导出
            </button>
          </div>

          {components.length > 0 && (
            <button
              onClick={resetCanvas}
              className="px-2 py-1.5 text-xs text-red-600 border border-red-300 rounded hover:bg-red-50 flex items-center gap-1"
            >
              <Trash2 size={14} />
              清空
            </button>
          )}
          
          <button
            onClick={handleGenerate}
            disabled={components.length === 0}
            className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
          >
            <Sparkles size={16} />
            生成提示词
          </button>
        </div>
      </div>
      
      {showModal && prompts && (
        <PromptModal
          prompts={prompts}
          onClose={() => setShowModal(false)}
        />
      )}
      
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowTemplates(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-[500px] p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">选择预设模板</h2>
            <div className="grid grid-cols-3 gap-4">
              {TEMPLATES.map((template) => (
                <button
                  key={template.name}
                  onClick={() => handleLoadTemplate(template)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-3"
                >
                  <div className="text-4xl">{template.icon}</div>
                  <span className="text-sm font-medium text-gray-700">{template.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTemplates(false)}
              className="mt-6 w-full py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              取消
            </button>
          </div>
        </div>
      )}
      
      {showNewCanvas && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowNewCanvas(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-[450px] p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">新建画布</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {CANVAS_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleNewCanvas(preset.width, preset.height)}
                  className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="text-sm font-medium text-gray-800">{preset.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{preset.width} × {preset.height}</div>
                </button>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">自定义尺寸</label>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">宽度</label>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    min={200}
                    max={2000}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">高度</label>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    min={200}
                    max={2000}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => handleNewCanvas(customWidth, customHeight)}
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  创建
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowNewCanvas(false)}
              className="mt-4 w-full py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </>
  )
}
