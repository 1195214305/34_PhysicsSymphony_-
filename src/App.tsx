import { useState, useEffect } from 'react'
import WaveSimulator from './components/WaveSimulator'
import ControlPanel from './components/ControlPanel'
import InfoPanel from './components/InfoPanel'
import SettingsModal from './components/SettingsModal'
import { useSimulationStore } from './store/simulationStore'

function App() {
  const [showSettings, setShowSettings] = useState(false)
  const { mode, frequency, amplitude } = useSimulationStore()

  return (
    <div className="min-h-screen bg-darker relative overflow-hidden">
      {/* 网格背景 */}
      <div className="absolute inset-0 grid-background opacity-20"></div>

      {/* 主容器 */}
      <div className="relative z-10">
        {/* 顶部导航 */}
        <header className="border-b border-primary/20 backdrop-blur-sm bg-dark/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">PhysicsSymphony</h1>
                  <p className="text-xs text-gray-400">导行电磁波仿真教学平台</p>
                </div>
              </div>

              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="设置"
              >
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* 主内容区 */}
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 左侧控制面板 */}
            <div className="lg:col-span-3">
              <ControlPanel />
            </div>

            {/* 中间仿真区域 */}
            <div className="lg:col-span-6">
              <WaveSimulator />
            </div>

            {/* 右侧信息面板 */}
            <div className="lg:col-span-3">
              <InfoPanel />
            </div>
          </div>
        </main>

        {/* 底部信息 */}
        <footer className="border-t border-primary/20 backdrop-blur-sm bg-dark/50 mt-8">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span>本项目由</span>
                <a
                  href="https://www.aliyun.com/product/esa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-secondary transition-colors"
                >
                  阿里云ESA
                </a>
                <span>提供加速、计算和保护</span>
              </div>
              <div className="flex items-center gap-4">
                <span>当前模式: {mode === 'te' ? 'TE模式' : 'TM模式'}</span>
                <span>频率: {frequency.toFixed(1)} GHz</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* 设置弹窗 */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}

export default App
