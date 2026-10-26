import { useState } from 'react'

export default function BlockCalculator() {
  const [value, setValue] = useState('')
  const [unit, setUnit] = useState('bytes')

  const trimmed = value.trim()
  const num = Number(trimmed)
  let blocks = 0
  let overLimit = false
  let isInvalid = false

  if (trimmed !== '') {
    if (isNaN(num) || num < 0) {
      isInvalid = true
    } else if (num > 0) {
      const bytes = unit === 'mib' ? num * 1048576 : num
      blocks = Math.ceil(bytes / 65536)
      overLimit = bytes > 10485760
    }
  }

  const maxNote = 'The app limit is 10 MiB (10,485,760 bytes), which equals at most 160 blocks.'

  return (
    <div className="calculator">
      <div className="calculator-label">/// Block Calculator</div>
      <div className="calc-row">
        <div className="calc-field">
          <label htmlFor="calc-input">File size</label>
          <input
            id="calc-input"
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={unit === 'bytes' ? 'e.g. 131072' : 'e.g. 1.5'}
            aria-describedby="calc-result"
          />
        </div>
        <div className="calc-unit-btns" role="group" aria-label="Unit selection">
          <button
            className={unit === 'bytes' ? 'active' : ''}
            onClick={() => { setUnit('bytes'); setValue(''); }}
            aria-pressed={unit === 'bytes'}
          >Bytes</button>
          <button
            className={unit === 'mib' ? 'active' : ''}
            onClick={() => { setUnit('mib'); setValue(''); }}
            aria-pressed={unit === 'mib'}
          >MiB</button>
        </div>
      </div>
      <div id="calc-result" aria-live="polite" aria-atomic="true">
        <span className="calc-result">
          {blocks}
          <span className="calc-result-label">blocks</span>
        </span>
        {isInvalid && (
          <div className="calc-note calc-warn">Please enter a valid non-negative number.</div>
        )}
        {overLimit && (
          <div className="calc-note calc-warn">Exceeds the 10 MiB application limit.</div>
        )}
      </div>
      <div className="calc-note">{maxNote}</div>
    </div>
  )
}
