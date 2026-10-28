import { useState, useRef, useEffect } from 'react'
import { encrypt, decrypt, cleanName, LIMIT, MIN_PASSWORD } from '../crypto/cblock'

const fmt = (n) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KiB` : `${(n / 1048576).toFixed(2)} MiB`)

export default function BrowserTool() {
  const [mode, setMode] = useState('encrypt')
  const [file, setFile] = useState(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null) // { url, filename, rows }
  const fileInput = useRef(null)

  // Release the generated download whenever it is replaced or the page unmounts.
  useEffect(() => () => result && URL.revokeObjectURL(result.url), [result])

  const reset = () => {
    setResult(null)
    setError('')
  }

  const switchMode = (m) => {
    if (busy || m === mode) return
    setMode(m)
    setFile(null)
    setPassword('')
    setConfirm('')
    reset()
    if (fileInput.current) fileInput.current.value = ''
  }

  const onFile = (e) => {
    reset()
    const f = e.target.files && e.target.files[0]
    setFile(f || null)
  }

  const run = async (e) => {
    e.preventDefault()
    reset()
    if (!file) return setError('Choose a file first.')
    const limit = mode === 'encrypt' ? LIMIT : LIMIT + 100000
    if (file.size > limit) {
      return setError(mode === 'encrypt' ? 'File exceeds the 10 MiB limit.' : 'Archive exceeds limit.')
    }
    if ([...password].length < MIN_PASSWORD) {
      return setError(`Use a password with at least ${MIN_PASSWORD} characters.`)
    }
    if (mode === 'encrypt' && password !== confirm) {
      return setError('The two passwords do not match.')
    }

    setBusy(true)
    try {
      const bytes = new Uint8Array(await file.arrayBuffer())
      if (mode === 'encrypt') {
        const { archive, meta } = await encrypt(bytes, file.name, password)
        const url = URL.createObjectURL(new Blob([archive], { type: 'application/zip' }))
        setResult({
          url,
          filename: `${cleanName(file.name)}.cblock`,
          label: 'Download .cblock archive',
          summary: 'Encrypted in this browser tab. Keep the password: it cannot be recovered.',
          rows: [
            ['File', meta.name],
            ['Original size', fmt(meta.size)],
            ['Blocks', `${meta.count} × 64 KiB`],
            ['Archive size', fmt(archive.length)],
            ['SHA-256 (plaintext)', meta.sha256],
          ],
        })
      } else {
        const { data, meta } = await decrypt(bytes, password)
        const url = URL.createObjectURL(new Blob([data], { type: 'application/octet-stream' }))
        setResult({
          url,
          filename: cleanName(meta.name),
          label: 'Download recovered file',
          summary: 'Every block authenticated and the SHA-256 digest matched.',
          rows: [
            ['File', meta.name],
            ['Recovered size', fmt(data.length)],
            ['Blocks verified', String(meta.count)],
            ['SHA-256 (verified)', meta.sha256],
          ],
        })
      }
      setPassword('')
      setConfirm('')
    } catch (err) {
      setError(err && err.message ? err.message : 'Operation failed.')
    } finally {
      setBusy(false)
    }
  }

  const isEnc = mode === 'encrypt'

  return (
    <form className="calculator tool" onSubmit={run} noValidate>
      <div className="calculator-label">/// In-Browser Tool</div>

      <div className="calc-unit-btns tool-tabs" role="group" aria-label="Operation">
        <button type="button" className={isEnc ? 'active' : ''} aria-pressed={isEnc} onClick={() => switchMode('encrypt')}>
          Split &amp; encrypt
        </button>
        <button type="button" className={!isEnc ? 'active' : ''} aria-pressed={!isEnc} onClick={() => switchMode('decrypt')}>
          Recover
        </button>
      </div>

      <div className="calc-field tool-field">
        <label htmlFor="tool-file">{isEnc ? 'File (max 10 MiB)' : '.cblock archive'}</label>
        <input id="tool-file" ref={fileInput} type="file" onChange={onFile} disabled={busy} accept={isEnc ? undefined : '.cblock,application/zip'} />
        {file && <div className="calc-note">{file.name} — {fmt(file.size)}</div>}
      </div>

      <div className="calc-field tool-field">
        <label htmlFor="tool-pass">Password (at least {MIN_PASSWORD} characters)</label>
        <input
          id="tool-pass"
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError('') }}
          autoComplete={isEnc ? 'new-password' : 'current-password'}
          spellCheck={false}
          disabled={busy}
        />
      </div>

      {isEnc && (
        <div className="calc-field tool-field">
          <label htmlFor="tool-confirm">Confirm password</label>
          <input
            id="tool-confirm"
            type="password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setError('') }}
            autoComplete="new-password"
            spellCheck={false}
            disabled={busy}
          />
        </div>
      )}

      <button type="submit" className="tool-submit" disabled={busy}>
        {busy ? 'Working…' : isEnc ? 'Split and encrypt' : 'Verify and recover'}
      </button>

      <div className="tool-status" role="status" aria-live="polite">
        {busy && (
          <div className="calc-note">
            Deriving key (PBKDF2, 600,000 iterations) and processing blocks. This can take a moment.
          </div>
        )}
        {error && <div className="calc-note calc-warn">{error}</div>}
        {result && (
          <div className="tool-result">
            <div className="calc-note">{result.summary}</div>
            <dl className="tool-rows">
              {result.rows.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <a className="tool-download" href={result.url} download={result.filename}>
              {result.label}
            </a>
          </div>
        )}
      </div>
    </form>
  )
}
