/**
 * 边缘函数: 电磁场计算
 * 路径: /api/compute
 * 功能: 在边缘节点进行电磁场分布计算，利用缓存加速
 */

export default async function handler(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: '仅支持POST请求' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const body = await request.json()
    const { mode, frequency, amplitude, waveguideWidth, waveguideHeight, time, gridSize = 100 } = body

    // 生成缓存键
    const cacheKey = `field_${mode}_${frequency}_${amplitude}_${waveguideWidth}_${waveguideHeight}_${time.toFixed(2)}_${gridSize}`

    // 尝试从边缘缓存读取
    const cache = caches.default
    const cacheRequest = new Request(`https://cache/${cacheKey}`)

    let cached = await cache.match(cacheRequest)
    if (cached) {
      const cachedData = await cached.json()
      return new Response(JSON.stringify({
        ...cachedData,
        cached: true
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-Cache': 'HIT'
        }
      })
    }

    // 执行计算
    const fieldData = calculateFieldDistribution({
      mode,
      frequency,
      amplitude,
      waveguideWidth,
      waveguideHeight,
      time
    }, gridSize)

    const result = {
      fieldData,
      params: { mode, frequency, amplitude, waveguideWidth, waveguideHeight, time },
      timestamp: Date.now(),
      cached: false
    }

    // 写入缓存（缓存10秒）
    const response = new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=10'
      }
    })

    await cache.put(cacheRequest, response.clone())

    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'X-Cache': 'MISS'
      }
    })

  } catch (error) {
    return new Response(JSON.stringify({
      error: '计算失败',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// 电磁场计算函数（与前端相同的算法）
function calculateFieldDistribution(params, gridSize) {
  const { mode, frequency, amplitude, waveguideWidth, waveguideHeight, time } = params

  const C = 299792458 // 光速 m/s
  const PI = Math.PI

  const field = []

  // 转换单位
  const f = frequency * 1e9 // Hz
  const a = waveguideWidth / 100 // m
  const b = waveguideHeight / 100 // m
  const omega = 2 * PI * f
  const k0 = omega / C

  if (mode === 'te') {
    // TE10模式
    const m = 1
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
  } else {
    // TM11模式
    const m = 1
    const n = 1
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
  }

  return field
}
