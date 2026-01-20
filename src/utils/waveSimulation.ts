/**
 * 导行电磁波仿真核心算法
 * 基于麦克斯韦方程组的数值解
 */

const C = 299792458 // 光速 m/s
const PI = Math.PI

export interface WaveParams {
  mode: 'te' | 'tm' | 'tem' | 'te10' | 'te20' | 'tm11'
  frequency: number // GHz
  amplitude: number
  waveguideWidth: number // cm
  waveguideHeight: number // cm
  time: number // 时间参数
}

/**
 * 计算TEM模式的电场分布（同轴线）
 */
function calculateTEMMode(params: WaveParams, gridSize: number): number[][] {
  const { frequency, amplitude, waveguideWidth, time } = params
  const field: number[][] = []

  const f = frequency * 1e9
  const omega = 2 * PI * f
  const k0 = omega / C

  for (let i = 0; i < gridSize; i++) {
    field[i] = []
    const r = (i / gridSize) * (waveguideWidth / 100) // 径向距离

    for (let j = 0; j < gridSize; j++) {
      const z = (j / gridSize) * (waveguideWidth / 100) * 5

      // TEM模式的电场（径向分量）
      const Er = amplitude * (1 / (r + 0.01)) * Math.cos(omega * time - k0 * z)

      field[i][j] = Er
    }
  }

  return field
}

/**
 * 计算TE10模式的电场分布
 */
function calculateTE10Mode(params: WaveParams, gridSize: number): number[][] {
  const { frequency, amplitude, waveguideWidth, waveguideHeight, time } = params
  const field: number[][] = []

  const f = frequency * 1e9
  const a = waveguideWidth / 100
  const b = waveguideHeight / 100
  const omega = 2 * PI * f
  const k0 = omega / C

  const m = 1, n = 0
  const kc = PI * m / a
  const beta = Math.sqrt(k0 * k0 - kc * kc)

  for (let i = 0; i < gridSize; i++) {
    field[i] = []
    const x = (i / gridSize) * a

    for (let j = 0; j < gridSize; j++) {
      const z = (j / gridSize) * b * 5

      const Ey = amplitude * Math.sin(PI * x / a) * Math.cos(omega * time - beta * z)
      field[i][j] = Ey
    }
  }

  return field
}

/**
 * 计算TE20模式的电场分布
 */
function calculateTE20Mode(params: WaveParams, gridSize: number): number[][] {
  const { frequency, amplitude, waveguideWidth, waveguideHeight, time } = params
  const field: number[][] = []

  const f = frequency * 1e9
  const a = waveguideWidth / 100
  const b = waveguideHeight / 100
  const omega = 2 * PI * f
  const k0 = omega / C

  const m = 2, n = 0
  const kc = PI * m / a
  const beta = Math.sqrt(k0 * k0 - kc * kc)

  for (let i = 0; i < gridSize; i++) {
    field[i] = []
    const x = (i / gridSize) * a

    for (let j = 0; j < gridSize; j++) {
      const z = (j / gridSize) * b * 5

      const Ey = amplitude * Math.sin(2 * PI * x / a) * Math.cos(omega * time - beta * z)
      field[i][j] = Ey
    }
  }

  return field
}

/**
 * 计算TM11模式的电场分布
 */
function calculateTM11Mode(params: WaveParams, gridSize: number): number[][] {
  const { frequency, amplitude, waveguideWidth, waveguideHeight, time } = params
  const field: number[][] = []

  const f = frequency * 1e9
  const a = waveguideWidth / 100
  const b = waveguideHeight / 100
  const omega = 2 * PI * f
  const k0 = omega / C

  const m = 1, n = 1
  const kc = PI * Math.sqrt((m / a) ** 2 + (n / b) ** 2)
  const beta = Math.sqrt(k0 * k0 - kc * kc)

  for (let i = 0; i < gridSize; i++) {
    field[i] = []
    const x = (i / gridSize) * a

    for (let j = 0; j < gridSize; j++) {
      const z = (j / gridSize) * b * 5

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
  switch (params.mode) {
    case 'te':
    case 'te10':
      return calculateTE10Mode(params, gridSize)
    case 'te20':
      return calculateTE20Mode(params, gridSize)
    case 'tm':
    case 'tm11':
      return calculateTM11Mode(params, gridSize)
    case 'tem':
      return calculateTEMMode(params, gridSize)
    default:
      return calculateTE10Mode(params, gridSize)
  }
}

/**
 * 计算截止频率
 */
export function calculateCutoffFrequency(mode: 'te' | 'tm' | 'tem' | 'te10' | 'te20' | 'tm11', width: number, height: number): number {
  const a = width / 100 // 转换为米
  const b = height / 100

  switch (mode) {
    case 'tem':
      return 0 // TEM模式无截止频率
    case 'te':
    case 'te10':
      return (C / (2 * a)) / 1e9 // TE10模式
    case 'te20':
      return (C / a) / 1e9 // TE20模式
    case 'tm':
    case 'tm11':
      return (C / 2) * Math.sqrt((1 / a) ** 2 + (1 / b) ** 2) / 1e9 // TM11模式
    default:
      return (C / (2 * a)) / 1e9
  }
}

/**
 * 计算波导波长
 */
export function calculateWavelength(frequency: number, width: number, mode: 'te' | 'tm' | 'tem' | 'te10' | 'te20' | 'tm11'): number {
  const f = frequency * 1e9
  const a = width / 100
  const lambda0 = C / f

  switch (mode) {
    case 'tem':
      return lambda0 // TEM模式波长等于自由空间波长
    case 'te':
    case 'te10': {
      const fc = (C / (2 * a))
      if (f <= fc) return Infinity
      return lambda0 / Math.sqrt(1 - (fc / f) ** 2)
    }
    case 'te20': {
      const fc = (C / a)
      if (f <= fc) return Infinity
      return lambda0 / Math.sqrt(1 - (fc / f) ** 2)
    }
    case 'tm':
    case 'tm11': {
      const height = width / 2 // 假设高度为宽度的一半
      const b = height / 100
      const fc = (C / 2) * Math.sqrt((1 / a) ** 2 + (1 / b) ** 2)
      if (f <= fc) return Infinity
      return lambda0 / Math.sqrt(1 - (fc / f) ** 2)
    }
    default:
      return lambda0
  }
}
