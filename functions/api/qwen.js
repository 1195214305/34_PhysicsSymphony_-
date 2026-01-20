/**
 * 边缘函数: 千问API代理
 * 路径: /api/qwen
 * 功能: 调用阿里云千问API，提供AI学习助手功能
 */

export default async function handler(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }

  // 处理 CORS 预检请求
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
    const { question, context, apiKey } = body

    if (!question || !apiKey) {
      return new Response(JSON.stringify({ error: '缺少必要参数' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 构建提示词
    const prompt = `你是一个物理教学助手，专门帮助学生理解导行电磁波的相关知识。

当前仿真参数：
- 传播模式: ${context.mode === 'te' ? 'TE模式（横电波）' : 'TM模式（横磁波）'}
- 工作频率: ${context.frequency} GHz
- 截止频率: ${context.cutoffFreq.toFixed(2)} GHz
- 波导波长: ${context.wavelength === Infinity ? '∞ (截止)' : context.wavelength.toFixed(2) + ' cm'}
- 波导尺寸: ${context.waveguideWidth} × ${context.waveguideHeight} cm

学生的问题：${question}

请用简洁易懂的语言回答，结合当前仿真参数进行解释。`

    // 调用千问API
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: {
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        parameters: {
          result_format: 'message'
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(JSON.stringify({
        error: `千问API调用失败: ${response.status}`,
        details: errorText
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const data = await response.json()

    if (data.output && data.output.choices && data.output.choices[0]) {
      const answer = data.output.choices[0].message.content

      return new Response(JSON.stringify({ answer }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } else {
      return new Response(JSON.stringify({ error: 'API返回格式异常' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

  } catch (error) {
    return new Response(JSON.stringify({
      error: '服务器错误',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}
