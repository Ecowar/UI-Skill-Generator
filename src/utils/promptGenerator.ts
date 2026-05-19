import type { CanvasComponent, StyleProps, ResponsiveSettings, AnimationSettings } from '../store/canvasStore'

interface CanvasSettings {
  width: number
  height: number
  backgroundColor: string
}

interface GenerateOptions {
  detailed: boolean
  language: 'zh' | 'en'
}

export interface GeneratedPrompts {
  natural: string
  markdown: string
  json: string
}

const getComponentTypeName = (type: string, lang: 'zh' | 'en'): string => {
  const names: Record<string, { zh: string; en: string }> = {
    text: { zh: '文本', en: 'Text' },
    button: { zh: '按钮', en: 'Button' },
    input: { zh: '输入框', en: 'Input' },
    image: { zh: '图片', en: 'Image' },
    card: { zh: '卡片', en: 'Card' },
    navbar: { zh: '导航栏', en: 'Navbar' },
    icon: { zh: '图标', en: 'Icon' },
    switch: { zh: '开关', en: 'Switch' },
    textarea: { zh: '文本域', en: 'Textarea' },
    select: { zh: '下拉框', en: 'Select' },
    progressbar: { zh: '进度条', en: 'Progress Bar' },
    divider: { zh: '分割线', en: 'Divider' },
    badge: { zh: '标签', en: 'Badge' },
    checkbox: { zh: '复选框', en: 'Checkbox' },
    radiogroup: { zh: '单选框组', en: 'Radio Group' },
  }
  return names[type]?.[lang] || type
}

const describeSize = (width: number, _height: number, lang: 'zh' | 'en'): string => {
  if (lang === 'zh') {
    if (width > 400) return '宽幅'
    if (width > 200) return '中等宽度'
    if (width < 60) return '窄小'
    return '标准宽度'
  }
  if (width > 400) return 'wide'
  if (width > 200) return 'medium width'
  if (width < 60) return 'narrow'
  return 'standard width'
}

const describeFontSize = (fontSize: number, lang: 'zh' | 'en'): string => {
  if (lang === 'zh') {
    if (fontSize >= 24) return '大号文字'
    if (fontSize >= 18) return '中号文字'
    if (fontSize >= 14) return '常规文字'
    return '小号文字'
  }
  if (fontSize >= 24) return 'large text'
  if (fontSize >= 18) return 'medium text'
  if (fontSize >= 14) return 'regular text'
  return 'small text'
}

const describeFontWeight = (fontWeight: number, lang: 'zh' | 'en'): string => {
  if (lang === 'zh') {
    if (fontWeight >= 700) return '粗体'
    if (fontWeight >= 500) return '半粗'
    return '常规'
  }
  if (fontWeight >= 700) return 'bold'
  if (fontWeight >= 500) return 'semibold'
  return 'regular'
}

const describeColor = (color: string, lang: 'zh' | 'en'): string => {
  const colorMap: Record<string, { zh: string; en: string }> = {
    '#1f2937': { zh: '深灰', en: 'dark gray' },
    '#374151': { zh: '深灰', en: 'dark gray' },
    '#6b7280': { zh: '中灰', en: 'medium gray' },
    '#9ca3af': { zh: '浅灰', en: 'light gray' },
    '#d1d5db': { zh: '淡灰', en: 'pale gray' },
    '#e5e7eb': { zh: '极浅灰', en: 'very light gray' },
    '#f3f4f6': { zh: '近白灰', en: 'near-white gray' },
    '#ffffff': { zh: '白色', en: 'white' },
    '#000000': { zh: '黑色', en: 'black' },
    '#3b82f6': { zh: '蓝色', en: 'blue' },
    '#2563eb': { zh: '深蓝', en: 'dark blue' },
    '#60a5fa': { zh: '浅蓝', en: 'light blue' },
    '#ef4444': { zh: '红色', en: 'red' },
    '#f97316': { zh: '橙色', en: 'orange' },
    '#eab308': { zh: '黄色', en: 'yellow' },
    '#22c55e': { zh: '绿色', en: 'green' },
    '#8b5cf6': { zh: '紫色', en: 'purple' },
    '#ec4899': { zh: '粉色', en: 'pink' },
  }
  const lower = color.toLowerCase()
  return colorMap[lower]?.[lang] || color
}

const describeBorderRadius = (radius: number, lang: 'zh' | 'en'): string => {
  if (lang === 'zh') {
    if (radius === 0) return '直角'
    if (radius <= 4) return '微圆角'
    if (radius <= 12) return '圆角'
    if (radius <= 20) return '大圆角'
    return '圆形/胶囊形'
  }
  if (radius === 0) return 'sharp corners'
  if (radius <= 4) return 'slightly rounded'
  if (radius <= 12) return 'rounded'
  if (radius <= 20) return 'heavily rounded'
  return 'pill/circular'
}

const describeOpacity = (opacity: number, lang: 'zh' | 'en'): string => {
  if (opacity >= 1) return ''
  if (lang === 'zh') {
    if (opacity <= 0.3) return '几乎透明'
    if (opacity <= 0.6) return '半透明'
    return '微透明'
  }
  if (opacity <= 0.3) return 'nearly transparent'
  if (opacity <= 0.6) return 'semi-transparent'
  return 'slightly transparent'
}

const describeStyle = (style: StyleProps, lang: 'zh' | 'en', detailed: boolean): string[] => {
  const parts: string[] = []

  if (detailed) {
    parts.push(lang === 'zh' ? `尺寸: 宽${style.width} × 高${style.height}` : `size: ${style.width} × ${style.height}`)
  } else {
    parts.push(describeSize(style.width, style.height, lang))
  }

  parts.push(describeFontSize(style.fontSize, lang))
  const weight = describeFontWeight(style.fontWeight, lang)
  if (style.fontWeight >= 500) parts.push(weight)

  const textColor = describeColor(style.color, lang)
  const bgColor = describeColor(style.backgroundColor, lang)
  if (lang === 'zh') {
    if (style.backgroundColor !== '#ffffff' && style.backgroundColor !== 'transparent') {
      parts.push(`${bgColor}背景`)
    }
    parts.push(`${textColor}文字`)
  } else {
    if (style.backgroundColor !== '#ffffff' && style.backgroundColor !== 'transparent') {
      parts.push(`${bgColor} background`)
    }
    parts.push(`${textColor} text`)
  }

  parts.push(describeBorderRadius(style.borderRadius, lang))

  if (style.borderStyle !== 'none') {
    const borderColor = describeColor(style.borderColor, lang)
    if (lang === 'zh') {
      parts.push(`${borderColor}边框`)
    } else {
      parts.push(`${borderColor} border`)
    }
  }

  if (style.shadow) {
    parts.push(lang === 'zh' ? '带阴影' : 'with shadow')
  }

  const opacityDesc = describeOpacity(style.opacity, lang)
  if (opacityDesc) parts.push(opacityDesc)

  if (style.progress !== undefined) {
    parts.push(lang === 'zh' ? `进度 ${style.progress}%` : `progress ${style.progress}%`)
  }

  if (style.checked !== undefined) {
    parts.push(style.checked
      ? (lang === 'zh' ? '已选中' : 'checked')
      : (lang === 'zh' ? '未选中' : 'unchecked')
    )
  }

  if (style.circular) {
    parts.push(lang === 'zh' ? '圆形裁剪' : 'circular crop')
  }

  return parts
}

const describeResponsive = (responsive: ResponsiveSettings, lang: 'zh' | 'en'): string[] => {
  const lines: string[] = []
  
  if (responsive.hiddenOnMobile) {
    lines.push(lang === 'zh' ? '移动端隐藏此组件' : 'Hide on mobile devices')
  }
  
  if (responsive.fullWidthOnMobile) {
    lines.push(lang === 'zh' ? '移动端全宽居中显示' : 'Full width and centered on mobile')
  }
  
  if (responsive.mobileWidth || responsive.mobileHeight) {
    const size = lang === 'zh' ? '移动端尺寸' : 'Mobile size'
    lines.push(`${size}: ${responsive.mobileWidth || 'auto'}px × ${responsive.mobileHeight || 'auto'}px`)
  }
  
  if (responsive.mobileX !== undefined || responsive.mobileY !== undefined) {
    const pos = lang === 'zh' ? '移动端位置' : 'Mobile position'
    lines.push(`${pos}: (${responsive.mobileX || 'auto'}, ${responsive.mobileY || 'auto'})`)
  }
  
  return lines
}

const describeAnimation = (animation: AnimationSettings, lang: 'zh' | 'en'): string[] => {
  const lines: string[] = []
  
  if (animation.hoverEffect) {
    lines.push(lang === 'zh' ? `悬停效果: ${animation.hoverEffect}` : `Hover effect: ${animation.hoverEffect}`)
  }
  
  if (animation.clickEffect) {
    lines.push(lang === 'zh' ? `点击效果: ${animation.clickEffect}` : `Click effect: ${animation.clickEffect}`)
  }
  
  return lines
}

export function generateNaturalLanguage(
  components: CanvasComponent[],
  _settings: CanvasSettings,
  options: GenerateOptions
): string {
  const { language, detailed } = options
  const sorted = [...components].sort((a, b) => a.zIndex - b.zIndex)
  
  if (language === 'zh') {
    let text = `设计一个用户界面。\n\n该界面包含 ${components.length} 个组件：\n\n`
    
    sorted.forEach((comp, index) => {
      const typeName = getComponentTypeName(comp.type, 'zh')
      const styleParts = describeStyle(comp.style, 'zh', detailed)
      text += `${index + 1}. ${typeName}组件`
      
      if (detailed) {
        text += `，位于 (${Math.round(comp.x)}, ${Math.round(comp.y)})`
      }
      
      if (comp.content && comp.type !== 'switch' && comp.type !== 'image' && comp.type !== 'progressbar' && comp.type !== 'divider' && comp.type !== 'radiogroup') {
        text += `，内容"${comp.content}"`
      }
      
      if (styleParts.length > 0) {
        text += `，${styleParts.join('、')}`
      }
      
      text += '\n'
      
      if (comp.type === 'image' && comp.imageUrl) {
        text += `   图片来源: ${comp.imageUrl}\n`
      }

      if (comp.type === 'radiogroup' && comp.style.options) {
        text += `   选项: ${(comp.style.options ?? []).join('、')}\n`
      }

      const responsiveLines = describeResponsive(comp.responsive, 'zh')
      if (responsiveLines.length > 0) {
        text += '   响应式: '
        text += responsiveLines.join('；')
        text += '\n'
      }
      
      const animationLines = describeAnimation(comp.animation, 'zh')
      if (animationLines.length > 0) {
        text += '   动效: '
        text += animationLines.join('；')
        text += '\n'
      }
      
      text += '\n'
    })
    
    text += `请根据以上描述实现该界面，确保布局、样式与交互效果与描述一致，可使用任意前端技术栈。`
    
    return text
  } else {
    let text = `Design a user interface.\n\nThe interface contains ${components.length} components:\n\n`
    
    sorted.forEach((comp, index) => {
      const typeName = getComponentTypeName(comp.type, 'en')
      const styleParts = describeStyle(comp.style, 'en', detailed)
      text += `${index + 1}. ${typeName} component`
      
      if (detailed) {
        text += ` at position (${Math.round(comp.x)}, ${Math.round(comp.y)})`
      }
      
      if (comp.content && comp.type !== 'switch' && comp.type !== 'image' && comp.type !== 'progressbar' && comp.type !== 'divider' && comp.type !== 'radiogroup') {
        text += ` with content "${comp.content}"`
      }
      
      if (styleParts.length > 0) {
        text += `, ${styleParts.join(', ')}`
      }
      
      text += '\n'
      
      if (comp.type === 'image' && comp.imageUrl) {
        text += `   Image source: ${comp.imageUrl}\n`
      }

      if (comp.type === 'radiogroup' && comp.style.options) {
        text += `   Options: ${(comp.style.options ?? []).join(', ')}\n`
      }

      const responsiveLines = describeResponsive(comp.responsive, 'en')
      if (responsiveLines.length > 0) {
        text += '   Responsive: '
        text += responsiveLines.join('; ')
        text += '\n'
      }
      
      const animationLines = describeAnimation(comp.animation, 'en')
      if (animationLines.length > 0) {
        text += '   Animation: '
        text += animationLines.join('; ')
        text += '\n'
      }
      
      text += '\n'
    })
    
    text += `Please implement this interface based on the description above, ensuring the layout, styles, and interactions match. Any frontend technology stack may be used.`
    
    return text
  }
}

export function generateMarkdownSkill(
  components: CanvasComponent[],
  _settings: CanvasSettings,
  options: GenerateOptions
): string {
  const { language, detailed } = options
  const sorted = [...components].sort((a, b) => a.zIndex - b.zIndex)
  
  if (language === 'zh') {
    let md = `# UI Skill: 自定义界面\n\n`
    md += `## 角色设定\n`
    md += `你是一名专业的UI开发者。请根据以下描述重建这个用户界面，可使用任意技术栈。\n\n`
    
    md += `## 组件总数\n`
    md += `${components.length} 个组件\n\n`
    
    md += `## 组件列表\n\n`
    
    sorted.forEach((comp, index) => {
      const typeName = getComponentTypeName(comp.type, 'zh')
      const styleParts = describeStyle(comp.style, 'zh', detailed)
      md += `### ${index + 1}. ${typeName}\n\n`
      
      if (detailed) {
        md += `**位置**: (${Math.round(comp.x)}, ${Math.round(comp.y)})\n\n`
      }
      
      if (comp.content && comp.type !== 'switch' && comp.type !== 'image' && comp.type !== 'progressbar' && comp.type !== 'divider' && comp.type !== 'radiogroup') {
        md += `**内容**: "${comp.content}"\n\n`
      }
      
      md += `**视觉描述**: ${styleParts.join('、')}\n\n`
      
      if (comp.type === 'image' && comp.imageUrl) {
        md += `**图片来源**: ${comp.imageUrl}\n\n`
      }

      if (comp.type === 'radiogroup' && comp.style.options) {
        md += `**选项**: ${(comp.style.options ?? []).join('、')}\n\n`
      }

      const responsiveLines = describeResponsive(comp.responsive, 'zh')
      if (responsiveLines.length > 0) {
        md += `**响应式设置**:\n`
        responsiveLines.forEach(line => {
          md += `- ${line}\n`
        })
        md += '\n'
      }
      
      const animationLines = describeAnimation(comp.animation, 'zh')
      if (animationLines.length > 0) {
        md += `**动效描述**:\n`
        animationLines.forEach(line => {
          md += `- ${line}\n`
        })
        md += '\n'
      }
    })
    
    md += `## 实现要求\n\n`
    md += `1. 按照上述描述实现每个组件的位置和视觉样式\n`
    md += `2. 确保组件间的层级关系正确\n`
    md += `3. 保持视觉风格一致\n`
    md += `4. 可使用任意技术栈（React、Vue、Flutter、SwiftUI等）实现\n`
    md += `5. 实现响应式布局，支持移动端适配\n`
    md += `6. 添加必要的交互动效\n`
    
    return md
  } else {
    let md = `# UI Skill: Custom Interface\n\n`
    md += `## Role\n`
    md += `You are a professional UI developer. Please recreate this user interface based on the description below, using any technology stack.\n\n`
    
    md += `## Component Count\n`
    md += `${components.length} components\n\n`
    
    md += `## Component List\n\n`
    
    sorted.forEach((comp, index) => {
      const typeName = getComponentTypeName(comp.type, 'en')
      const styleParts = describeStyle(comp.style, 'en', detailed)
      md += `### ${index + 1}. ${typeName}\n\n`
      
      if (detailed) {
        md += `**Position**: (${Math.round(comp.x)}, ${Math.round(comp.y)})\n\n`
      }
      
      if (comp.content && comp.type !== 'switch' && comp.type !== 'image' && comp.type !== 'progressbar' && comp.type !== 'divider' && comp.type !== 'radiogroup') {
        md += `**Content**: "${comp.content}"\n\n`
      }
      
      md += `**Visual Description**: ${styleParts.join(', ')}\n\n`
      
      if (comp.type === 'image' && comp.imageUrl) {
        md += `**Image Source**: ${comp.imageUrl}\n\n`
      }

      if (comp.type === 'radiogroup' && comp.style.options) {
        md += `**Options**: ${(comp.style.options ?? []).join(', ')}\n\n`
      }

      const responsiveLines = describeResponsive(comp.responsive, 'en')
      if (responsiveLines.length > 0) {
        md += `**Responsive Settings**:\n`
        responsiveLines.forEach(line => {
          md += `- ${line}\n`
        })
        md += '\n'
      }
      
      const animationLines = describeAnimation(comp.animation, 'en')
      if (animationLines.length > 0) {
        md += `**Animation**:\n`
        animationLines.forEach(line => {
          md += `- ${line}\n`
        })
        md += '\n'
      }
    })
    
    md += `## Implementation Requirements\n\n`
    md += `1. Implement each component with the position and visual style described\n`
    md += `2. Ensure correct layer ordering between components\n`
    md += `3. Maintain consistent visual style\n`
    md += `4. Use any technology stack (React, Vue, Flutter, SwiftUI, etc.)\n`
    md += `5. Implement responsive layout for mobile adaptation\n`
    md += `6. Add necessary interaction animations\n`
    
    return md
  }
}

export function generateStructuredJSON(
  components: CanvasComponent[],
  _settings: CanvasSettings,
  _options?: GenerateOptions
): string {
  const sorted = [...components].sort((a, b) => a.zIndex - b.zIndex)
  
  const data = {
    components: sorted.map((comp) => ({
      id: comp.id,
      type: comp.type,
      position: {
        x: Math.round(comp.x),
        y: Math.round(comp.y),
      },
      size: {
        width: comp.style.width,
        height: comp.style.height,
      },
      content: comp.content,
      imageUrl: comp.imageUrl,
      style: {
        fontSize: comp.style.fontSize,
        fontWeight: comp.style.fontWeight,
        color: comp.style.color,
        backgroundColor: comp.style.backgroundColor,
        borderRadius: comp.style.borderRadius,
        padding: comp.style.padding,
        lineHeight: comp.style.lineHeight,
        textAlign: comp.style.textAlign,
        border: {
          width: comp.style.borderWidth,
          style: comp.style.borderStyle,
          color: comp.style.borderColor,
        },
        shadow: comp.style.shadow,
        objectFit: comp.style.objectFit,
        opacity: comp.style.opacity,
        progress: comp.style.progress,
        checked: comp.style.checked,
        options: comp.style.options,
        circular: comp.style.circular,
      },
      responsive: comp.responsive,
      animation: comp.animation,
      zIndex: comp.zIndex,
    })),
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0',
      componentCount: components.length,
    },
  }
  
  return JSON.stringify(data, null, 2)
}

export function generatePrompt(
  components: CanvasComponent[],
  settings: CanvasSettings,
  options: GenerateOptions
): GeneratedPrompts {
  return {
    natural: generateNaturalLanguage(components, settings, options),
    markdown: generateMarkdownSkill(components, settings, options),
    json: generateStructuredJSON(components, settings, options),
  }
}
