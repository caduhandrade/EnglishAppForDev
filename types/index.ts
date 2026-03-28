export interface Category {
  id: number
  name: string
  namePT: string
  icon: string
  color: string
  description: string
}

export interface Flashcard {
  id: number
  categoryId: number
  englishText: string
  portugueseText: string
  exampleSentence: string
  exampleTranslation: string
  verbTense: string
  type: string
  difficulty: number
  contextTag: string
}

export interface SentenceExercise {
  id: number
  categoryId: number
  englishSentence: string
  portugueseSentence: string
  verbTense: string
  contextTag: string
  difficulty: number
  tip: string
}

export interface UserProgress {
  id: number
  itemId: number
  itemType: string
  isCorrect: boolean
  timestamp: string
  categoryId: number
}

export interface Stats {
  total: number
  correct: number
  incorrect: number
  streak: number
  accuracy: number
}

export interface CategoryStats {
  categoryId: number
  total: number
  correct: number
  accuracy: number
}
