'use client'

import { useState } from 'react'
import type { Flashcard } from '@/types'
import SpeechButton from './SpeechButton'

interface Props {
  card: Flashcard
  index: number
  total: number
  onKnow: () => void
  onDontKnow: () => void
}

const DIFF_LABEL: Record<number, string> = { 1: 'Fácil', 2: 'Médio', 3: 'Difícil' }
const DIFF_COLOR: Record<number, string> = {
  1: 'var(--success)',
  2: 'var(--warning)',
  3: 'var(--error)',
}

export default function FlashCard({ card, index, total, onKnow, onDontKnow }: Props) {
  const [flipped, setFlipped] = useState(false)

  function speak() {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()

    const utt = new SpeechSynthesisUtterance(card.englishText)
    utt.lang = 'en-US'
    utt.rate = 0.85

    const doSpeak = () => {
      const voices = window.speechSynthesis.getVoices()
      const enVoice = voices.find(v => v.lang === 'en-US') ?? voices.find(v => v.lang.startsWith('en'))
      if (enVoice) utt.voice = enVoice
      window.speechSynthesis.speak(utt)
    }

    // Voices may not be loaded yet on first call
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      doSpeak()
    } else {
      window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true })
    }
  }

  function handleFeedback(knew: boolean) {
    setFlipped(false)
    if (knew) onKnow(); else onDontKnow()
  }

  const progress = ((index + 1) / total) * 100

  return (
    <div className="flex flex-col gap-4">
      {/* Progress bar */}
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

      {/* Card */}
      <div
        className="flip-card w-full cursor-pointer"
        style={{ height: 280 }}
        onClick={() => setFlipped(f => !f)}
      >
        <div className={`flip-card-inner${flipped ? ' flipped' : ''}`}>
          {/* Front */}
          <div
            className="flip-card-front rounded-2xl p-6 flex flex-col justify-between"
            style={{ background: 'var(--surface)' }}
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
              >
                {card.type}
              </span>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: DIFF_COLOR[card.difficulty] + '22', color: DIFF_COLOR[card.difficulty] }}
              >
                {DIFF_LABEL[card.difficulty]}
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-4">
              <p
                className="text-2xl font-bold text-center leading-snug"
                style={{ color: 'var(--text)' }}
              >
                {card.englishText}
              </p>
              {card.verbTense && (
                <span
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ background: 'var(--accent)' + '22', color: 'var(--accent)' }}
                >
                  {card.verbTense}
                </span>
              )}
            </div>

            <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
              Toque para revelar
            </p>
          </div>

          {/* Back */}
          <div
            className="flip-card-back rounded-2xl p-6 flex flex-col justify-between"
            style={{ background: 'var(--surface)' }}
          >
            <div />

            <div className="flex flex-col items-center gap-3 py-2">
              <p
                className="text-xl font-bold text-center"
                style={{ color: 'var(--accent)' }}
              >
                {card.portugueseText}
              </p>
              {card.exampleSentence && (
                <div className="w-full rounded-xl p-4" style={{ background: 'var(--surface2)' }}>
                  <p className="text-sm italic" style={{ color: 'var(--text2)' }}>
                    &ldquo;{card.exampleSentence}&rdquo;
                  </p>
                  {card.exampleTranslation && (
                    <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                      {card.exampleTranslation}
                    </p>
                  )}
                </div>
              )}
            </div>

            <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
              Toque para virar de volta
            </p>
          </div>
        </div>
      </div>

      {/* TTS + Speech recognition — fora do card para evitar problemas com 3D transforms */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={speak}
          className="text-sm px-5 py-2.5 rounded-full font-medium"
          style={{ background: 'var(--surface)', color: 'var(--text2)', border: '1px solid var(--surface2)' }}
        >
          🔊 Ouvir
        </button>
        <SpeechButton expectedText={card.englishText} />
      </div>

      {/* Know/Don't know buttons */}
      {flipped && (
        <div className="flex gap-3">
          <button
            onClick={() => handleFeedback(false)}
            className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: 'var(--error)' + '22', color: 'var(--error)', border: '1px solid var(--error)' }}
          >
            ✗ Não sei
          </button>
          <button
            onClick={() => handleFeedback(true)}
            className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: 'var(--success)' + '22', color: 'var(--success)', border: '1px solid var(--success)' }}
          >
            ✓ Sei!
          </button>
        </div>
      )}
    </div>
  )
}
