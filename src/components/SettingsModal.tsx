import { useState } from 'react'
import { useSimulationStore } from '../store/simulationStore'

interface SettingsModalProps {
  onClose: () => void
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { qwenApiKey, setQwenApiKey } = useSimulationStore()
  const [tempKey, setTempKey] = useState(qwenApiKey)

  const handleSave = () => {
    setQwenApiKey(tempKey)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-dark border border-primary/20 rounded-lg p-6 max-w-md w-full animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">设置</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* 千问API Key配置 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              千问API Key
            </label>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
            />
            <p className="mt-2 text-xs text-gray-500">
              配置后可使用AI学习助手功能。API Key将保存在浏览器本地存储中。
            </p>
          </div>

          {/* 获取API Key说明 */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <h3 className="text-sm font-medium text-white mb-2">如何获取API Key？</h3>
            <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
              <li>访问阿里云百炼平台</li>
              <li>登录并进入控制台</li>
              <li>创建应用并获取API Key</li>
              <li>将API Key粘贴到上方输入框</li>
            </ol>
            <a
              href="https://bailian.console.aliyun.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-primary hover:text-secondary transition-colors"
            >
              前往百炼平台 →
            </a>
          </div>

          {/* 关于项目 */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <h3 className="text-sm font-medium text-white mb-2">关于项目</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              PhysicsSymphony 是一个基于ESA边缘计算的导行电磁波仿真教学平台，
              利用边缘函数实现实时物理计算和AI辅助学习。
            </p>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-white/10 text-gray-300 rounded-lg font-medium hover:bg-white/20 transition-all"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/80 transition-all"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
