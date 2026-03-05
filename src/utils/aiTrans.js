import config from '../config'
import request from './request'

const TIMEOUT = 180000 // 3分钟硬超时

const aiTrans = async (csv, nameMap) => {
  if (!config.aiApiKey || !config.aiApiEndpoint) {
    return null
  }

  let endpoint = config.aiApiEndpoint.trim()
  if (endpoint) {
    if (!endpoint.endsWith('/chat/completions') && 
        !endpoint.endsWith('/openai') && 
        !endpoint.endsWith('/v1')) {
      endpoint = endpoint.replace(/\/+$/, '') + '/v1/chat/completions'
    } else if (endpoint.endsWith('/v1')) {
      endpoint = endpoint.replace(/\/+$/, '') + '/chat/completions'
    }
  }

  const nameContext = Array.from(nameMap.entries())
    .map(([jp, trans]) => `${jp}->${trans}`)
    .join(',')

  const prompt = `Translate GBF scenario to Chinese. 
Reference Names: ${nameContext}.

Input: JSON array of objects (id, name, text).
Output: A JSON object with TWO keys:
1. "name_map": Object for NEW character names (Japanese:Chinese). Skip names in Reference Names.
2. "trans_map": Object for dialogue (id:translated_text).

Example:
{
  "name_map": {"JP_Name": "CN_Name"},
  "trans_map": {"0-chapter_name": "Translated Title", "12345": "Translated Text..."}
}

Output ONLY the JSON. No explanation, no markdown.
IMPORTANT: 
1. Use the EXACT "id" from input.
2. DO NOT include character names or colons in "trans_map" values. ONLY the dialogue.`

  const body = JSON.stringify({
    model: config.aiModel,
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: csv }
    ],
    response_format: { type: "json_object" }
  })

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.aiApiKey}`,
    'X-Title': 'BLHXFY',
    'HTTP-Referer': 'https://github.com/biuuu/BLHXFY'
  }

  const parseResult = (data) => {
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      let result = data.choices[0].message.content.trim()
      result = result.replace(/^```json\n?/, '').replace(/\n?```$/, '')
      
      try {
        return JSON.parse(result)
      } catch (e) {
        // 如果直接解析失败，尝试提取第一个完整的大括号结构
        const start = result.indexOf('{')
        if (start !== -1) {
          let depth = 0
          let end = -1
          for (let i = start; i < result.length; i++) {
            if (result[i] === '{') depth++
            else if (result[i] === '}') depth--
            
            if (depth === 0) {
              end = i
              break
            }
          }
          
          if (end !== -1) {
            const cleanJson = result.substring(start, end + 1)
            try {
              return JSON.parse(cleanJson)
            } catch (e2) {
              console.error('Extracted AI output is still invalid JSON:', cleanJson.slice(0, 100))
            }
          }
        }
        console.error('AI output is not valid JSON:', result.slice(0, 100))
      }
    }
    return null
  }

  const timeoutPromise = new Promise((resolve) => 
    setTimeout(() => resolve('timeout'), TIMEOUT)
  )

  const requestTask = async () => {
    try {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body
        })
        if (res.ok) {
          const data = await res.json()
          return parseResult(data)
        }
      } catch (e) {}

      try {
        const response = await request(endpoint, {
          method: 'POST',
          headers,
          data: body
        })
        let data = typeof response === 'string' ? JSON.parse(response) : response
        return parseResult(data)
      } catch (e) {}
    } catch (err) {
      console.warn('Internal AI request task error:', err)
    }
    return null
  }

  try {
    return await Promise.race([requestTask(), timeoutPromise])
  } catch (err) {
    return null
  }
}

export default aiTrans
