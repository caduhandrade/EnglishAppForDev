'use client'

import { useState, useCallback } from 'react'

interface Props {
  expectedText: string
  onScore?: (score: number) => void
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s']/g, '').trim()
}

function computeScore(expected: string, spoken: string): number {
  const exp = normalize(expected).split(/\s+/)
  const spk = normalize(spoken).split(/\s+/)

  if (exp.length === 1) {
    // Levenshtein for single word
    const a = exp[0], b = spk[0] ?? ''
    const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
      Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    )
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++)
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    const dist = dp[a.length][b.length]
    return Math.max(0, Math.round((1 - dist / Math.max(a.length, 1)) * 100))
  }

  // Token intersection for multiple words
  const spkSet = new Set(spk)
  const matches = exp.filter(w => spkSet.has(w)).length
  return Math.round((matches / exp.length) * 100)
}

export default function SpeechButton({ expectedText, onScore }: Props) {
  const [listening, setListening] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [error, setError] = useState('')

  const listen = useCallback(() => {
    type SRConstructor = new () => {
      lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number;
      start(): void; stop(): void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onresult: ((e: any) => void) | null;
      onerror: (() => void) | null;
      onend: (() => void) | null;
    }
    const w = window as unknown as { SpeechRecognition?: SRConstructor; webkitSpeechRecognition?: SRConstructor }
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError('Seu browser não suporta reconhecimento de voz. Use Chrome ou Edge.')
      return
    }

    setError('')
    setScore(null)
    setListening(true)

    const rec = new SpeechRecognition()
    rec.lang = 'en-US'
    rec.continuous = false
    rec.interimResults = false
    rec.maxAlternatives = 1

    const timeout = setTimeout(() => rec.stop(), 8000)

    rec.onresult = (e) => {
      clearTimeout(timeout)
      const spoken = e.results[0][0]?.transcript ?? ''
      const s = computeScore(expectedText, spoken)
      setScore(s)
      onScore?.(s)
    }

    rec.onerror = () => {
      clearTimeout(timeout)
      setError('Não foi possível ouvir. Tente novamente.')
    }

    rec.onend = () => {
      clearTimeout(timeout)
      setListening(false)
    }

    rec.start()
  }, [expectedText, onScore])

  const scoreColor = score === null ? '' :
    score >= 90 ? 'var(--success)' :
    score >= 70 ? 'var(--blue)' :
    score >= 50 ? 'var(--warning)' :
    'var(--error)'

  const scoreMsg = score === null ? '' :
    score >= 90 ? '✓ Excelente!' :
    score >= 70 ? '✓ Bom!' :
    score >= 50 ? '⚠ Tente novamente' :
    '✗ Difícil! Ouça e repita'

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={listen}
        disabled={listening}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
        style={{
          background: listening ? 'var(--error)' : 'var(--surface)',
          color: listening ? '#fff' : 'var(--accent)',
          border: '1px solid',
          borderColor: listening ? 'var(--error)' : 'var(--accent)',
        }}
      >
        <span className={listening ? 'pulse-recording' : ''}>
          {listening ? '🔴' : '🎤'}
        </span>
        {listening ? 'Ouvindo...' : 'Pronunciar'}
      </button>

      {score !== null && (
        <div className="text-sm font-semibold" style={{ color: scoreColor }}>
          {scoreMsg} ({score}%)
        </div>
      )}

      {error && (
        <div className="text-xs text-center" style={{ color: 'var(--error)' }}>
          {error}
        </div>
      )}
    </div>
  )
}
