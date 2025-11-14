// /server/api/translate.post.ts
import { readBody, sendError, createError } from 'h3'
import OpenAI from 'openai'

export default defineEventHandler(async (event) => {
  try {
    // Read + validate
    const body = await readBody(event)
    if (!body || typeof body.text !== 'string' || !body.text.trim()) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'Missing or empty text' }))
    }

    // Get API key from runtime config (server-side only)
    const cfg = useRuntimeConfig()
    const OPENAI_KEY = cfg.OPENAI_API_KEY
    if (!OPENAI_KEY) {
      console.error('[translate] ERROR: OPENAI_API_KEY missing in runtime config')
      return sendError(event, createError({ statusCode: 500, statusMessage: 'Server missing OpenAI key' }))
    }

    // Initialize OpenAI client
    const client = new OpenAI({ apiKey: OPENAI_KEY })

    // Build prompt
    const from = body.from || 'en'
    const to = body.to || 'ml'
    const prompt = `Translate the following text from ${from} to ${to}. Preserve names, code fragments, and formatting. Output only the translation.\n\n${body.text}`

    // Model selection & fallback
    const requestedModel = body.model || 'gpt-4o-mini'
    const fallbackModel = 'gpt-4o-mini'

    async function callModel(modelName: string) {
      return client.responses.create({
        model: modelName,
        input: prompt,
        max_output_tokens: 1200
      })
    }

    let resp: any = null
    try {
      resp = await Promise.race([
        callModel(requestedModel),
        new Promise((_, rej) => setTimeout(() => rej(new Error('OpenAI request timed out')), 20000))
      ])
      console.log('[translate] used model:', requestedModel)
    } catch (err: any) {
      const status = err?.response?.status
      const dataCode = err?.response?.data?.error?.code || err?.response?.data?.error?.type || ''
      console.warn('[translate] primary model error:', err?.message || err, 'status:', status, 'code:', dataCode)

      if (status === 404 || dataCode === 'model_not_found' || status === 403) {
        // try fallback
        try {
          resp = await Promise.race([
            callModel(fallbackModel),
            new Promise((_, rej) => setTimeout(() => rej(new Error('OpenAI request timed out')), 20000))
          ])
          console.log('[translate] fallback model used:', fallbackModel)
        } catch (err2: any) {
          console.error('[translate] fallback model error:', err2?.message || err2)
          return sendError(event, createError({ statusCode: 500, statusMessage: 'OpenAI API request failed (primary+fallback)' }))
        }
      } else {
        console.error('[translate] OpenAI error (non-model):', err?.message || err)
        return sendError(event, createError({ statusCode: 500, statusMessage: 'OpenAI API request failed - see server logs' }))
      }
    }

    // Extract translation robustly
    let translation = ''
    try {
      if (resp?.output && Array.isArray(resp.output)) {
        for (const block of resp.output) {
          if (Array.isArray(block.content)) {
            for (const c of block.content) {
              if (typeof c === 'string') translation += c
              else if (c?.text) translation += c.text
            }
          } else if (typeof block === 'string') {
            translation += block
          }
        }
      }
      if (!translation && resp?.output_text) translation = resp.output_text
      if (!translation && resp?.choices?.[0]?.message?.content) translation = resp.choices[0].message.content
    } catch (ex) {
      console.error('[translate] error extracting translation:', ex)
    }

    translation = (translation || '').trim()
    if (!translation) {
      console.warn('[translate] empty translation returned by model')
      return { translation: '' }
    }

    // Success
    return { translation }
  } catch (err: any) {
    console.error('[translate] unexpected handler error:', err?.message || err)
    if (err?.stack) console.error(err.stack)
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Translation failed on server' }))
  }
})
