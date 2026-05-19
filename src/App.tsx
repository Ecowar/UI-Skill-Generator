import { ComponentLibrary } from './components/ComponentLibrary'
import { Canvas } from './components/Canvas'
import { PropertyPanel } from './components/PropertyPanel'
import { Toolbar } from './components/Toolbar'

function App() {
  const handleDragStart = () => {
    // 可选：添加拖拽开始时的视觉反馈
  }

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <ComponentLibrary onDragStart={handleDragStart} />
        <Canvas />
        <PropertyPanel />
      </div>
    </div>
  )
}

export default App
