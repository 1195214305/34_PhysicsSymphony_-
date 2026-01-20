/**
 * 边缘函数: 健康检查
 * 路径: /api/health
 * 功能: 检查边缘函数是否正常运行
 */

export default async function handler(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'PhysicsSymphony Edge Functions',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/qwen',
      '/api/compute'
    ]
  }

  return new Response(JSON.stringify(healthData), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
