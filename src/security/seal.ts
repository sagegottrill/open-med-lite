export type Seal = {
  alg: 'SHA-256'
  hashHex: string
  sealedAt: string
}

function toHex(bytes: ArrayBuffer) {
  const u8 = new Uint8Array(bytes)
  let out = ''
  for (let i = 0; i < u8.length; i++) out += u8[i]!.toString(16).padStart(2, '0')
  return out
}

/**
 * Produces a deterministic hash for a JSON-like payload.
 * Note: This is a seal (integrity marker), not encryption.
 */
export async function sealJson(payload: unknown): Promise<Seal> {
  const data = new TextEncoder().encode(JSON.stringify(payload))
  const digest = await crypto.subtle.digest('SHA-256', data)
  return {
    alg: 'SHA-256',
    hashHex: toHex(digest),
    sealedAt: new Date().toISOString(),
  }
}

