import { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'
import type { GeneratedPrompts } from '../utils/promptGenerator'

interface PromptModalProps {
  prompts: GeneratedPrompts
  onClose: () => void
}

export function PromptModal({ prompts, onClose }: PromptModalProps) {
  const [activeTab, setActiveTab] = useState<'natural' | 'markdown' | 'json'>('natural')
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({})

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied({ ...copied, [key]: true })
      setTimeout(() => {
        setCopied((prev) => ({ ...prev, [key]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleCopyAll = async () => {
    const allText = `=== 自然语言描述 ===\n${prompts.natural}\n\n=== Markdown Skill ===\n${prompts.markdown}\n\n=== JSON 结构 ===\n${prompts.json}`
    await handleCopy(allText, 'all')
  }

  const tabs = [
    { id: 'natural' as const, label: '自然语言' },
    { id: 'markdown' as const, label: 'Markdown' },
    { id: 'json' as const, label: 'JSON' },
  ]

  const currentContent = prompts[activeTab]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-2xl w-[900px] max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">生成提示词</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
            >
              {copied['all'] ? <Check size={16} /> : <Copy size={16} />}
              复制全部
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="relative">
            <button
              onClick={() => handleCopy(currentContent, activeTab)}
              className="absolute top-2 right-2 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-1 z-10"
            >
              {copied[activeTab] ? <Check size={14} /> : <Copy size={14} />}
              {copied[activeTab] ? '已复制' : '复制'}
            </button>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap border border-gray-200">
              {currentContent}
            </pre>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            💡 提示：可直接复制到 Claude、GPT、Cursor、v0 等 AI 工具中使用
          </p>
          <div className="flex gap-2">
            <a
              href="https://v0.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs bg-black text-white rounded hover:bg-gray-800 flex items-center gap-1"
            >
              <span>⚡</span>
              在 v0 中测试
            </a>
            <a
              href="https://cursor.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-1"
            >
              <span>✨</span>
              在 Cursor 中测试
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
