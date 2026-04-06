import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    ok: true,
    service: 'open-med-lite',
    mode: 'demo-stub',
    message: 'Backend stub online. Demo UI does not depend on this.',
  })
}

