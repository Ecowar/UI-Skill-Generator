import type { CanvasComponent, StyleProps, ShadowPreset, ResponsiveSettings, AnimationSettings } from '../store/canvasStore'

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
  }
  return names[type]?.[lang] || type
}

const formatColor = (color: string): string => color

const describeShadow = (shadow: ShadowPreset | null, lang: 'zh' | 'en'): string => {
  if (!shadow) return ''
  return lang === 'zh'
    ? `阴影: ${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`
    : `shadow: ${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`
}

const describeStyle = (style: StyleProps, lang: 'zh' | 'en', detailed: boolean): string[] => {
  const lines: string[] = []
  
  if (lang === 'zh') {
    if (detailed) lines.push(`尺寸: ${style.width}px × ${style.height}px`)
    lines.push(`字体: ${style.fontSize}px, 字重: ${style.fontWeight}`)
    lines.push(`文字颜色: ${formatColor(style.color)}`)
    lines.push(`背景色: ${formatColor(style.backgroundColor)}`)
    lines.push(`圆角: ${style.borderRadius}px`)
    lines.push(`内边距: ${style.padding}px`)
    if (style.borderStyle !== 'none') {
      lines.push(`边框: ${style.borderWidth}px ${style.borderStyle} ${formatColor(style.borderColor)}`)
    }
    if (style.shadow) lines.push(describeShadow(style.shadow, lang))
    if (style.opacity !== 1) lines.push(`透明度: ${style.opacity}`)
  } else {
    if (detailed) lines.push(`Size: ${style.width}px × ${style.height}px`)
    lines.push(`Font: ${style.fontSize}px, Weight: ${style.fontWeight}`)
    lines.push(`Color: ${formatColor(style.color)}`)
    lines.push(`Background: ${formatColor(style.backgroundColor)}`)
    lines.push(`Border Radius: ${style.borderRadius}px`)
    lines.push(`Padding: ${style.padding}px`)
    if (style.borderStyle !== 'none') {
      lines.push(`Border: ${style.borderWidth}px ${style.borderStyle} ${formatColor(style.borderColor)}`)
    }
    if (style.shadow) lines.push(describeShadow(style.shadow, lang))
    if (style.opacity !== 1) lines.push(`Opacity: ${style.opacity}`)
  }
  
  return lines
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
  settings: CanvasSettings,
  options: GenerateOptions
): string {
  const { language, detailed } = options
  const sorted = [...components].sort((a, b) => a.zIndex - b.zIndex)
  
  if (language === 'zh') {
    let text = `设计一个用户界面，画布尺寸为 ${settings.width}px × ${settings.height}px，背景色为 ${settings.backgroundColor}。\n\n`
    text += `该界面包含 ${components.length} 个组件：\n\n`
    
    sorted.forEach((comp, index) => {
      const typeName = getComponentTypeName(comp.type, 'zh')
      text += `${index + 1}. ${typeName}组件`
      
      if (detailed) {
        text += `，位置在 (${Math.round(comp.x)}, ${Math.round(comp.y)})`
      }
      
      if (comp.content && comp.type !== 'switch' && comp.type !== 'image') {
        text += `，内容为"${comp.content}"`
      }
      
      text += '\n'
      
      describeStyle(comp.style, 'zh', detailed).forEach(line => {
        text += `   - ${line}\n`
      })
      
      if (comp.type === 'image' && comp.imageUrl) {
        text += `   - 图片URL: ${comp.imageUrl}\n`
      }
      
      const responsiveLines = describeResponsive(comp.responsive, 'zh')
      if (responsiveLines.length > 0) {
        text += '   - 响应式行为:\n'
        responsiveLines.forEach(line => {
          text += `     * ${line}\n`
        })
      }
      
      const animationLines = describeAnimation(comp.animation, 'zh')
      if (animationLines.length > 0) {
        text += '   - 动效描述:\n'
        animationLines.forEach(line => {
          text += `     * ${line}\n`
        })
      }
      
      text += '\n'
    })
    
    text += `\n请严格按照以上描述实现该界面，确保布局、样式、交互效果与描述一致。`
    
    return text
  } else {
    let text = `Design a user interface with a canvas size of ${settings.width}px × ${settings.height}px and background color ${settings.backgroundColor}.\n\n`
    text += `The interface contains ${components.length} components:\n\n`
    
    sorted.forEach((comp, index) => {
      const typeName = getComponentTypeName(comp.type, 'en')
      text += `${index + 1}. ${typeName} component`
      
      if (detailed) {
        text += ` at position (${Math.round(comp.x)}, ${Math.round(comp.y)})`
      }
      
      if (comp.content && comp.type !== 'switch' && comp.type !== 'image') {
        text += ` with content "${comp.content}"`
      }
      
      text += '\n'
      
      describeStyle(comp.style, 'en', detailed).forEach(line => {
        text += `   - ${line}\n`
      })
      
      if (comp.type === 'image' && comp.imageUrl) {
        text += `   - Image URL: ${comp.imageUrl}\n`
      }
      
      const responsiveLines = describeResponsive(comp.responsive, 'en')
      if (responsiveLines.length > 0) {
        text += '   - Responsive behavior:\n'
        responsiveLines.forEach(line => {
          text += `     * ${line}\n`
        })
      }
      
      const animationLines = describeAnimation(comp.animation, 'en')
      if (animationLines.length > 0) {
        text += '   - Animation:\n'
        animationLines.forEach(line => {
          text += `     * ${line}\n`
        })
      }
      
      text += '\n'
    })
    
    text += `\nPlease implement this interface exactly as described, ensuring the layout, styles, and interactions match the description.`
    
    return text
  }
}

export function generateMarkdownSkill(
  components: CanvasComponent[],
  settings: CanvasSettings,
  options: GenerateOptions
): string {
  const { language, detailed } = options
  const sorted = [...components].sort((a, b) => a.zIndex - b.zIndex)
  
  if (language === 'zh') {
    let md = `# UI Skill: 自定义界面\n\n`
    md += `## 角色设定\n`
    md += `你是一名专业的前端开发工程师。请根据以下描述精确重建这个用户界面。\n\n`
    
    md += `## 画布信息\n`
    md += `- **尺寸**: ${settings.width}px × ${settings.height}px\n`
    md += `- **背景色**: ${settings.backgroundColor}\n`
    md += `- **组件总数**: ${components.length}\n\n`
    
    md += `## 组件列表\n\n`
    
    sorted.forEach((comp, index) => {
      const typeName = getComponentTypeName(comp.type, 'zh')
      md += `### ${index + 1}. ${typeName}\n\n`
      
      if (detailed) {
        md += `**位置**: (${Math.round(comp.x)}, ${Math.round(comp.y)})\n\n`
      }
      
      if (comp.content && comp.type !== 'switch' && comp.type !== 'image') {
        md += `**内容**: "${comp.content}"\n\n`
      }
      
      md += `**样式属性**:\n`
      md += '```\n'
      describeStyle(comp.style, 'zh', detailed).forEach(line => {
        md += `${line}\n`
      })
      md += '```\n\n'
      
      if (comp.type === 'image' && comp.imageUrl) {
        md += `**图片URL**: \`${comp.imageUrl}\`\n\n`
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
    md += `1. 严格按照上述描述实现每个组件的位置、尺寸和样式\n`
    md += `2. 确保组件间的层级关系正确\n`
    md += `3. 保持视觉风格一致，细节精确还原\n`
    md += `4. 使用现代前端技术栈（React/Vue等）实现\n`
    md += `5. 实现响应式布局，支持移动端适配\n`
    md += `6. 添加必要的交互动效\n`
    
    return md
  } else {
    let md = `# UI Skill: Custom Interface\n\n`
    md += `## Role\n`
    md += `You are a professional frontend developer. Please recreate this user interface exactly as described below.\n\n`
    
    md += `## Canvas Information\n`
    md += `- **Size**: ${settings.width}px × ${settings.height}px\n`
    md += `- **Background**: ${settings.backgroundColor}\n`
    md += `- **Total Components**: ${components.length}\n\n`
    
    md += `## Component List\n\n`
    
    sorted.forEach((comp, index) => {
      const typeName = getComponentTypeName(comp.type, 'en')
      md += `### ${index + 1}. ${typeName}\n\n`
      
      if (detailed) {
        md += `**Position**: (${Math.round(comp.x)}, ${Math.round(comp.y)})\n\n`
      }
      
      if (comp.content && comp.type !== 'switch' && comp.type !== 'image') {
        md += `**Content**: "${comp.content}"\n\n`
      }
      
      md += `**Styles**:\n`
      md += '```\n'
      describeStyle(comp.style, 'en', detailed).forEach(line => {
        md += `${line}\n`
      })
      md += '```\n\n'
      
      if (comp.type === 'image' && comp.imageUrl) {
        md += `**Image URL**: \`${comp.imageUrl}\`\n\n`
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
    md += `1. Implement each component with exact position, size, and style as described\n`
    md += `2. Ensure correct layer ordering between components\n`
    md += `3. Maintain consistent visual style and precise details\n`
    md += `4. Use modern frontend stack (React/Vue, etc.)\n`
    md += `5. Implement responsive layout for mobile adaptation\n`
    md += `6. Add necessary interaction animations\n`
    
    return md
  }
}

export function generateStructuredJSON(
  components: CanvasComponent[],
  settings: CanvasSettings
): string {
  const sorted = [...components].sort((a, b) => a.zIndex - b.zIndex)
  
  const data = {
    canvas: {
      width: settings.width,
      height: settings.height,
      backgroundColor: settings.backgroundColor,
    },
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
    json: generateStructuredJSON(components, settings),
  }
}
