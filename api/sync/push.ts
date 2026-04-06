import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Demo-only push endpoint.
 * Accepts payloads and acks without persisting (safe fallback, no backend required).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const body = typeof req.body === 'string' ? safeJson(req.body) : req.body
  const count = Array.isArray(body?.changes) ? body.changes.length : 0
  res.status(200).json({
    ok: true,
    accepted: count,
    checkpoint: new Date().toISOString(),
  })
}

function safeJson(input: string) {
  try {
    return JSON.parse(input)
  } catch {
    return null
  }
}

