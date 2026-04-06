import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Demo-only pull endpoint.
 * Returns an empty change set so the UI remains fully local-first.
 */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    ok: true,
    changes: [],
    checkpoint: new Date().toISOString(),
  })
}

