'use client'

import type { Category } from '@/types'

interface Props {
  categories: Category[]
  selected: number | null
  onChange: (id: number | null) => void
}

export default function CategorySelector({ categories, selected, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onChange(null)}
        className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
        style={{
          background: selected === null ? 'var(--accent)' : 'var(--surface)',
          color: selected === null ? '#0F1117' : 'var(--text2)',
          border: '1px solid',
          borderColor: selected === null ? 'var(--accent)' : 'var(--surface2)',
        }}
      >
        Todas
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1"
          style={{
            background: selected === cat.id ? cat.color + '22' : 'var(--surface)',
            color: selected === cat.id ? cat.color : 'var(--text2)',
            border: '1px solid',
            borderColor: selected === cat.id ? cat.color : 'var(--surface2)',
          }}
        >
          <span>{cat.icon}</span>
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  )
}
