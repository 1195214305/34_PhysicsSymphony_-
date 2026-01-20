import { useState } from 'react'
import { useSimulationStore } from '../store/simulationStore'
import { calculateCutoffFrequency, calculateWavelength } from '../utils/waveSimulation'

export default function InfoPanel() {
  const { mode, frequency, amplitude, waveguideWidth, waveguideHeight, qwenApiKey } = useSimulationStore()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const cutoffFreq = calculateCutoffFrequency(mode, waveguideWidth, waveguideHeight)
  const wavelength = calculateWavelength(frequency, waveguideWidth, mode)
  const C = 299792458 // 光速 m/s
  const freeSpaceWavelength = (C / (frequency * 1e9)) * 100 // cm

  const handleAskQuestion = async () => {
    if (!question.trim()) return
    if (!qwenApiKey) {
      setAnswer('请先在设置中配置千问API Key')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/qwen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          context: {
            mode,
            frequency,
            amplitude,
            waveguideWidth,
            waveguideHeight,
            cutoffFreq,
            wavelength
          },
          apiKey: qwenApiKey
        })
      })

      const data = await response.json()
      if (data.error) {
        setAnswer(`错误: ${data.error}`)
      } else {
        setAnswer(data.answer)
      }
    } catch (error) {
      setAnswer(`请求失败: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 参数信息 */}
      <div className="bg-dark/50 backdrop-blur-sm border border-primary/20 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-4">仿真参数</h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">传播模式:</span>
            <span className="text-white font-medium">{mode === 'te' ? 'TE模式' : 'TM模式'}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">工作频率:</span>
            <span className="text-white font-medium">{frequency.toFixed(2)} GHz</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">截止频率:</span>
            <span className={frequency >= cutoffFreq ? 'text-secondary' : 'text-red-400'}>
              {cutoffFreq.toFixed(2)} GHz
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">自由空间波长:</span>
            <span className="text-white font-medium">{freeSpaceWavelength.toFixed(2)} cm</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">波导波长:</span>
            <span className="text-white font-medium">
              {wavelength === Infinity ? '∞ (截止)' : `${wavelength.toFixed(2)} cm`}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">波导尺寸:</span>
            <span className="text-white font-medium">
              {waveguideWidth.toFixed(1)} × {waveguideHeight.toFixed(1)} cm
            </span>
          </div>
        </div>
      </div>

      {/* 理论说明 */}
      <div className="bg-dark/50 backdrop-blur-sm border border-primary/20 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-4">理论说明</h2>

        <div className="space-y-3 text-sm text-gray-300">
          <div>
            <h3 className="text-white font-medium mb-1">TE模式 (横电波)</h3>
            <p className="text-xs leading-relaxed">
              电场方向垂直于传播方向，磁场有纵向分量。TE10是矩形波导的最低阶模式。
            </p>
          </div>

          <div>
            <h3 className="text-white font-medium mb-1">TM模式 (横磁波)</h3>
            <p className="text-xs leading-relaxed">
              磁场方向垂直于传播方向，电场有纵向分量。TM11是矩形波导的最低阶TM模式。
            </p>
          </div>

          <div>
            <h3 className="text-white font-medium mb-1">截止频率</h3>
            <p className="text-xs leading-relaxed">
              当工作频率低于截止频率时，电磁波无法在波导中传播，会发生衰减。
            </p>
          </div>
        </div>
      </div>

      {/* AI助手 */}
      <div className="bg-dark/50 backdrop-blur-sm border border-primary/20 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-4">AI学习助手</h2>

        <div className="space-y-3">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="向AI提问关于电磁波的问题..."
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:border-primary/50"
            rows={3}
          />

          <button
            onClick={handleAskQuestion}
            disabled={loading || !question.trim()}
            className="w-full py-2 bg-primary/20 text-primary border border-primary/50 rounded-lg font-medium hover:bg-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '思考中...' : '提问'}
          </button>

          {answer && (
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 leading-relaxed">
              {answer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
