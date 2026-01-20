import { useEffect, useRef, useState } from 'react'
import { useSimulationStore } from '../store/simulationStore'
import { calculateFieldDistribution } from '../utils/waveSimulation'

export default function WaveSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const timeRef = useRef(0)

  const { mode, frequency, amplitude, waveguideWidth, waveguideHeight, isPlaying, speed } = useSimulationStore()

  const [fps, setFps] = useState(0)
  const fpsRef = useRef({ frames: 0, lastTime: Date.now() })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置canvas尺寸
    const updateSize = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)

    const animate = () => {
      if (!isPlaying) return

      timeRef.current += 0.01 * speed

      // 计算电磁场分布
      const fieldData = calculateFieldDistribution({
        mode,
        frequency,
        amplitude,
        waveguideWidth,
        waveguideHeight,
        time: timeRef.current
      }, 100)

      // 绘制场分布
      drawField(ctx, fieldData, canvas.width, canvas.height)

      // 计算FPS
      fpsRef.current.frames++
      const now = Date.now()
      if (now - fpsRef.current.lastTime >= 1000) {
        setFps(fpsRef.current.frames)
        fpsRef.current.frames = 0
        fpsRef.current.lastTime = now
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    if (isPlaying) {
      animate()
    } else {
      // 静态显示
      const fieldData = calculateFieldDistribution({
        mode,
        frequency,
        amplitude,
        waveguideWidth,
        waveguideHeight,
        time: timeRef.current
      }, 100)
      drawField(ctx, fieldData, canvas.width, canvas.height)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', updateSize)
    }
  }, [mode, frequency, amplitude, waveguideWidth, waveguideHeight, isPlaying, speed])

  const drawField = (ctx: CanvasRenderingContext2D, fieldData: number[][], width: number, height: number) => {
    // 清空画布
    ctx.fillStyle = '#050814'
    ctx.fillRect(0, 0, width, height)

    const gridSize = fieldData.length
    const cellWidth = width / gridSize
    const cellHeight = height / gridSize

    // 找到最大值用于归一化
    let maxVal = 0
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        maxVal = Math.max(maxVal, Math.abs(fieldData[i][j]))
      }
    }

    // 绘制场分布
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const value = fieldData[i][j] / (maxVal || 1)
        const color = getColorForValue(value)

        ctx.fillStyle = color
        ctx.fillRect(i * cellWidth, j * cellHeight, cellWidth + 1, cellHeight + 1)
      }
    }

    // 绘制网格线
    ctx.strokeStyle = 'rgba(255, 107, 53, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i <= gridSize; i += 10) {
      ctx.beginPath()
      ctx.moveTo(i * cellWidth, 0)
      ctx.lineTo(i * cellWidth, height)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, i * cellHeight)
      ctx.lineTo(width, i * cellHeight)
      ctx.stroke()
    }

    // 绘制边界
    ctx.strokeStyle = '#ff6b35'
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, width, height)
  }

  const getColorForValue = (value: number): string => {
    // 使用科学可视化配色：蓝色(负) -> 黑色(0) -> 橙红色(正)
    if (value > 0) {
      const intensity = Math.min(value, 1)
      const r = Math.floor(255 * intensity)
      const g = Math.floor(107 * intensity)
      const b = Math.floor(53 * intensity)
      return `rgb(${r}, ${g}, ${b})`
    } else {
      const intensity = Math.min(-value, 1)
      const r = Math.floor(0 * intensity)
      const g = Math.floor(229 * intensity)
      const b = Math.floor(204 * intensity)
      return `rgb(${r}, ${g}, ${b})`
    }
  }

  return (
    <div className="bg-dark/50 backdrop-blur-sm border border-primary/20 rounded-lg p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">电磁场分布可视化</h2>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>FPS: {fps}</span>
          <span>{mode === 'te' ? 'TE模式' : 'TM模式'}</span>
        </div>
      </div>

      <div className="relative bg-darker rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-gray-300">点击播放按钮开始仿真</p>
            </div>
          </div>
        )}
      </div>

      {/* 色标 */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs text-gray-400">场强:</span>
        <div className="flex-1 h-6 rounded" style={{
          background: 'linear-gradient(to right, rgb(0, 229, 204), rgb(5, 8, 20), rgb(255, 107, 53))'
        }}></div>
        <div className="flex gap-4 text-xs text-gray-400">
          <span>负</span>
          <span>零</span>
          <span>正</span>
        </div>
      </div>
    </div>
  )
}
