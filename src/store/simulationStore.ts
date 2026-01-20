import { create } from 'zustand'

interface SimulationState {
  // 仿真参数
  mode: 'te' | 'tm' | 'tem' | 'te10' | 'te20' | 'tm11'
  frequency: number
  amplitude: number
  waveguideWidth: number
  waveguideHeight: number
  isPlaying: boolean
  speed: number

  // 可视化选项
  visualizationMode: 'field' | 'vector' | 'energy'
  showFieldLines: boolean
  showEnergyFlow: boolean

  // 千问API配置
  qwenApiKey: string

  // 计算结果缓存
  fieldData: number[][] | null

  // 操作方法
  setMode: (mode: 'te' | 'tm' | 'tem' | 'te10' | 'te20' | 'tm11') => void
  setFrequency: (freq: number) => void
  setAmplitude: (amp: number) => void
  setWaveguideWidth: (width: number) => void
  setWaveguideHeight: (height: number) => void
  setIsPlaying: (playing: boolean) => void
  setSpeed: (speed: number) => void
  setVisualizationMode: (mode: 'field' | 'vector' | 'energy') => void
  setShowFieldLines: (show: boolean) => void
  setShowEnergyFlow: (show: boolean) => void
  setQwenApiKey: (key: string) => void
  setFieldData: (data: number[][] | null) => void
  reset: () => void
}

const initialState = {
  mode: 'te' as const,
  frequency: 10.0,
  amplitude: 1.0,
  waveguideWidth: 2.0,
  waveguideHeight: 1.0,
  isPlaying: false,
  speed: 1.0,
  visualizationMode: 'field' as const,
  showFieldLines: false,
  showEnergyFlow: false,
  qwenApiKey: '',
  fieldData: null,
}

export const useSimulationStore = create<SimulationState>((set) => ({
  ...initialState,

  setMode: (mode) => set({ mode }),
  setFrequency: (frequency) => set({ frequency }),
  setAmplitude: (amplitude) => set({ amplitude }),
  setWaveguideWidth: (waveguideWidth) => set({ waveguideWidth }),
  setWaveguideHeight: (waveguideHeight) => set({ waveguideHeight }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setSpeed: (speed) => set({ speed }),
  setVisualizationMode: (visualizationMode) => set({ visualizationMode }),
  setShowFieldLines: (showFieldLines) => set({ showFieldLines }),
  setShowEnergyFlow: (showEnergyFlow) => set({ showEnergyFlow }),
  setQwenApiKey: (qwenApiKey) => {
    set({ qwenApiKey })
    // 保存到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('qwen_api_key', qwenApiKey)
    }
  },
  setFieldData: (fieldData) => set({ fieldData }),
  reset: () => set(initialState),
}))

// 初始化时从localStorage读取API Key
if (typeof window !== 'undefined') {
  const savedKey = localStorage.getItem('qwen_api_key')
  if (savedKey) {
    useSimulationStore.setState({ qwenApiKey: savedKey })
  }
}
