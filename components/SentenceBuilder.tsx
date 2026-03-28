'use client'

import { useState, useEffect, useCallback } from 'react'
import type { SentenceExercise } from '@/types'

interface Props {
  exercise: SentenceExercise
  index: number
  total: number
  onCorrect: () => void
  onIncorrect: () => void
}

type Feedback = 'correct' | 'incorrect' | null

export default function SentenceBuilder({ exercise, index, total, onCorrect, onIncorrect }: Props) {
  const [bankWords, setBankWords] = useState<string[]>([])
  const [answerWords, setAnswerWords] = useState<string[]>([])
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [showTip, setShowTip] = useState(false)

  const reset = useCallback(() => {
    const shuffled = exercise.englishSentence
      .split(/\s+/)
      .sort(() => Math.random() - 0.5)
    setBankWords(shuffled)
    setAnswerWords([])
    setFeedback(null)
    setShowTip(false)
  }, [exercise])

  useEffect(() => { reset() }, [reset])

  function addWord(word: string, bankIdx: number) {
    setBankWords(prev => prev.filter((_, i) => i !== bankIdx))
    setAnswerWords(prev => [...prev, word])
  }

  function removeWord(word: string, ansIdx: number) {
    setAnswerWords(prev => prev.filter((_, i) => i !== ansIdx))
    setBankWords(prev => [...prev, word])
  }

  function verify() {
    const answer = answerWords.join(' ').toLowerCase().trim()
    const expected = exercise.englishSentence.toLowerCase().trim()
    if (answer === expected) {
      setFeedback('correct')
      setTimeout(() => { onCorrect() }, 1200)
    } else {
      setFeedback('incorrect')
      onIncorrect()
    }
  }

  function next() {
    setFeedback(null)
    onCorrect()
  }

  const progress = ((index + 1) / total) * 100

  return (
    <div className="flex flex-col gap-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--surface2)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'var(--accent)' }}
          />
        </div>
        <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>
          {index + 1}/{total}
        </span>
      </div>

      {/* Goal sentence in Portuguese */}
      <div className="rounded-xl p-4" style={{ background: 'var(--surface)' }}>
        <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>
          Traduza para o inglês:
        </p>
        <p className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
          {exercise.portugueseSentence}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'var(--accent)' + '22', color: 'var(--accent)' }}
          >
            {exercise.verbTense}
          </span>
          {exercise.tip && (
            <button
              onClick={() => setShowTip(t => !t)}
              className="text-xs underline"
              style={{ color: 'var(--muted)' }}
            >
              {showTip ? 'Esconder dica' : 'Ver dica'}
            </button>
          )}
        </div>
        {showTip && exercise.tip && (
          <p className="text-sm mt-2 italic" style={{ color: 'var(--warning)' }}>
            💡 {exercise.tip}
          </p>
        )}
      </div>

      {/* Answer area */}
      <div
        className="min-h-16 rounded-xl p-3 flex flex-wrap gap-2 items-start"
        style={{
          background: 'var(--surface)',
          border: '2px dashed',
          borderColor:
            feedback === 'correct' ? 'var(--success)' :
            feedback === 'incorrect' ? 'var(--error)' :
            'var(--surface2)',
        }}
      >
        {answerWords.length === 0 && (
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            Toque nas palavras abaixo para montar a frase...
          </span>
        )}
        {answerWords.map((w, i) => (
          <button
            key={`${w}-${i}`}
            onClick={() => feedback === null && removeWord(w, i)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: 'var(--accent)' + '22',
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
            }}
          >
            {w}
          </button>
        ))}
      </div>

      {/* Feedback message */}
      {feedback && (
        <div
          className="rounded-xl p-3 text-center font-semibold"
          style={{
            background: (feedback === 'correct' ? 'var(--success)' : 'var(--error)') + '22',
            color: feedback === 'correct' ? 'var(--success)' : 'var(--error)',
          }}
        >
          {feedback === 'correct' ? '✓ Correto! 🎉' : `✗ Quase! A resposta era: "${exercise.englishSentence}"`}
        </div>
      )}

      {/* Word bank */}
      <div>
        <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Banco de palavras:</p>
        <div className="flex flex-wrap gap-2">
          {bankWords.map((w, i) => (
            <button
              key={`${w}-${i}`}
              onClick={() => feedback === null && addWord(w, i)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{ background: 'var(--surface)', color: 'var(--text2)', border: '1px solid var(--surface2)' }}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-4 py-3 rounded-xl text-sm font-medium"
          style={{ background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--surface2)' }}
        >
          Reiniciar
        </button>
        {feedback === null ? (
          <button
            onClick={verify}
            disabled={answerWords.length === 0}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: answerWords.length > 0 ? 'var(--accent)' : 'var(--surface2)',
              color: answerWords.length > 0 ? '#0F1117' : 'var(--muted)',
            }}
          >
            Verificar
          </button>
        ) : (
          <button
            onClick={next}
            className="flex-1 py-3 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--accent)', color: '#0F1117' }}
          >
            Próxima →
          </button>
        )}
      </div>
    </div>
  )
}
