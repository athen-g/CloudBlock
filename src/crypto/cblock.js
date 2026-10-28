// Browser port of storage.py. Produces and reads the same .cblock archive
// format, so files encrypted here can be recovered with decrypt.py and vice versa.
// Everything runs through the Web Crypto API; nothing is sent over the network.

export const BLOCK = 65536
export const LIMIT = 10 * 1024 * 1024
export const ITERATIONS = 600000
export const MIN_PASSWORD = 12
const MAX_ENTRIES = 162 // manifest.json + 160 blocks + 2 slack, same as storage.py

const enc = new TextEncoder()
const subtle = () => {
  const s = globalThis.crypto && globalThis.crypto.subtle
  if (!s) throw new Error('Web Crypto is unavailable. Open this page over HTTPS.')
  return s
}

const toHex = (u8) => Array.from(u8, (b) => b.toString(16).padStart(2, '0')).join('')
const fromHex = (s) => {
  if (typeof s !== 'string' || s.length % 2 || !/^[0-9a-f]*$/i.test(s)) {
    throw new Error('Invalid manifest.')
  }
  const out = new Uint8Array(s.length / 2)
  for (let i = 0; i < out.length; i++) out[i] = parseInt(s.substr(i * 2, 2), 16)
  return out
}

// ---------- key derivation ----------

function checkPassword(password) {
  if (typeof password !== 'string' || [...password].length < MIN_PASSWORD) {
    throw new Error(`Use a password with at least ${MIN_PASSWORD} characters.`)
  }
  // Python would refuse to encode lone surrogates; TextEncoder would silently
  // replace them, which would derive a different key. Refuse instead.
  if (/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(password)) {
    throw new Error('Password contains invalid characters.')
  }
}

async function deriveKey(password, salt, usage) {
  checkPassword(password)
  const base = await subtle().importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await subtle().deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS },
    base,
    256
  )
  return subtle().importKey('raw', bits, 'AES-GCM', false, [usage])
}

// ---------- manifest (byte-identical to Python's canonical json.dumps) ----------

// json.dumps(..., sort_keys=True, separators=(',', ':')) with ensure_ascii=True.
function pyJsonString(s) {
  let out = '"'
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    const code = s.charCodeAt(i)
    if (c === '"') out += '\\"'
    else if (c === '\\') out += '\\\\'
    else if (c === '\n') out += '\\n'
    else if (c === '\r') out += '\\r'
    else if (c === '\t') out += '\\t'
    else if (c === '\b') out += '\\b'
    else if (c === '\f') out += '\\f'
    else if (code < 0x20 || code > 0x7e) out += '\\u' + code.toString(16).padStart(4, '0')
    else out += c
  }
  return out + '"'
}

function canonicalManifest(m) {
  // keys in sorted order
  return (
    '{"block_size":' + m.block_size +
    ',"count":' + m.count +
    ',"iterations":' + m.iterations +
    ',"name":' + pyJsonString(m.name) +
    ',"salt":"' + m.salt + '"' +
    ',"sha256":"' + m.sha256 + '"' +
    ',"size":' + m.size +
    ',"version":' + m.version + '}'
  )
}

function blockAad(header, i) {
  const tail = enc.encode(':' + i)
  const aad = new Uint8Array(header.length + tail.length)
  aad.set(header, 0)
  aad.set(tail, header.length)
  return aad
}

const blockName = (i) => `blocks/${String(i).padStart(6, '0')}.enc`
const blockCount = (size) => Math.max(1, Math.ceil(size / BLOCK))

// Mirrors the server's filename handling: last path segment, at most 150 characters.
export function cleanName(name) {
  const last = String(name || '').replace(/\\/g, '/').split('/').pop()
  return [...last].slice(0, 150).join('') || 'file.bin'
}

// ---------- minimal ZIP (stored entries only) ----------

const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(u8) {
  let c = 0xffffffff
  for (let i = 0; i < u8.length; i++) c = CRC_TABLE[(c ^ u8[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function writeZip(entries) {
  // entries: [{ name: string, data: Uint8Array }]
  const DOS_TIME = 0
  const DOS_DATE = (0 << 9) | (1 << 5) | 1 // 1980-01-01
  const locals = []
  const centrals = []
  let offset = 0
  for (const e of entries) {
    const name = enc.encode(e.name)
    const crc = crc32(e.data)
    const lh = new DataView(new ArrayBuffer(30))
    lh.setUint32(0, 0x04034b50, true)
    lh.setUint16(4, 20, true)
    lh.setUint16(6, 0, true)
    lh.setUint16(8, 0, true)
    lh.setUint16(10, DOS_TIME, true)
    lh.setUint16(12, DOS_DATE, true)
    lh.setUint32(14, crc, true)
    lh.setUint32(18, e.data.length, true)
    lh.setUint32(22, e.data.length, true)
    lh.setUint16(26, name.length, true)
    lh.setUint16(28, 0, true)
    locals.push(new Uint8Array(lh.buffer), name, e.data)

    const ch = new DataView(new ArrayBuffer(46))
    ch.setUint32(0, 0x02014b50, true)
    ch.setUint16(4, 20, true)
    ch.setUint16(6, 20, true)
    ch.setUint16(8, 0, true)
    ch.setUint16(10, 0, true)
    ch.setUint16(12, DOS_TIME, true)
    ch.setUint16(14, DOS_DATE, true)
    ch.setUint32(16, crc, true)
    ch.setUint32(20, e.data.length, true)
    ch.setUint32(24, e.data.length, true)
    ch.setUint16(28, name.length, true)
    ch.setUint32(42, offset, true)
    centrals.push(new Uint8Array(ch.buffer), name)

    offset += 30 + name.length + e.data.length
  }
  const cdSize = centrals.reduce((n, p) => n + p.length, 0)
  const end = new DataView(new ArrayBuffer(22))
  end.setUint32(0, 0x06054b50, true)
  end.setUint16(8, entries.length, true)
  end.setUint16(10, entries.length, true)
  end.setUint32(12, cdSize, true)
  end.setUint32(16, offset, true)

  const parts = [...locals, ...centrals, new Uint8Array(end.buffer)]
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0))
  let pos = 0
  for (const p of parts) {
    out.set(p, pos)
    pos += p.length
  }
  return out
}

function readZip(buf) {
  const bad = () => new Error('Invalid archive.')
  if (buf.length < 22) throw bad()
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)

  let eocd = -1
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 22 - 65535); i--) {
    if (dv.getUint32(i, true) === 0x06054b50) {
      eocd = i
      break
    }
  }
  if (eocd < 0) throw bad()
  const total = dv.getUint16(eocd + 10, true)
  const cdSize = dv.getUint32(eocd + 12, true)
  const cdOffset = dv.getUint32(eocd + 16, true)
  if (total === 0xffff || cdSize === 0xffffffff || cdOffset === 0xffffffff) throw bad() // zip64
  if (total > MAX_ENTRIES) throw new Error('Invalid archive dimensions.')
  if (cdOffset + cdSize > eocd) throw bad()

  const dec = new TextDecoder('utf-8', { fatal: true })
  const files = new Map()
  let p = cdOffset
  for (let n = 0; n < total; n++) {
    if (p + 46 > buf.length || dv.getUint32(p, true) !== 0x02014b50) throw bad()
    const flags = dv.getUint16(p + 8, true)
    const method = dv.getUint16(p + 10, true)
    const crc = dv.getUint32(p + 16, true)
    const csize = dv.getUint32(p + 20, true)
    const usize = dv.getUint32(p + 24, true)
    const nlen = dv.getUint16(p + 28, true)
    const elen = dv.getUint16(p + 30, true)
    const clen = dv.getUint16(p + 32, true)
    const lho = dv.getUint32(p + 42, true)
    if (flags & 1 || method !== 0 || csize !== usize) throw bad()
    if (usize > LIMIT) throw new Error('Invalid archive dimensions.')
    let name
    try {
      name = dec.decode(buf.subarray(p + 46, p + 46 + nlen))
    } catch {
      throw bad()
    }
    if (files.has(name)) throw new Error('Missing or duplicate archive entries.')

    if (lho + 30 > buf.length || dv.getUint32(lho, true) !== 0x04034b50) throw bad()
    const dataStart = lho + 30 + dv.getUint16(lho + 26, true) + dv.getUint16(lho + 28, true)
    if (dataStart + usize > buf.length) throw bad()
    const data = buf.subarray(dataStart, dataStart + usize)
    if (crc32(data) !== crc) throw bad()
    files.set(name, data)
    p += 46 + nlen + elen + clen
  }
  return files
}

// ---------- public API ----------

export async function encrypt(data, name, password) {
  if (!(data instanceof Uint8Array)) throw new Error('Expected file bytes.')
  if (data.length > LIMIT) throw new Error('File exceeds the 10 MiB limit.')
  checkPassword(password)

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const digest = new Uint8Array(await subtle().digest('SHA-256', data))
  const meta = {
    version: 1,
    name: cleanName(name),
    size: data.length,
    block_size: BLOCK,
    count: blockCount(data.length),
    salt: toHex(salt),
    iterations: ITERATIONS,
    sha256: toHex(digest),
  }
  const header = enc.encode(canonicalManifest(meta))
  const key = await deriveKey(password, salt, 'encrypt')

  const entries = [{ name: 'manifest.json', data: header }]
  for (let i = 0; i < meta.count; i++) {
    const nonce = crypto.getRandomValues(new Uint8Array(12))
    const ct = new Uint8Array(
      await subtle().encrypt(
        { name: 'AES-GCM', iv: nonce, additionalData: blockAad(header, i), tagLength: 128 },
        key,
        data.subarray(i * BLOCK, (i + 1) * BLOCK)
      )
    )
    const body = new Uint8Array(12 + ct.length)
    body.set(nonce, 0)
    body.set(ct, 12)
    entries.push({ name: blockName(i), data: body })
  }
  return { archive: writeZip(entries), meta }
}

export async function decrypt(archive, password) {
  if (!(archive instanceof Uint8Array)) throw new Error('Expected archive bytes.')
  if (archive.length > LIMIT + 100000) throw new Error('Archive exceeds limit.')

  const files = readZip(archive)
  const header = files.get('manifest.json')
  if (!header) throw new Error('Missing or duplicate archive entries.')
  let m
  try {
    m = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(header))
  } catch {
    throw new Error('Invalid manifest.')
  }
  if (
    !m ||
    m.version !== 1 ||
    m.iterations !== ITERATIONS ||
    m.block_size !== BLOCK ||
    !Number.isInteger(m.size) ||
    !(m.size >= 0 && m.size <= LIMIT) ||
    m.count !== blockCount(m.size) ||
    typeof m.sha256 !== 'string' ||
    typeof m.name !== 'string'
  ) {
    throw new Error('Invalid manifest.')
  }

  const expected = new Set(['manifest.json'])
  for (let i = 0; i < m.count; i++) expected.add(blockName(i))
  if (files.size !== expected.size || [...files.keys()].some((k) => !expected.has(k))) {
    throw new Error('Missing or duplicate archive entries.')
  }

  const salt = fromHex(m.salt)
  if (salt.length !== 16) throw new Error('Invalid manifest.')
  const key = await deriveKey(password, salt, 'decrypt')

  const out = new Uint8Array(m.size)
  let pos = 0
  for (let i = 0; i < m.count; i++) {
    const b = files.get(blockName(i))
    if (b.length < 12 + 16) throw new Error('Invalid archive.')
    let pt
    try {
      pt = new Uint8Array(
        await subtle().decrypt(
          { name: 'AES-GCM', iv: b.subarray(0, 12), additionalData: blockAad(header, i), tagLength: 128 },
          key,
          b.subarray(12)
        )
      )
    } catch {
      throw new Error('Decryption failed: wrong password, or the archive was modified.')
    }
    if (pos + pt.length > m.size) throw new Error('Integrity check failed.')
    out.set(pt, pos)
    pos += pt.length
  }
  const digest = toHex(new Uint8Array(await subtle().digest('SHA-256', out)))
  if (pos !== m.size || digest !== m.sha256.toLowerCase()) throw new Error('Integrity check failed.')
  return { data: out, meta: m }
}
