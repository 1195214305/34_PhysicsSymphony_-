/**
 * 导行电磁波仿真核心算法
 * 基于麦克斯韦方程组的数值解
 */

const C = 299792458 // 光速 m/s
const PI = Math.PI

export interface WaveParams {
  mode: 'te' | 'tm'
  frequency: number // GHz
  amplitude: number
  waveguideWidth: number // cm
  waveguideHeight: number // cm
  time: number // 时间参数
}

/**
 * 计算TE模式的电场分布
 */
function calculateTEMode(params: WaveParams, gridSize: number): number[][] {
  const { frequency, amplitude, waveguideWidth, waveguideHeight, time } = params
  const field: number[][] = []

  // 转换单位
  const f = frequency * 1e9 // Hz
  const a = waveguideWidth / 100 // m
  const b = waveguideHeight / 100 // m
  const omega = 2 * PI * f
  const k0 = omega / C

  // TE10模式（最低阶模式）
  const m = 1
  const n = 0
  const kc = PI * m / a // 截止波数

  // 传播常数
  const beta = Math.sqrt(k0 * k0 - kc * kc)

  for (let i = 0; i < gridSize; i++) {
    field[i] = []
    const x = (i / gridSize) * a

    for (let j = 0; j < gridSize; j++) {
      const z = (j / gridSize) * b * 5 // 延长显示区域

      // TE10模式的电场分量 Ey
      const Ey = amplitude * Math.sin(PI * x / a) * Math.cos(omega * time - beta * z)

      field[i][j] = Ey
    }
  }

  return field
}

/**
 * 计算TM模式的电场分布
 */
function calculateTMMode(params: WaveParams, gridSize: number): number[][] {
  const { frequency, amplitude, waveguideWidth, waveguideHeight, time } = params
  const field: number[][] = []

  // 转换单位
  const f = frequency * 1e9 // Hz
  const a = waveguideWidth / 100 // m
  const b = waveguideHeight / 100 // m
  const omega = 2 * PI * f
  const k0 = omega / C

  // TM11模式（最低阶模式）
  const m = 1
  const n = 1
  const kc = PI * Math.sqrt((m / a) ** 2 + (n / b) ** 2)

  // 传播常数
  const beta = Math.sqrt(k0 * k0 - kc * kc)

  for (let i = 0; i < gridSize; i++) {
    field[i] = []
    const x = (i / gridSize) * a

    for (let j = 0; j < gridSize; j++) {
      const z = (j / gridSize) * b * 5

      // TM11模式的电场分量 Ez
      const Ez = amplitude * Math.sin(PI * m * x / a) * Math.sin(PI * n * z / (b * 5)) * Math.cos(omega * time - beta * z)

      field[i][j] = Ez
    }
  }

  return field
}

/**
 * 计算电磁场分布
 */
export function calculateFieldDistribution(params: WaveParams, gridSize: number = 100): number[][] {
  if (params.mode === 'te') {
    return calculateTEMode(params, gridSize)
  } else {
    return calculateTMMode(params, gridSize)
  }
}

/**
 * 计算截止频率
 */
export function calculateCutoffFrequency(mode: 'te' | 'tm', width: number, height: number): number {
  const a = width / 100 // 转换为米
  const b = height / 100

  if (mode === 'te') {
    // TE10模式
    return (C / (2 * a)) / 1e9 // 转换为GHz
  } else {
    // TM11模式
    return (C / 2) * Math.sqrt((1 / a) ** 2 + (1 / b) ** 2) / 1e9
  }
}

/**
 * 计算波导波长
 */
export function calculateWavelength(frequency: number, width: number, mode: 'te' | 'tm'): number {
  const f = frequency * 1e9
  const a = width / 100
  const lambda0 = C / f

  if (mode === 'te') {
    const fc = (C / (2 * a))
    if (f <= fc) return Infinity
    return lambda0 / Math.sqrt(1 - (fc / f) ** 2)
  } else {
    const height = width / 2 // 假设高度为宽度的一半
    const b = height / 100
    const fc = (C / 2) * Math.sqrt((1 / a) ** 2 + (1 / b) ** 2)
    if (f <= fc) return Infinity
    return lambda0 / Math.sqrt(1 - (fc / f) ** 2)
  }
}
