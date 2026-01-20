import { useSimulationStore } from '../store/simulationStore'
import { calculateCutoffFrequency } from '../utils/waveSimulation'

export default function ControlPanel() {
  const {
    mode,
    frequency,
    amplitude,
    waveguideWidth,
    waveguideHeight,
    isPlaying,
    speed,
    setMode,
    setFrequency,
    setAmplitude,
    setWaveguideWidth,
    setWaveguideHeight,
    setIsPlaying,
    setSpeed,
    reset
  } = useSimulationStore()

  const cutoffFreq = calculateCutoffFrequency(mode, waveguideWidth, waveguideHeight)

  return (
    <div className="bg-dark/50 backdrop-blur-sm border border-primary/20 rounded-lg p-4 animate-fade-in">
      <h2 className="text-lg font-semibold text-white mb-4">控制面板</h2>

      {/* 播放控制 */}
      <div className="mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              isPlaying
                ? 'bg-secondary/20 text-secondary border border-secondary/50'
                : 'bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30'
            }`}
          >
            {isPlaying ? '暂停' : '播放'}
          </button>
          <button
            onClick={reset}
            className="px-4 py-3 rounded-lg font-medium bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 transition-all"
          >
            重置
          </button>
        </div>
      </div>

      {/* 模式选择 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          传播模式
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMode('te')}
            className={`py-2 rounded-lg font-medium transition-all ${
              mode === 'te'
                ? 'bg-primary text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            TE模式
          </button>
          <button
            onClick={() => setMode('tm')}
            className={`py-2 rounded-lg font-medium transition-all ${
              mode === 'tm'
                ? 'bg-primary text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            TM模式
          </button>
        </div>
      </div>

      {/* 频率控制 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          频率: {frequency.toFixed(1)} GHz
          {frequency < cutoffFreq && (
            <span className="ml-2 text-xs text-red-400">(低于截止频率)</span>
          )}
        </label>
        <input
          type="range"
          min="1"
          max="30"
          step="0.1"
          value={frequency}
          onChange={(e) => setFrequency(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1 GHz</span>
          <span className="text-secondary">截止: {cutoffFreq.toFixed(1)} GHz</span>
          <span>30 GHz</span>
        </div>
      </div>

      {/* 振幅控制 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          振幅: {amplitude.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={amplitude}
          onChange={(e) => setAmplitude(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.1</span>
          <span>2.0</span>
        </div>
      </div>

      {/* 波导尺寸 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          波导宽度: {waveguideWidth.toFixed(1)} cm
        </label>
        <input
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={waveguideWidth}
          onChange={(e) => setWaveguideWidth(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          波导高度: {waveguideHeight.toFixed(1)} cm
        </label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={waveguideHeight}
          onChange={(e) => setWaveguideHeight(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* 速度控制 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          播放速度: {speed.toFixed(1)}x
        </label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.1x</span>
          <span>3.0x</span>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ff6b35;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ff6b35;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}
