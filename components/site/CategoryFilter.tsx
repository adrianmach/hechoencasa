'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CATEGORY_COLOR, CATEGORY_LABEL } from '@/lib/categories'
import type { ProductCategory } from '@/types/database'

const CATEGORIES: { value: ProductCategory | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'tortas', label: CATEGORY_LABEL.tortas },
  { value: 'postres', label: CATEGORY_LABEL.postres },
  { value: 'alfajores', label: CATEGORY_LABEL.alfajores },
  { value: 'temporada', label: CATEGORY_LABEL.temporada },
]

const ACTIVE_CLASS: Record<string, string> = {
  rose: 'border-rose bg-rose text-text',
  lavender: 'border-lavender bg-lavender text-text',
  sand: 'border-sand bg-sand text-text',
  sage: 'border-sage bg-sage text-text',
}

export function CategoryFilter({ active }: { active: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('categoria', value)
    } else {
      params.delete('categoria')
    }
    const query = params.toString()
    router.push(query ? `/catalogo?${query}` : '/catalogo')
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 md:justify-start">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.value
        const activeClass = cat.value
          ? ACTIVE_CLASS[CATEGORY_COLOR[cat.value]]
          : 'border-gold bg-gold text-cream'
        return (
          <button
            key={cat.value}
            onClick={() => select(cat.value)}
            className={`border px-4 py-1.5 font-body text-sm transition-colors duration-300 ${
              isActive ? activeClass : 'border-gold/30 text-text hover:border-gold'
            }`}
          >
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
