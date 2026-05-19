# UI Skill Generator

<div align="center">
  <img src="public/logo.ico" alt="UI Skill Generator Logo" width="120" height="120">
  
  **可视化界面编辑器 - AI提示词生成器**
  
  通过拖拽式可视化编辑，快速设计界面并生成AI提示词，助力AI辅助开发
  
  [在线演示](#) | [功能特性](#功能特性) | [快速开始](#快速开始)
</div>

---

## 📖 项目简介

UI Skill Generator 是一个基于 React + TypeScript + Vite 构建的可视化界面编辑器。用户可以通过拖拽组件的方式快速设计界面布局，系统会自动生成三种格式的AI提示词（自然语言、Markdown、JSON），可直接用于 Cursor、v0.dev 等 AI 编码工具。

### 核心价值

- **零代码界面设计**：拖拽式操作，所见即所得
- **AI提示词生成**：一键生成结构化提示词，精确描述界面
- **多格式导出**：支持自然语言、Markdown、JSON三种格式
- **中英双语**：支持中文和英文提示词生成

---

## ✨ 功能特性

### 🎨 可视化编辑

| 功能 | 描述 |
|------|------|
| **组件拖拽** | 支持10种UI组件：文本、按钮、输入框、图片、卡片、导航栏、图标、开关、文本域、下拉框 |
| **实时预览** | 编辑即时反映在画布上 |
| **属性编辑** | 完整的样式属性面板（内容、布局、样式、响应式、动效） |
| **多视口模式** | 桌面端、平板、移动端三种预览模式 |
| **网格背景** | 可选的网格辅助线 |
| **对齐吸附** | 组件间自动对齐吸附 |

### 📋 提示词生成

- **自然语言格式**：适合通用AI对话
- **Markdown格式**：结构化Skill文档，适合Cursor等工具
- **JSON格式**：机器可读的结构化数据

### 💾 项目管理

- **保存/加载**：本地存储项目
- **导入/导出**：JSON格式项目文件
- **预设模板**：登录页、注册表单、产品卡片
- **新建画布**：多种预设尺寸 + 自定义尺寸
- **撤销/重做**：完整的历史记录管理

### ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Delete` / `Backspace` | 删除选中组件 |
| `Ctrl + Z` | 撤销 |
| `Ctrl + Y` / `Ctrl + Shift + Z` | 重做 |

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装

```bash
# 克隆仓库
git clone https://github.com/your-username/ui-skill-generator.git

# 进入目录
cd ui-skill-generator

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev
```

访问 http://localhost:5173 查看应用

### 构建

```bash
# 生产构建
npm run build

# 预览构建结果
npm run preview
```

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| [React 19](https://react.dev/) | UI框架 |
| [TypeScript](https://www.typescriptlang.org/) | 类型安全 |
| [Vite 8](https://vitejs.dev/) | 构建工具 |
| [Zustand](https://zustand-demo.pmnd.rs/) | 状态管理 |
| [Tailwind CSS 4](https://tailwindcss.com/) | 样式框架 |
| [Lucide React](https://lucide.dev/) | 图标库 |
| [React Colorful](https://omgovich.github.io/react-colorful/) | 颜色选择器 |

---

## 📁 项目结构

```
ui-skill-generator/
├── public/
│   └── logo.ico              # 网站图标
├── src/
│   ├── components/
│   │   ├── Canvas.tsx        # 画布组件
│   │   ├── ComponentLibrary.tsx  # 组件库面板
│   │   ├── PropertyPanel.tsx # 属性编辑面板
│   │   ├── Toolbar.tsx       # 工具栏
│   │   ├── PromptModal.tsx   # 提示词模态框
│   │   └── ui/               # UI子组件
│   │       ├── ColorPicker.tsx
│   │       ├── Slider.tsx
│   │       └── ShadowSelector.tsx
│   ├── store/
│   │   └── canvasStore.ts    # Zustand状态管理
│   ├── utils/
│   │   └── promptGenerator.ts # 提示词生成逻辑
│   ├── App.tsx               # 根组件
│   ├── main.tsx              # 入口文件
│   └── index.css             # 全局样式
├── index.html                # HTML模板
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🎯 使用指南

### 1. 添加组件

从左侧组件库拖拽组件到画布，支持以下组件类型：

- **文本** - 普通文本内容
- **按钮** - 可点击按钮
- **输入框** - 单行输入
- **文本域** - 多行输入
- **下拉框** - 选择器
- **图片** - 图片容器
- **卡片** - 内容卡片
- **导航栏** - 顶部导航
- **图标** - 图标容器
- **开关** - 开关切换

### 2. 编辑属性

选中组件后，在右侧属性面板编辑：

- **内容** - 文本、占位符、图片URL
- **布局** - 位置、尺寸、图层顺序
- **样式** - 字体、颜色、边框、阴影、圆角
- **响应式** - 移动端行为设置
- **动效** - 悬停和点击效果

### 3. 生成提示词

点击工具栏的"生成提示词"按钮：

1. 选择语言（中文/英文）
2. 选择详细程度
3. 复制生成的提示词
4. 可直接跳转到 v0.dev 或 Cursor 测试

### 4. 项目管理

- **保存**：保存到浏览器本地存储
- **加载**：从本地存储加载
- **导出**：下载JSON项目文件
- **导入**：上传JSON项目文件
- **模板**：快速加载预设模板

---

## 🔧 组件属性详解

每个组件支持以下属性：

```typescript
interface CanvasComponent {
  id: string                    // 唯一标识
  type: ComponentType           // 组件类型
  x: number                     // X坐标
  y: number                     // Y坐标
  zIndex: number                // 层级
  variableName?: string         // 变量名（代码生成用）
  content: string               // 内容
  imageUrl?: string             // 图片URL
  style: {
    width: number               // 宽度
    height: number              // 高度
    fontSize: number            // 字号
    fontWeight: number          // 字重
    color: string               // 文字颜色
    backgroundColor: string     // 背景色
    borderRadius: number        // 圆角
    padding: number             // 内边距
    borderWidth: number         // 边框宽度
    borderColor: string         // 边框颜色
    borderStyle: string         // 边框样式
    shadow: ShadowPreset | null // 阴影
    opacity: number             // 透明度
    // ...
  }
  responsive: ResponsiveSettings  // 响应式设置
  animation: AnimationSettings    // 动效设置
}
```

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'Add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

### 代码规范

```bash
# 运行 ESLint 检查
npm run lint

# TypeScript 类型检查
npx tsc --noEmit
```

---

## 📄 许可证

[MIT License](LICENSE)

---

## 🙏 致谢

- [React](https://react.dev/) - UI框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Lucide](https://lucide.dev/) - 图标库
- [Zustand](https://zustand-demo.pmnd.rs/) - 状态管理

---

<div align="center">
  
  **[⬆ 返回顶部](#ui-skill-generator)**
  
  Made with ❤️ by UI Skill Generator Team
</div>
