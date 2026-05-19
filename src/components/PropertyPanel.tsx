import { useState } from 'react'
import { useCanvasStore } from '../store/canvasStore'
import type { StyleProps, ShadowPreset, TextAlign, ObjectFit, ResponsiveSettings, AnimationSettings } from '../store/canvasStore'
import { Trash2, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, AlignLeft, AlignCenter, AlignRight, Smartphone, Monitor, Sparkles, ChevronRight } from 'lucide-react'
import { ColorPicker } from './ui/ColorPicker'
import { Slider } from './ui/Slider'
import { ShadowSelector } from './ui/ShadowSelector'
import { ProgressBar } from './ui/ProgressBar'

function CollapsibleSection({ title, icon, defaultOpen = true, children }: { title: string; icon: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="border-b border-gray-200">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        <ChevronRight
          size={16}
          className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
        />
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 space-y-3">
          {children}
        </div>
      </div>
    </div>
  )
}

export function PropertyPanel() {
  const { 
    components, 
    selectedId, 
    updateComponent, 
    deleteComponent,
    moveLayerUp,
    moveLayerDown,
    bringToFront,
    sendToBack
  } = useCanvasStore()

  const selectedComponent = components.find((c) => c.id === selectedId)

  if (!selectedComponent) {
    return (
      <div className="w-72 h-full bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700">属性面板</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-gray-400 text-center">
            选择画布上的组件<br />查看和编辑属性
          </p>
        </div>
      </div>
    )
  }

  const handleStyleChange = <K extends keyof StyleProps>(key: K, value: StyleProps[K]) => {
    updateComponent(selectedComponent.id, {
      style: { ...selectedComponent.style, [key]: value },
    })
  }

  const handleResponsiveChange = <K extends keyof ResponsiveSettings>(key: K, value: ResponsiveSettings[K]) => {
    updateComponent(selectedComponent.id, {
      responsive: { ...selectedComponent.responsive, [key]: value },
    })
  }

  const handleAnimationChange = <K extends keyof AnimationSettings>(key: K, value: AnimationSettings[K]) => {
    updateComponent(selectedComponent.id, {
      animation: { ...selectedComponent.animation, [key]: value },
    })
  }

  const handleShadowChange = (shadow: ShadowPreset | null) => {
    handleStyleChange('shadow', shadow)
  }

  const handleTextAlignChange = (align: TextAlign) => {
    handleStyleChange('textAlign', align)
  }

  const handleObjectFitChange = (fit: ObjectFit) => {
    handleStyleChange('objectFit', fit)
  }

  const sortedComponents = [...components].sort((a, b) => a.zIndex - b.zIndex)
  const currentIndex = sortedComponents.findIndex((c) => c.id === selectedId)
  const isFirst = currentIndex === 0
  const isLast = currentIndex === sortedComponents.length - 1

  const isTextComponent = ['text', 'button', 'input', 'textarea', 'badge'].includes(selectedComponent.type)
  const canHaveShadow = ['button', 'card', 'image'].includes(selectedComponent.type)

  return (
    <div className="w-72 h-full bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">属性面板</h2>
        <span className="text-xs text-gray-500 capitalize">{selectedComponent.type}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <label className="block text-xs text-gray-600 mb-1">变量名</label>
          <input
            type="text"
            value={selectedComponent.variableName || ''}
            onChange={(e) => updateComponent(selectedComponent.id, { variableName: e.target.value })}
            placeholder="输入变量名"
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
          />
        </div>
        
        <CollapsibleSection title="内容" icon={<Monitor size={16} className="text-blue-500" />} defaultOpen={true}>
          {isTextComponent && (
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                {selectedComponent.type === 'input' ? '占位文字' : '文本内容'}
              </label>
              <input
                type="text"
                value={selectedComponent.content}
                onChange={(e) => updateComponent(selectedComponent.id, { content: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
          
          {selectedComponent.type === 'image' && (
            <div>
              <label className="block text-xs text-gray-600 mb-1">图片URL</label>
              <input
                type="text"
                value={selectedComponent.imageUrl || ''}
                onChange={(e) => updateComponent(selectedComponent.id, { imageUrl: e.target.value })}
                placeholder="输入图片URL"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
          
          {selectedComponent.type === 'progressbar' && (
            <ProgressBar
              label="进度值"
              progress={selectedComponent.style.progress ?? 60}
              onChange={(v) => handleStyleChange('progress', v)}
            />
          )}
          
          {selectedComponent.type === 'checkbox' && (
            <div>
              <label className="block text-xs text-gray-600 mb-1">标签文字</label>
              <input
                type="text"
                value={selectedComponent.content}
                onChange={(e) => updateComponent(selectedComponent.id, { content: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded mt-2">
                <label className="text-xs text-gray-700">选中状态</label>
                <input
                  type="checkbox"
                  checked={selectedComponent.style.checked ?? false}
                  onChange={(e) => handleStyleChange('checked', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
            </div>
          )}
          
          {selectedComponent.type === 'radiogroup' && (
            <div>
              <label className="block text-xs text-gray-600 mb-1">选项列表（每行一个）</label>
              <textarea
                value={(selectedComponent.style.options ?? []).join('\n')}
                onChange={(e) => handleStyleChange('options', e.target.value.split('\n'))}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>
          )}
          
          {!isTextComponent && selectedComponent.type !== 'image' && selectedComponent.type !== 'select' && selectedComponent.type !== 'progressbar' && selectedComponent.type !== 'divider' && selectedComponent.type !== 'checkbox' && selectedComponent.type !== 'radiogroup' && (
            <p className="text-xs text-gray-400 italic">此组件无可编辑内容</p>
          )}
        </CollapsibleSection>

        <CollapsibleSection title="布局" icon={<Smartphone size={16} className="text-green-500" />} defaultOpen={true}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-2">位置</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">X</label>
                  <input
                    type="number"
                    value={Math.round(selectedComponent.x)}
                    onChange={(e) => updateComponent(selectedComponent.id, { x: Number(e.target.value) })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Y</label>
                  <input
                    type="number"
                    value={Math.round(selectedComponent.y)}
                    onChange={(e) => updateComponent(selectedComponent.id, { y: Number(e.target.value) })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-2">尺寸</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">宽度</label>
                  <input
                    type="number"
                    value={selectedComponent.style.width}
                    onChange={(e) => handleStyleChange('width', Number(e.target.value))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">高度</label>
                  <input
                    type="number"
                    value={selectedComponent.style.height}
                    onChange={(e) => handleStyleChange('height', Number(e.target.value))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-2">图层控制</label>
              <div className="grid grid-cols-4 gap-1">
                <button
                  onClick={() => sendToBack(selectedComponent.id)}
                  disabled={isFirst}
                  className="p-2 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="置底"
                >
                  <ChevronsDown size={16} className="mx-auto" />
                </button>
                <button
                  onClick={() => moveLayerDown(selectedComponent.id)}
                  disabled={isFirst}
                  className="p-2 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="下移一层"
                >
                  <ChevronDown size={16} className="mx-auto" />
                </button>
                <button
                  onClick={() => moveLayerUp(selectedComponent.id)}
                  disabled={isLast}
                  className="p-2 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="上移一层"
                >
                  <ChevronUp size={16} className="mx-auto" />
                </button>
                <button
                  onClick={() => bringToFront(selectedComponent.id)}
                  disabled={isLast}
                  className="p-2 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="置顶"
                >
                  <ChevronsUp size={16} className="mx-auto" />
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                层级: {currentIndex + 1} / {components.length}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="样式" icon={<Monitor size={16} className="text-purple-500" />} defaultOpen={true}>
          <div className="space-y-3">
            {isTextComponent && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">字号</label>
                    <input
                      type="number"
                      value={selectedComponent.style.fontSize}
                      onChange={(e) => handleStyleChange('fontSize', Number(e.target.value))}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">字重</label>
                    <select
                      value={selectedComponent.style.fontWeight}
                      onChange={(e) => handleStyleChange('fontWeight', Number(e.target.value))}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    >
                      <option value={400}>常规</option>
                      <option value={500}>中等</option>
                      <option value={600}>半粗</option>
                      <option value={700}>粗体</option>
                    </select>
                  </div>
                </div>
                <Slider
                  label="行高"
                  value={selectedComponent.style.lineHeight}
                  onChange={(v) => handleStyleChange('lineHeight', v)}
                  min={1}
                  max={3}
                  step={0.1}
                />
                <div>
                  <label className="block text-xs text-gray-500 mb-2">对齐</label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleTextAlignChange('left')}
                      className={`flex-1 p-2 border rounded ${selectedComponent.style.textAlign === 'left' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    >
                      <AlignLeft size={14} className="mx-auto" />
                    </button>
                    <button
                      onClick={() => handleTextAlignChange('center')}
                      className={`flex-1 p-2 border rounded ${selectedComponent.style.textAlign === 'center' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    >
                      <AlignCenter size={14} className="mx-auto" />
                    </button>
                    <button
                      onClick={() => handleTextAlignChange('right')}
                      className={`flex-1 p-2 border rounded ${selectedComponent.style.textAlign === 'right' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    >
                      <AlignRight size={14} className="mx-auto" />
                    </button>
                  </div>
                </div>
                <ColorPicker
                  label="文字颜色"
                  color={selectedComponent.style.color}
                  onChange={(c) => handleStyleChange('color', c)}
                />
              </>
            )}

            <ColorPicker
              label="背景颜色"
              color={selectedComponent.style.backgroundColor}
              onChange={(c) => handleStyleChange('backgroundColor', c)}
            />
            
            {selectedComponent.type === 'progressbar' && (
              <ColorPicker
                label="已填充颜色"
                color={selectedComponent.style.color}
                onChange={(c) => handleStyleChange('color', c)}
              />
            )}
            
            <Slider
              label="圆角"
              value={selectedComponent.style.borderRadius}
              onChange={(v) => handleStyleChange('borderRadius', v)}
              min={0}
              max={50}
              unit="px"
            />
            <Slider
              label="内边距"
              value={selectedComponent.style.padding}
              onChange={(v) => handleStyleChange('padding', v)}
              min={0}
              max={50}
              unit="px"
            />
            <Slider
              label="不透明度"
              value={selectedComponent.style.opacity}
              onChange={(v) => handleStyleChange('opacity', v)}
              min={0}
              max={1}
              step={0.1}
            />

            {selectedComponent.type !== 'text' && (
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs text-gray-600 mb-2">边框</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">宽度</label>
                    <input
                      type="number"
                      value={selectedComponent.style.borderWidth}
                      onChange={(e) => handleStyleChange('borderWidth', Number(e.target.value))}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">样式</label>
                    <select
                      value={selectedComponent.style.borderStyle}
                      onChange={(e) => handleStyleChange('borderStyle', e.target.value as StyleProps['borderStyle'])}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    >
                      <option value="none">无</option>
                      <option value="solid">实线</option>
                      <option value="dashed">虚线</option>
                      <option value="dotted">点线</option>
                    </select>
                  </div>
                </div>
                {selectedComponent.style.borderStyle !== 'none' && (
                  <ColorPicker
                    label="边框颜色"
                    color={selectedComponent.style.borderColor}
                    onChange={(c) => handleStyleChange('borderColor', c)}
                  />
                )}
              </div>
            )}

            {canHaveShadow && (
              <div className="pt-2 border-t border-gray-100">
                <ShadowSelector
                  shadow={selectedComponent.style.shadow}
                  onChange={handleShadowChange}
                />
              </div>
            )}

            {selectedComponent.type === 'image' && (
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs text-gray-600 mb-2">图片填充</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['fill', 'contain', 'cover', 'none'] as ObjectFit[]).map((fit) => (
                    <button
                      key={fit}
                      onClick={() => handleObjectFitChange(fit)}
                      className={`p-2 text-xs border rounded ${
                        selectedComponent.style.objectFit === fit
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {fit === 'fill' ? '填充' : fit === 'contain' ? '包含' : fit === 'cover' ? '覆盖' : '原始'}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded mt-2">
                  <label className="text-xs text-gray-700">圆形裁剪（头像）</label>
                  <input
                    type="checkbox"
                    checked={selectedComponent.style.circular ?? false}
                    onChange={(e) => handleStyleChange('circular', e.target.checked)}
                    className="w-4 h-4"
                  />
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="响应式" icon={<Smartphone size={16} className="text-orange-500" />} defaultOpen={false}>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <label className="text-xs text-gray-700">移动端隐藏</label>
              <input
                type="checkbox"
                checked={selectedComponent.responsive.hiddenOnMobile}
                onChange={(e) => handleResponsiveChange('hiddenOnMobile', e.target.checked)}
                className="w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <label className="text-xs text-gray-700">移动端全宽</label>
              <input
                type="checkbox"
                checked={selectedComponent.responsive.fullWidthOnMobile}
                onChange={(e) => handleResponsiveChange('fullWidthOnMobile', e.target.checked)}
                className="w-4 h-4"
              />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs text-gray-600 mb-2">移动端自定义尺寸</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">宽度</label>
                  <input
                    type="number"
                    value={selectedComponent.responsive.mobileWidth || ''}
                    onChange={(e) => handleResponsiveChange('mobileWidth', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="默认"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">高度</label>
                  <input
                    type="number"
                    value={selectedComponent.responsive.mobileHeight || ''}
                    onChange={(e) => handleResponsiveChange('mobileHeight', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="默认"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="动效" icon={<Sparkles size={16} className="text-pink-500" />} defaultOpen={false}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">悬停效果</label>
              <select
                value={selectedComponent.animation.hoverEffect}
                onChange={(e) => handleAnimationChange('hoverEffect', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              >
                <option value="">无</option>
                <option value="scale">缩放</option>
                <option value="shadow">阴影加深</option>
                <option value="brightness">亮度变化</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">点击效果</label>
              <select
                value={selectedComponent.animation.clickEffect}
                onChange={(e) => handleAnimationChange('clickEffect', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              >
                <option value="">无</option>
                <option value="press">按压效果</option>
                <option value="ripple">波纹效果</option>
              </select>
            </div>
          </div>
        </CollapsibleSection>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => deleteComponent(selectedComponent.id)}
            className="w-full py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            删除组件
          </button>
        </div>
      </div>
    </div>
  )
}
